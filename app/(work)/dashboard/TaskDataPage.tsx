import React from "react";
import Header from "../../../components/navigation/Header";
import prisma from "@/db";
import { auth } from "@/auth";
import DailyTaskReportTable from "@/components/tables/DailyTaskReportTable";
import { endOfToday, format, startOfToday } from "date-fns";

export default async function TaskDataPage({}: {}) {
  const session = await auth();
  const myTasks = await prisma.taskWorker.findMany({
    where: {
      AND: [{ userId: session?.user.sub }, { task: { isComplete: false } }],
    },
    select: {
      id: true,
      userId: true,
      taskId: true,
      task: {
        select: {
          id: true,
          name: true,
          isMilestone: true,
          startDate: true,
          endDate: true,
          projectId: true,
          project: { select: { name: true } },
          taskReport: {
            where: { date: { gte: startOfToday(), lte: endOfToday() } },
          },
        },
      },
      inputRate: true,
    },
  });
  return <DailyTaskReportTable tasks={myTasks as any} />;
}
