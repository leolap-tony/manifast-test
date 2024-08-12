"use server";

import prisma from "@/db";
import { TaskReport } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createReport(data: Partial<TaskReport>[]) {
  const ready = data.map((rp) => ({
    taskId: rp.taskId as string,
    userId: rp.userId as string,
    standardInputRate: rp.standardInputRate as number,
    todayInputRate: rp.todayInputRate as number,
    message: rp.message,
  }));
  try {
    await prisma.taskReport.createMany({ data: ready });
    return revalidatePath("/");
  } catch (error) {
    return error;
  }
}
