// 'use client'
import { auth } from "@/auth";
import React from "react";
import Header from "@/components/navigation/Header";

import prisma from "@/db";
import SummaryCard from "@/components/SummaryCard";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import DailyProjectTable from "@/components/DailyProjectTable";
import { ProjectWithTasks } from "@/types/queryInterface";
import { group } from "console";
import SupplyDashboard from "@/components/SupplyDashboard";
import DemandDashboard from "@/components/DemandDashboard";

// import { createReport, getReports } from "./actions";

export default async function page() {
  const session = await auth();

  /*const offset = 1000 * 60 * 60 * 9;
  const koreaNow = new Date(new Date().getTime() + offset);
  const startOfToday = new Date(koreaNow.setHours(0, 0, 0, 0));
  const endOfToday = new Date(koreaNow.setHours(23, 59, 59, 999));
  const user = await prisma.user.findUnique({
    where: { id: session?.user.sub },
    select: {
      managementGroups: {
        select: {
          projects: {
            include: {
              group: { select: { name: true } },
              tasks: {
                select: {
                  workers: {
                    select: { worker: { select: { name: true, image: true } } },
                  },
                },
              },
            },
          },
        },
      },
      tasks: true,
    },
  });

  const myProjects = user?.managementGroups.flatMap((group) => group.projects);
  const myTasks = user?.tasks;*/
  return (
    <main className="page-contents">
      {/*<pre>{JSON.stringify(myProjects, null, 2)}</pre>*/}
      <Header type="dashboard" />
      <section className="page-section">
        {/*<div className="w-full grid grid-cols-3 p-6 gap-4">
          <SummaryCard type="project" value={0}></SummaryCard>
          <SummaryCard type="inputRate" value={[0, 0]}></SummaryCard>
          <SummaryCard type="project" value={0}></SummaryCard>
        </div>
        <DailyProjectTable projects={myProjects as ProjectWithTasks[]} />*/}
        {session?.user?.role == "WORKER" || session?.user.role == "MANAGER" ? (
          <SupplyDashboard />
        ) : (
          <DemandDashboard />
        )}
      </section>
    </main>
  );
}
