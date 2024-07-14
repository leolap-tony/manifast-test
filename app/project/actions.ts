"use server";

import { auth } from "@/auth";
import prisma from "@/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ProjectType } from "@prisma/client";

export async function createProject(formData: FormData) {
  const session = await auth();
  const user =
    session?.user &&
    (await prisma.user.findUnique({
      where: {
        id: session.user.sub,
      },
    }));
  if (!user?.groupId) return;
  // let tasks = formData.get("tasks") as any;
  // tasks = JSON.parse(tasks);
  let project;
  try {
    project = await prisma.project.create({
      data: {
        name: formData.get("projectName") as string,
        type: formData.get("type") as ProjectType,
        status: "REQUESTED",
        groupId: user.groupId,
        request_startDate: new Date(formData.get("startDate") as string),
        request_endDate: new Date(formData.get("endDate") as string),
        message: formData.get("message") as string,
        // tasks: {
        //   create: tasks.map((task: any) => {
        //     return { name: task.taskName, isMilestone: task.isMilestone };
        //   }),
        // },
      },
    });
  } catch (error) {
    console.error(error);
    return;
  }
  redirect(`/project/${project?.id}`);
}

export async function checkProject(tasks: any, formData: FormData) {
  const session = await auth();
  console.log(tasks);
  console.log(formData);
  try {
    const updateUser = await prisma.project.update({
      where: { id: formData.get("pid") as string },
      data: {
        status: "STARTED",
        startDate: new Date(formData.get("startDate") as string),
        endDate: new Date(formData.get("endDate") as string),
        difficulty: formData.get("difficulty") as string,
        tasks: {
          create: tasks.map((task: any, i: number) => ({
            name: task.taskName,
            isMilestone: task.milestone,
            startDate: task.startDate,
            endDate: task.endDate,
            workers: {
              create: tasks[i].workers.map((worker: any, j: number) => ({
                userId: worker.worker,
                inputRate: worker.inputRate,
                startDate: task.startDate,
                endDate: task.endDate,
              })),
            },
          })),
        },
      },
    });
  } catch (error) {
    console.log(error);
    return { error: "error" };
  }
  redirect(`/project/${formData.get("pid") as string}`);
}

export async function getProjectInfo(pid: string) {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: pid,
      },
    });
    return project;
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function getUserGroup() {
  const session = await auth();
  if (!session) {
    return;
  }
  try {
    const group = await prisma.user.findUnique({
      where: { id: session?.user.sub },
      include: { group: { include: { members: true } } },
    });
    return group;
  } catch (error) {
    console.log(error);
    return;
  }
}
