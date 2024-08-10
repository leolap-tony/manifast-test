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
import { MilestoneIcon } from "lucide-react";
import Header from "@/components/navigation/Header";
import KeyValueLabel from "@/components/elements/KeyValueLabel";
import UserAvatar from "@/components/elements/UserAvatar";
import { Project, ProjectThread, Task, User } from "@prisma/client";
import Chips from "@/components/elements/Chips";
import ThreadDailyList from "@/components/ThreadDailyList";
import ProjectProgress from "@/components/ProjectProgress";
import { getUniqueWorkers } from "@/lib/getUniqueWorkers";
import { TaskWithWorkers } from "@/types/queryInterface";
import UserArray from "@/components/UserArray";

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
  return (
    <main className="page-contents">
      {/*<pre>{JSON.stringify(groupedThreads, null, 2)}</pre>*/}
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
      <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-background-light">
        <KeyValueLabel direction="horizontal" label="전담 PM" labelWidth={86}>
          <UserAvatar size="md" user={project?.group.manager as User} label />
        </KeyValueLabel>
        <KeyValueLabel direction="horizontal" label="그룹" labelWidth={86}>
          {project?.group.name}
        </KeyValueLabel>
        <KeyValueLabel direction="horizontal" label="종류" labelWidth={86}>
          {project?.projectTemplateName}
        </KeyValueLabel>
        <KeyValueLabel direction="horizontal" label="작업자" labelWidth={86}>
          <UserArray users={uniqueWorkers} orientation="row" maxAmount={3} />
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
          <div className="flex flex-col p-6"></div>
        </TabsContent>
      </Tabs>
    </main>
  );
}
