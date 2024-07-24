import React from "react";
import { auth } from "@/auth";
import Link from "next/link";

import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Textarea } from "@/components/ui/textarea";
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
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import prisma from "@/db";
import { Separator } from "@/components/ui/separator";
import { completeTask, createThread } from "../actions";
import Image from "next/image";
import { Label } from "@/components/ui/label";

const page = async ({ params }: { params: { pid: string } }) => {
  const session = await auth();
  const project = await prisma.project.findUnique({
    where: {
      id: params.pid,
    },
    include: {
      group: {
        include: { manager: true, owner: true },
      },
      tasks: {
        include: {
          workers: {
            include: {
              worker: true,
            },
          },
        },
      },
      threads: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  return (
    <div className="flex flex-col p-8 w-full gap-8">
      {/* <div>{JSON.stringify(project)}</div> */}
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">{project?.name}</h1>
        {(session?.user.role == "WORKER" || session?.user.role == "MANAGER") &&
        project?.status == "REQUESTED" ? (
          <Button asChild>
            <Link href={`/project/${params.pid}/check`}>프로젝트 검토하기</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href={`/project/${params.pid}/update`}>
              프로젝트 수정하기
            </Link>
          </Button>
        )}
      </div>
      <div className="grid grid-cols-3 gap-4 p-6 bg-slate-50 rounded-lg ">
        <div className="flex gap-8">
          <div className="font-semibold">전담 PM</div>
          <div>{project?.group.manager?.name}</div>
        </div>
        <div className="flex gap-8">
          <div className="font-semibold">그룹</div>
          <div>{project?.group.name}</div>
        </div>
        <div className="flex gap-8">
          <div className="font-semibold">종류</div>
          <div>{project?.type}</div>
        </div>
        <div className="flex gap-8">
          <div className="font-semibold">작업자</div>
          <div className="flex gap-4">
            {Array.from(
              new Set(
                project?.tasks
                  .flatMap((task) => task.workers)
                  .map((worker) => worker.worker.name),
              ),
            ).map((worker, i) => (
              <div key={i}>{worker}</div>
            ))}
          </div>
        </div>
        <div className="flex gap-8">
          <div className="font-semibold">그룹 관리자</div>
          <div>{project?.group.owner.name}</div>
        </div>
        <div className="flex gap-8">
          <div className="font-semibold">상태</div>
          <div>{project?.status}</div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="text-lg">
            {Math.round(
              (project!.tasks?.filter(
                (task) => task.isComplete && task.isMilestone,
              ).length /
                project!.tasks.filter((task) => task.isMilestone).length) *
                100,
            )}
            % 완료 됨
          </div>
          <div className="text-lg">
            {project?.startDate?.toLocaleDateString()} -{" "}
            {project?.endDate?.toLocaleDateString()} (예정)
          </div>
        </div>
        <Progress
          value={Math.round(
            (project!.tasks?.filter(
              (task) => task.isComplete && task.isMilestone,
            ).length /
              project!.tasks.filter((task) => task.isMilestone).length) *
              100,
          )}
          className="[&>*]:bg-red-500"
        />
      </div>

      <Tabs defaultValue="thread" className="">
        <TabsList>
          <TabsTrigger value="thread">스레드</TabsTrigger>
          <TabsTrigger value="wbs">WBS</TabsTrigger>
        </TabsList>
        <TabsContent value="thread" className="flex flex-col gap-4">
          <form
            action={createThread}
            className="flex flex-col gap-6 w-full p-4 items-start"
          >
            <ToggleGroup type="single" className="">
              <ToggleGroupItem value="normal">일반 메시지</ToggleGroupItem>
              <ToggleGroupItem value="complete">프로젝트 완료</ToggleGroupItem>
            </ToggleGroup>
            <Textarea placeholder="Type your message here." name="message" />
            <Button variant={"default"}>제출</Button>
            <input type="hidden" name="projectId" value={params.pid} />
          </form>
          <Separator />
          <div>
            {project?.threads.map((thread, i) => (
              <div key={i} className="p-4">
                <div className="flex items-center">
                  <div className="flex items-center gap-2 text-lg font-semibold">
                    {thread.author?.image && (
                      <Image
                        src={thread.author?.image}
                        alt="profile"
                        height={32}
                        width={32}
                        className="rounded-full"
                      />
                    )}
                    <span>{thread.author.name}</span>
                  </div>
                  <div className="font-light text-slate-500 text-sm ml-4">
                    {thread.createdAt.toLocaleString()}
                  </div>
                </div>
                <div className="py-4 px-10 font-light">{thread.message}</div>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="wbs">
          <div className="flex flex-col">
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
                {project?.tasks.map((task, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      <Sheet>
                        <SheetTrigger>{task.name}</SheetTrigger>
                        <SheetContent className="w-[400px] sm:w-[540px] px-0">
                          <form
                            className="flex flex-col gap-4"
                            action={completeTask}
                          >
                            <SheetHeader className="p-4">
                              <SheetTitle className="font-semibold text-2xl">
                                {task.name}
                              </SheetTitle>
                            </SheetHeader>
                            <div className="bg-slate-100 flex flex-col w-full p-6 gap-2">
                              <div className="flex">
                                <div className="w-24">작업자</div>
                                <div className="font-light flex flex-col">
                                  {task.workers.map((worker, i) => (
                                    <div key={i}>{worker.worker.name}</div>
                                  ))}
                                </div>
                              </div>
                              <div className="flex">
                                <div className="w-24">시작일</div>
                                <div className="font-light">
                                  {task.startDate.toLocaleDateString()}
                                </div>
                              </div>
                              <div className="flex">
                                <div className="w-24">종료일</div>
                                <div className="font-light">
                                  {task.endDate.toLocaleDateString()}
                                </div>
                              </div>
                              <div className="flex">
                                <div className="w-24">완료 여부</div>
                                <div className="font-light">
                                  {task.isComplete ? "완료" : "미완료"}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col gap-4 p-4">
                              <Label className="text-xl font-semibold">
                                작업물
                              </Label>
                              <Textarea></Textarea>
                            </div>
                            <SheetFooter className="p-4">
                              <SheetClose asChild>
                                <Button type="submit">작업 완료하기</Button>
                              </SheetClose>
                            </SheetFooter>
                            <input
                              type="hidden"
                              name="taskId"
                              value={task.id}
                            />
                          </form>
                        </SheetContent>
                      </Sheet>
                    </TableCell>
                    <TableCell>
                      {task.workers.map((worker, i) => (
                        <div key={i}>{worker.worker.name}</div>
                      ))}
                    </TableCell>
                    <TableCell>{task.startDate.toLocaleDateString()}</TableCell>
                    <TableCell>{task.endDate.toLocaleDateString()}</TableCell>
                    <TableCell>{task.isComplete ? "완료" : "미완료"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
