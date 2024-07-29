"use server";

import { auth } from "@/auth";
import prisma from "@/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function getTasks() {
  try {
    await prisma.project.findUnique({
      where: {
        id: "clye9e74r0001khu0noy7m7rf",
      },
      include: {
        tasks: {
          where: {
            endDate: new Date(),
          },
        },
      },
    });
  } catch (e) {
    console.log(e);
  }
}

export async function createReport() {
  try {
    const report = await prisma.taskReport.create({
      data: {
        taskWorkerId: "clye9gn7r0004khu0awh7ekq2",
        userId: "cly2ruy3s0000jz23rlk4edc4",
        todayInputRate: 30,
        message: "hi",
        date: new Date("December 17, 2030 04:24:00"),
      },
    });
    console.log(report);
  } catch (e) {
    console.log(e);
  }
  revalidatePath("/dashboard");
}

export async function getReports() {
  try {
    const report = prisma.taskReport.findMany({
      where: {
        date: {
          gte: new Date(),
          lte: new Date(),
        },
      },
    });
    return report;
  } catch (e) {
    console.log(e);
    return { success: false };
  }
}
