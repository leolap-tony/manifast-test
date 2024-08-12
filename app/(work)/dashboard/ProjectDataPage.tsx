import React from "react";
import Header from "../../../components/navigation/Header";
import prisma from "@/db";
import { auth } from "@/auth";
import DailyProjectTable from "@/components/tables/DailyProjectTable";

export default async function ProjectDataPage({}: {}) {
  const session = await auth();
  const myProjects = await prisma.project.findMany({
    where: { managerId: session?.user.sub },
    select: {
      id: true,
      name: true,
      status: true,
      startDate: true,
      endDate: true,
      difficulty: true,
      group: { select: { name: true } },
      tasks: { select: { isComplete: true, isMilestone: true, workers: true } },
    },
  });
  return (
    <section>
      <Header type="section" title="오늘 진행 중인 프로젝트" />
      <div className="px-6 pb-6">
        <DailyProjectTable projects={myProjects as any} />
      </div>
    </section>
  );
}
