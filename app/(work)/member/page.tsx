import { Separator } from "@/components/ui/separator";
import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/db";
import { auth } from "@/auth";
import Header from "@/components/navigation/Header";

const page = async () => {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: {
      id: session?.user.sub,
    },
    include: {
      group: {
        include: {
          members: {
            include: {
              tasks: {
                where: {
                  startDate: {
                    lte: new Date(),
                  },
                  endDate: {
                    gte: new Date(),
                  },
                },
                include: { task: true },
              },
              taskReport: {
                where: {
                  date: {
                    equals: new Date(),
                  },
                },
              },
              managementGroups: {
                include: {
                  projects: {
                    where: {
                      startDate: {
                        lte: new Date(),
                      },
                      endDate: {
                        gte: new Date(),
                      },
                    },
                  },
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
      <Header type="Default" title="멤버" />
      {/* <div>{JSON.stringify(user)}</div> */}
      <section className="page-section">
        <div className="p-5">
          <h2 className="text-2xl font-semibold">프로젝트 소유자</h2>
          <Table className="border">
            <TableHeader className="bg-neutral-50">
              <TableRow>
                <TableHead>이름</TableHead>
                <TableHead>직무</TableHead>
                <TableHead>오늘 난이도</TableHead>
                <TableHead>프로젝트 수</TableHead>
                <TableHead>오늘 보고</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user?.group?.members
                .filter((member) => member.managementGroups.length)
                .map((member, i) => (
                  <TableRow key={i}>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.job}</TableCell>
                    <TableCell>
                      {Math.round(
                        (member.managementGroups
                          .flatMap((group) => group.projects)
                          .reduce((a, c) => a + c.difficulty, 0) /
                          member.managementGroups.flatMap(
                            (group) => group.projects
                          ).length /
                          2) *
                          100
                      )}
                      %
                    </TableCell>
                    <TableCell>
                      {
                        member.managementGroups.flatMap(
                          (group) => group.projects
                        ).length
                      }
                    </TableCell>
                    <TableCell>
                      {member.taskReport.length ? "완료" : "보고 전"}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        <div className="p-5">
          {" "}
          <h2 className="text-2xl font-semibold">작업 소유자</h2>
          <Table className="border">
            <TableHeader className="bg-neutral-50">
              <TableRow>
                <TableHead className="">이름</TableHead>
                <TableHead>직무</TableHead>
                <TableHead>배정 투입률</TableHead>
                <TableHead>실제 투입률</TableHead>
                <TableHead>프로젝트 수</TableHead>
                <TableHead>오늘 작업 수</TableHead>
                <TableHead>오늘 보고</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user?.group?.members.map((member, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.job}</TableCell>
                  <TableCell>
                    {member.tasks.reduce((a, c) => a + c.inputRate, 0)}%
                  </TableCell>
                  <TableCell>
                    {member.taskReport.reduce(
                      (a, c) => a + c.todayInputRate,
                      0
                    )}
                    %
                  </TableCell>
                  <TableCell>
                    {
                      new Set(member.tasks.map((task) => task.task.projectId))
                        .size
                    }
                  </TableCell>
                  <TableCell>{member.tasks.length}</TableCell>
                  <TableCell>
                    {member.taskReport.length ? "완료" : "보고 전"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </main>
  );
};

export default page;
