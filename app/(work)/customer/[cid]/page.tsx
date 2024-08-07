import React from "react";
import { auth } from "@/auth";
import prisma from "@/db";

import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { updatePM } from "../actions";
import Link from "next/link";

const page = async ({ params }: { params: { cid: string } }) => {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      id: session?.user.sub,
    },
    include: {
      group: {
        include: {
          members: true,
        },
      },
    },
  });
  const group = await prisma.group.findUnique({
    where: {
      id: params.cid,
    },
    include: {
      owner: true,
      manager: true,
      projects: {
        include: {
          tasks: {
            include: {
              workers: {
                include: {
                  worker: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return (
    <div className="flex flex-col p-8 w-full gap-8">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">{group?.name}</h1>
        {(session?.user.role == "WORKER" ||
          session?.user.role == "MANAGER") && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant={"outline"}>전담PM 수정</Button>
            </DialogTrigger>
            <DialogContent className="w-96">
              <form className="flex flex-col gap-8" action={updatePM}>
                <DialogHeader>
                  <DialogTitle>전담 PM 배정</DialogTitle>
                </DialogHeader>
                <div className="flex justify-between items-center">
                  <Label>전담 PM</Label>
                  <Select name="managerId">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="PM 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {user?.group?.members.map((member, i) => (
                        <SelectItem key={i} value={member.id}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter className="sm:justify-start">
                  <DialogClose asChild>
                    <Button
                      type="submit"
                      variant={"default"}
                      className="w-full"
                    >
                      배정하기
                    </Button>
                  </DialogClose>
                </DialogFooter>
                <input type="hidden" name="cid" value={params.cid} />
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>
      {/* <div>{JSON.stringify(group)}</div> */}
      {/* <div>{JSON.stringify(user)}</div> */}
      <div className="grid grid-cols-3 p-6 gap-4 bg-slate-50 rounded-lg ">
        <div className="flex gap-8">
          <div className="font-semibold">그룹 관리자</div>
          <div>{group?.owner.name}</div>
        </div>
        <div className="flex gap-8">
          <div className="font-semibold">그룹 이메일</div>
          <div>{group?.email}</div>
        </div>
        <div className="flex gap-8">
          <div className="font-semibold">플랜</div>
          <div>프로</div>
        </div>
        <div className="flex gap-8">
          <div className="font-semibold">전담 PM</div>
          <div>{group?.manager?.name}</div>
        </div>
        <div className="flex gap-8">
          <div className="font-semibold">그룹 연락처</div>
          <div>{group?.phone}</div>
        </div>
        <div className="flex gap-8">
          <div className="font-semibold">플랜 기간</div>
          <div>2024.05.20~2024.08.20</div>
        </div>
      </div>

      <Tabs defaultValue="thread" className="">
        <TabsList>
          <TabsTrigger value="thread">프로젝트</TabsTrigger>
          <TabsTrigger value="wbs">WBS</TabsTrigger>
        </TabsList>
        <TabsContent value="thread">
          <Table className="border">
            <TableHeader className="bg-neutral-50">
              <TableRow>
                <TableHead className="">작업 이름</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>전담 PM</TableHead>
                <TableHead>작업자</TableHead>
                <TableHead>시작일</TableHead>
                <TableHead>종료일</TableHead>
                <TableHead>진척률</TableHead>
                <TableHead>난이도</TableHead>
                <TableHead>고객</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {group?.projects.map((project, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">
                    <Link href={`/project/${project.id}`}>{project.name}</Link>
                  </TableCell>
                  <TableCell>{project.status}</TableCell>
                  <TableCell>{group.manager?.name}</TableCell>
                  <TableCell>
                    <div className="flex gap-4">
                      {Array.from(
                        new Set(
                          project.tasks
                            .flatMap((task) => task.workers)
                            .map((worker) => worker.worker.name),
                        ),
                      ).map((worker, i) => (
                        <div key={i}>{worker}</div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    {project.startDate?.toLocaleDateString()}
                  </TableCell>
                  <TableCell>{project.endDate?.toLocaleDateString()}</TableCell>
                  <TableCell>40%</TableCell>
                  <TableCell>{project.difficulty}</TableCell>
                  <TableCell>{group.name}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="wbs">
          <div className="flex flex-col gap-8 p-4">
            {group?.projects.map((project, i) => (
              <div key={i} className="flex flex-col">
                <h2 className="text-lg font-semibold">{project.name}</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">작업</TableHead>
                      <TableHead>작업자</TableHead>
                      <TableHead>시작일</TableHead>
                      <TableHead>종료일</TableHead>
                      <TableHead>완료 여부</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {project.tasks.map((task, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">
                          {task.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-4">
                            {Array.from(
                              new Set(
                                project.tasks
                                  .flatMap((task) => task.workers)
                                  .map((worker) => worker.worker.name),
                              ),
                            ).map((worker, i) => (
                              <div key={i}>{worker}</div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          {task.startDate.toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {task.endDate.toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {task.isComplete ? "완료" : "미완료"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
