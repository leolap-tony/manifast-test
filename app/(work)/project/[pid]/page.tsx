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

import prisma from "@/db";
import { Separator } from "@/components/ui/separator";

import Header from "@/components/navigation/Header";

import { Project, ProjectThread, Task, User } from "@prisma/client";

import ThreadDailyList from "@/components/ThreadDailyList";
import ProjectProgress from "@/components/ProjectProgress";

import TaskWbs from "@/components/TaskWbs";
import ProjectDetail from "./ProjectDetail";
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
        select: {
          id: true,
          name: true,
          startDate: true,
          endDate: true,
          isComplete: true,
          isMilestone: true,
          workers: {
            select: {
              worker: { select: { id: true, name: true, image: true } },
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

  return (
    <main className="page-layout">
      <Header type="projectdetail" title={project?.name}>
        {(session?.user.role == "WORKER" || session?.user.role == "MANAGER") &&
        project?.status == "REQUEST" ? (
          <Button asChild>
            <Link href={`/project/update?pid=${params.pid}`}>
              프로젝트 검토하기
            </Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href={`/project/${params.pid}/update`}>
              프로젝트 수정하기
            </Link>
          </Button>
        )}
      </Header>
      <ProjectDetail project={project as any} />
      <ProjectProgress project={project as any} />

      <Tabs defaultValue="thread" className="">
        <TabsList>
          <TabsTrigger value="thread">스레드</TabsTrigger>
          <TabsTrigger value="wbs">WBS</TabsTrigger>
        </TabsList>
        <TabsContent value="thread" className="flex flex-col gap-4">
          <form className="flex flex-col gap-6 w-full p-4 items-start">
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
            <TaskWbs tasks={project?.tasks as any} />
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
