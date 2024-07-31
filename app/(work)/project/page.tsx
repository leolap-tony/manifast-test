import { Separator } from "@/components/ui/separator";
import React from "react";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/elements/Button";
import prisma from "@/db";
import { auth } from "@/auth";
import Header from "@/components/navigation/Header";
import Chips from "@/components/elements/Chips";
import UserAvatar from "@/components/elements/UserAvatar";
import { User } from "@prisma/client";
import { getUniqueWorkers } from "@/lib/getUniqueWorkers";
import { TaskWithWorkers } from "@/types/queryInterface";
import UserArray from "@/components/UserArray";

export default async function page() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session?.user.sub },
    include: {
      group: {
        include: {
          projects: {
            include: {
              tasks: {
                include: {
                  workers: {
                    include: { worker: true },
                  },
                },
              },
            },
          },
          owner: true,
          manager: true,
        },
      },
    },
  });

  return (
    <main className="page-contents">
      <Header type="page" title="프로젝트">
        <Button asChild>
          <Link href="/project/request">프로젝트 요청</Link>
        </Button>
      </Header>
      <section className="page-section p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>프로젝트 이름</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>전담 PM</TableHead>
              <TableHead>작업자</TableHead>
              <TableHead>시작일</TableHead>
              <TableHead>종료일</TableHead>
              <TableHead>진척률</TableHead>
              <TableHead>고객</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {user?.group?.projects.map((project, i) => {
              const uniqueWorkers = getUniqueWorkers(project.tasks);
              return (
                <TableRow key={i}>
                  <TableCell className="font-semibold">
                    <Link href={`/project/${project.id}`}>
                      <div className="flex flex-row items-center gap-1">
                        <span>{project.name}</span>
                        <Chips type="difficulty" value={project.difficulty} />
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Chips type="status" value={project.status as string} />
                  </TableCell>
                  <TableCell>
                    <UserAvatar
                      size="md"
                      user={user.group?.manager as User}
                      label
                    />
                  </TableCell>
                  <TableCell>
                    <UserArray
                      users={uniqueWorkers}
                      orientation="col"
                      maxAmount={3}
                    />
                  </TableCell>
                  <TableCell>
                    {project.startDate?.toLocaleDateString() ||
                      project.request_startDate?.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {project.endDate?.toLocaleDateString() ||
                      project.request_endDate?.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {Math.round(
                      (project.tasks.filter(
                        (task) => task.isComplete && task.isMilestone,
                      ).length /
                        project.tasks.filter((task) => task.isMilestone)
                          .length) *
                        100,
                    ) || 0}
                    %
                  </TableCell>
                  <TableCell>{user.group?.name}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </section>
    </main>
  );
}
