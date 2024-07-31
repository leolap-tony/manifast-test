import React from "react";
import { auth } from "@/auth";
import prisma from "@/db";

import { Progress } from "@/components/elements/Progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/elements/Tabs";
import { Button } from "@/components/elements/Button";
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
import Header from "@/components/navigation/Header";
import KeyValueLabel from "@/components/elements/KeyValueLabel";
import UserAvatar from "@/components/elements/UserAvatar";
import Chips from "@/components/elements/Chips";
import { User } from "@prisma/client";
import { getUniqueWorkers } from "@/lib/getUniqueWorkers";
import { TaskWithWorkers } from "@/types/queryInterface";
import UserArray from "@/components/UserArray";

export default async function Page({ params }: { params: { cid: string } }) {
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
    <main className="page-contents">
      <Header type="page" title={group?.name}>
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
      </Header>
      {/* <div>{JSON.stringify(group)}</div> */}
      {/* <div>{JSON.stringify(user)}</div> */}
      <div className="grid grid-cols-3 px-6 py-4 gap-4 bg-background-light">
        <KeyValueLabel
          direction="horizontal"
          label="그룹 관리자"
          labelWidth={86}
        >
          <UserAvatar size="md" user={group?.owner as User} label />
        </KeyValueLabel>
        <KeyValueLabel
          direction="horizontal"
          label="그룹 이메일"
          labelWidth={86}
        >
          {group?.email}
        </KeyValueLabel>
        <KeyValueLabel direction="horizontal" label="플랜" labelWidth={86}>
          프로
        </KeyValueLabel>
        <KeyValueLabel direction="horizontal" label="전담 PM" labelWidth={86}>
          <UserAvatar size="md" user={group?.manager as any} label />
        </KeyValueLabel>
        <KeyValueLabel
          direction="horizontal"
          label="그룹 연락처"
          labelWidth={86}
        >
          {group?.phone}
        </KeyValueLabel>
        <KeyValueLabel direction="horizontal" label="플랜 기간" labelWidth={86}>
          2024.05.20~2024.08.20
        </KeyValueLabel>
      </div>

      <Tabs defaultValue="thread">
        <TabsList>
          <TabsTrigger value="thread">프로젝트</TabsTrigger>
          <TabsTrigger value="wbs">WBS</TabsTrigger>
        </TabsList>
        <TabsContent value="thread">
          <section className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="">작업 이름</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>작업자</TableHead>
                  <TableHead>시작일</TableHead>
                  <TableHead>종료일</TableHead>
                  <TableHead>진척률</TableHead>
                  <TableHead>고객</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {group?.projects.map((project, i) => {
                  const worker = getUniqueWorkers(project.tasks);
                  return (
                    <TableRow key={i}>
                      <TableCell>
                        <Link href={`/project/${project.id}`}>
                          <div className="flex flex-row items-center gap-1">
                            <span>{project.name}</span>
                            <Chips
                              type="difficulty"
                              value={project.difficulty}
                            />
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Chips type="status" value={project.status} />
                      </TableCell>
                      <TableCell>
                        <UserArray
                          users={worker}
                          orientation="col"
                          maxAmount={3}
                        />
                      </TableCell>
                      <TableCell>
                        {project.startDate?.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {project.endDate?.toLocaleDateString()}
                      </TableCell>
                      <TableCell>40%</TableCell>
                      <TableCell>{group.name}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </section>
        </TabsContent>
        <TabsContent value="wbs">
          <div className="flex flex-col gap-8 p-4">
            {group?.projects.map((project, i) => {
              return (
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
                      {project.tasks.map((task, i) => {
                        const worker = getUniqueWorkers(project.tasks);
                        return (
                          <TableRow key={i}>
                            <TableCell className="font-medium">
                              {task.name}
                            </TableCell>
                            <TableCell>
                              <UserArray
                                users={worker}
                                orientation="col"
                                maxAmount={3}
                              />
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
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
