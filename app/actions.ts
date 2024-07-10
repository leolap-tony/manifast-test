"use server";

import { auth } from "@/auth";
import prisma from "@/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function submitReport(formdata: FormData) {
  const data = formdata.getAll("taskId").map((taskId, i) => {
    return {
      taskWorkerId: taskId as string,
      userId: formdata.getAll("userId")[i] as string,
      todayInputRate: parseInt(formdata.getAll("todayInputRate")[i] as string),
      message: formdata.getAll("message")[i] as string,
      date: new Date(),
    };
  });
  try {
    await prisma.taskReport.createMany({
      data,
    });
  } catch (e) {
    console.log(e);
    return { succes: false };
  }
  revalidatePath("/");
}
