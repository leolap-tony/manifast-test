import { auth } from "@/auth";
import React from "react";
import Header from "@/components/navigation/Header";
import prisma from "@/db";
import MemberTable from "@/components/tables/MemberTable";
import { Project, Task, User } from "@prisma/client";
import { endOfToday, startOfToday } from "date-fns";

export default async function page() {
  const session = await auth();
  const data = await prisma.user.findUnique({
    where: { id: session?.user.sub },
    select: {
      group: {
        select: {
          members: {
            select: {
              id: true,
              name: true,
              image: true,
              role: true,
              project: {
                where: { status: "REQUEST" || "STANDBY" || "LIVE" },
                select: { difficulty: true },
              },
              tasks: {
                where: { task: { isComplete: false } },
                select: {
                  inputRate: true,
                  task: {
                    select: {
                      taskReport: {
                        where: {
                          date: { gte: startOfToday(), lte: endOfToday() },
                        },
                      },
                    },
                  },
                },
              },
              _count: { select: { managementGroups: true } },
            },
          },
        },
      },
    },
  });

  return (
    <main className="page-contents">
      <Header type="page" title="멤버" />
      <section className="page-section">
        <MemberTable members={data?.group?.members as any} />
      </section>
    </main>
  );
}
