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
import { Button } from "@/components/ui/button";
import prisma from "@/db";
import { auth } from "@/auth";

const page = async () => {
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
    <div className="w-full flex flex-col gap-8 p-12">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">프로젝트</h1>
        <Button asChild>
          <Link href="/project/request">프로젝트 요청</Link>
        </Button>
      </div>
      <Separator></Separator>
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
            <TableHead>난이도</TableHead>
            <TableHead>고객</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {user?.group?.projects.map((project, i) => (
            <TableRow key={i}>
              <TableCell className="font-semibold">
                <Link href={`/project/${project.id}`}>{project.name}</Link>
              </TableCell>
              <TableCell>{project.status}</TableCell>
              <TableCell>{user.group?.manager?.name}</TableCell>
              <TableCell>
                {(() => {
                  const set = new Set();
                  project.tasks.forEach((task) => {
                    task.workers.forEach((worker) => {
                      set.add(worker.worker.name);
                    });
                  });
                  return Array.from(set).map((e, i) => (
                    <div key={i}>{e as string}</div>
                  ));
                })()}
              </TableCell>
              <TableCell>
                {project.startDate?.toLocaleDateString() ||
                  project.request_startDate?.toLocaleDateString()}
              </TableCell>
              <TableCell>
                {project.endDate?.toLocaleDateString() ||
                  project.request_endDate?.toLocaleDateString()}
              </TableCell>
              <TableCell>40%</TableCell>
              <TableCell>{project.difficulty}</TableCell>
              <TableCell>{user.group?.owner.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default page;
