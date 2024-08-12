import { auth } from "@/auth";
import SummaryCard from "@/components/SummaryCard";
import prisma from "@/db";
import { endOfToday, startOfToday } from "date-fns";
import { ta } from "date-fns/locale";
import React from "react";

export default async function Summary() {
  const session = await auth();
  const project = await prisma.project.aggregate({
    where: {
      AND: [{ managerId: session?.user.sub }, { status: "LIVE" || "STANDBY" }],
    },
    _count: true,
    _sum: { difficulty: true },
  });
  const task = await prisma.taskWorker.findMany({
    where: {
      userId: session?.user.sub,
      task: { isComplete: false },
    },
    select: {
      inputRate: true,
      task: {
        select: {
          taskReport: {
            where: { date: { gte: startOfToday(), lte: endOfToday() } },
            select: { todayInputRate: true },
          },
        },
      },
    },
  });

  function calculateSums(data: any) {
    let totalInputRate = 0;
    let totalTodayInputRate = 0;

    data.forEach((item: any) => {
      // inputRate 합산
      totalInputRate += item.inputRate || 0;

      // taskReport가 비어 있지 않다면 todayInputRate 합산
      if (item.task.taskReport.length > 0) {
        totalTodayInputRate += item.task.taskReport[0].todayInputRate || 0;
      }
    });

    return {
      totalInputRate,
      totalTodayInputRate,
    };
  }

  const result = calculateSums(task);

  return (
    <div className="grid grid-cols-3 gap-4 p-6">
      <SummaryCard type="project" value={project._count} />
      <SummaryCard
        type="inputRate"
        value={[result.totalInputRate, result.totalTodayInputRate]}
      />
      <SummaryCard
        type="difficulty"
        value={[
          project._sum.difficulty ? project._sum.difficulty : 0,
          project._count * 2,
        ]}
      />
    </div>
  );
}
