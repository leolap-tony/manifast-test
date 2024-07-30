import React from "react";
import { auth } from "@/auth";
import Link from "next/link";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/elements/Tabs";
import { Textarea } from "@/components/elements/Textarea";
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
import { Label } from "@/components/ui/label";
import { MilestoneIcon } from "lucide-react";
import Header from "@/components/navigation/Header";
import KeyValueLabel from "@/components/elements/KeyValueLabel";
import UserAvatar from "@/components/elements/UserAvatar";
import { Project, ProjectThread, Task, User } from "@prisma/client";
import Chips from "@/components/elements/Chips";
import ThreadDailyList from "@/components/ThreadDailyList";
import ProjectProgress from "@/components/ProjectProgress";
import { getUniqueWorkers, TaskWithWorkers } from "@/lib/getUniqueWorkers";

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

  const groupByDate = (threads: Array<ProjectThread & { author: User }>) => {
    return threads.reduce(
      (groups, thread) => {
        const date = thread.createdAt.toISOString().split("T")[0];
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(thread);
        return groups;
      },
      {} as { [key: string]: Array<ProjectThread & { author: User }> }
    );
  };
  let groupedThreads: {
    [key: string]: Array<ProjectThread & { author: User }>;
  } = {};

  if (project?.threads && project.threads.length > 0) {
    groupedThreads = groupByDate(project.threads);
  }
  const uniqueWorkers = getUniqueWorkers(project?.tasks as TaskWithWorkers[]);
  const isManyWorkers = uniqueWorkers.length >= 3;

  return (
    <main className="page-contents">
      {/*<pre>{JSON.stringify(groupedThreads, null, 2)}</pre>*/}
      <Header type="projectdetail" title={project?.name}>
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
      <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-background-light">
        <KeyValueLabel direction="horizontal" label="전담 PM" labelWidth={86}>
          <UserAvatar size="md" user={project?.group.manager as User} label />
        </KeyValueLabel>
        <KeyValueLabel direction="horizontal" label="그룹" labelWidth={86}>
          {project?.group.name}
        </KeyValueLabel>
        <KeyValueLabel direction="horizontal" label="종류" labelWidth={86}>
          {project?.type}
        </KeyValueLabel>
        <KeyValueLabel direction="horizontal" label="작업자" labelWidth={86}>
          <div
            className={`flex flex-row items-center ${
              isManyWorkers ? "-space-x-2" : "gap-3"
            }`}
          >
            {uniqueWorkers.map((worker, i) => {
              return (
                <UserAvatar
                  key={i}
                  size="md"
                  user={worker as User}
                  label={!isManyWorkers}
                />
              );
            })}
          </div>
        </KeyValueLabel>
        <KeyValueLabel
          direction="horizontal"
          label="그룹 관리자"
          labelWidth={86}
        >
          <UserAvatar size="md" user={project?.group.owner as User} label />
        </KeyValueLabel>
        <KeyValueLabel direction="horizontal" label="상태" labelWidth={86}>
          <Chips type="status" value={project?.status as string} />
        </KeyValueLabel>
      </div>
      <ProjectProgress project={project as Project & { tasks: Task[] }} />

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
                placeholder="메시지를 입력하세요."
                name="message"
                submitButton
              />
            </div>
            <input type="hidden" name="projectId" value={params.pid} />
          </form>
          <Separator />
          <div className="w-full flex flex-col gap-6 px-6">
            {Object.entries(groupedThreads).map(([date, threads]) => (
              <ThreadDailyList key={date} date={date} threads={threads} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="wbs">
          <div className="flex flex-col p-6">
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
