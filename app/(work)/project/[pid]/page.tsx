import React from "react";
import { auth } from "@/auth";
import Link from "next/link";

import { Progress } from "@/components/elements/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Textarea } from "@/components/ui/textarea";
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
import { MilestoneIcon } from "lucide-react";
import Header from "@/components/navigation/Header";

export default async function page({ params }: { params: { pid: string } }) {
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
    <main className="page-contents">
      {/* <div>{JSON.stringify(project)}</div> */}
      <Header type="ProjectDetail" title={project?.name}>
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
      </Header>
      <div className="grid grid-cols-3 gap-4 p-6 bg-background-light">
        <div className="flex gap-8">
          <div className="text-text-title text-body-md-m">전담 PM</div>
          <div>{project?.group.manager?.name}</div>
        </div>
        <div className="flex gap-8">
          <div className="text-text-title text-body-md-m">그룹</div>
          <div>{project?.group.name}</div>
        </div>
        <div className="flex gap-8">
          <div className="text-text-title text-body-md-m">종류</div>
          <div>{project?.type}</div>
        </div>
        <div className="flex gap-8">
          <div className="text-text-title text-body-md-m">작업자</div>
          <div className="flex gap-4">
            {Array.from(
              new Set(
                project?.tasks
                  .flatMap((task) => task.workers)
                  .map((worker) => worker.worker.name)
              )
            ).map((worker, i) => (
              <div key={i}>{worker}</div>
            ))}
          </div>
        </div>
        <div className="flex gap-8">
          <div className="text-text-title text-body-md-m">그룹 관리자</div>
          <div>{project?.group.owner.name}</div>
        </div>
        <div className="flex gap-8">
          <div className="text-text-title text-body-md-m">상태</div>
          <div>{project?.status}</div>
        </div>
      </div>
      <div className="px-6 pt-4 pb-2.5 flex flex-col gap-2">
        <div className="flex justify-between items-baseline">
          <div className="flex flex-row items-baseline gap-2">
            <div className="text-title-lg text-text-title">
              {Math.round(
                (project!.tasks?.filter(
                  (task) => task.isComplete && task.isMilestone
                ).length /
                  project!.tasks.filter((task) => task.isMilestone).length) *
                  100
              )}
              %
            </div>
            <div className="text-body-sm-m text-text-sub">
              {project?.status}
            </div>
          </div>
          <div className="text-body-sm-m text-text-sub">
            {project?.startDate?.toLocaleDateString()} -{" "}
            {project?.endDate?.toLocaleDateString()} (예정)
          </div>
        </div>
        <Progress
          value={Math.round(
            (project!.tasks?.filter(
              (task) => task.isComplete && task.isMilestone
            ).length /
              project!.tasks.filter((task) => task.isMilestone).length) *
              100
          )}
          className="h-2 [&>*]:bg-red-500"
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
            {/* <ToggleGroup type="single" className="">
              <ToggleGroupItem value="normal">일반 메시지</ToggleGroupItem>
              <ToggleGroupItem value="complete">프로젝트 완료</ToggleGroupItem>
            </ToggleGroup> */}
            <div className="relative w-full">
              <Textarea
                placeholder="Type your message here."
                name="message"
                className="h-28"
              />
              <Button variant={"outline"} className="absolute right-2 top-2/4">
                제출
              </Button>
            </div>
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
            <Table className="border">
              <TableHeader className="bg-neutral-50">
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
                        <SheetTrigger className="font-semibold flex gap-2 items-center">
                          {task.isMilestone && (
                            <MilestoneIcon size={16} color="red" />
                          )}
                          <div>{task.name}</div>
                        </SheetTrigger>
                        <SheetContent className="w-[400px] sm:w-[540px] px-0">
                          <form
                            className="flex flex-col gap-4"
                            action={completeTask}
                          >
                            <SheetHeader className="p-4">
                              <SheetTitle className="font-semibold text-2xl flex gap-2 items-center">
                                {task.isMilestone && (
                                  <MilestoneIcon size={24} color="red" />
                                )}
                                <div>{task.name}</div>
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
                                <Button type="submit">
                                  {task.isComplete
                                    ? "작업 미완료"
                                    : "작업 완료하기"}
                                </Button>
                              </SheetClose>
                            </SheetFooter>
                            <input
                              type="hidden"
                              name="taskId"
                              value={task.id}
                            />
                            <input
                              type="hidden"
                              name="isComplete"
                              value={task.isComplete.toString()}
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
    </main>
  );
}
