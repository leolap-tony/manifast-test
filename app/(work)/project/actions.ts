"use server";

import { auth } from "@/auth";
import prisma from "@/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ProjectType } from "@prisma/client";
import { NextResponse } from "next/server";
import { Task } from "@/data/tasks";

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
  // console.log(tasks);
  // console.log(formData);
  try {
    const updateUser = await prisma.project.update({
      where: { id: formData.get("pid") as string },
      data: {
        status: "STARTED",
        startDate: new Date(formData.get("startDate") as string),
        endDate: new Date(formData.get("endDate") as string),
        difficulty: parseInt(formData.get("difficulty") as string),
        tasks: {
          create: tasks.map((task: any, i: number) => ({
            name: task.taskName,
            isMilestone: task.milestone,
            startDate: new Date(task.startDate),
            endDate: new Date(task.endDate),
            workers: {
              create: tasks[i].workers.map((worker: any, j: number) => ({
                userId: worker.worker,
                inputRate: worker.inputRate,
                startDate: new Date(task.startDate),
                endDate: new Date(task.endDate),
              })),
            },
          })),
        },
      },
    });
  } catch (error) {
    console.log(error);
    return;
  }
  revalidatePath("/project");
  redirect(`/project/${formData.get("pid") as string}`);
}

export async function updateProject(tasks: any, formData: FormData) {
  const session = await auth();
  try {
    await prisma.$transaction([
      prisma.task.deleteMany({
        where: { projectId: formData.get("pid") as string },
      }),
      prisma.project.update({
        where: { id: formData.get("pid") as string },
        data: {
          startDate: new Date(formData.get("startDate") as string),
          endDate: new Date(formData.get("endDate") as string),
          difficulty: parseInt(formData.get("difficulty") as string),
          tasks: {
            create: tasks.map((task: any, i: number) => ({
              name: task.taskName,
              isMilestone: task.milestone,
              startDate: new Date(task.startDate),
              endDate: new Date(task.endDate),
              workers: {
                create: tasks[i].workers.map((worker: any, j: number) => ({
                  userId: worker.worker,
                  inputRate: worker.inputRate,
                  startDate: new Date(task.startDate),
                  endDate: new Date(task.endDate),
                })),
              },
              // taskReport: {
              //   create: tasks.flatMap((task: Task) => (task.taskReport)).map((taskReport: any) => ({
              //     taskId: taskReport.taskId,
              //     userId: taskReport.userId,
              //     todayInputRate: taskReport.todayInputRate,
              //     message: taskReport.message,
              //     date: taskReport.date
              //   }))
              // }
            })),
          },
        },
      }),
    ]);
  } catch (error) {
    console.log(error);
    return;
  }
  revalidatePath("/project");
  redirect(`/project/${formData.get("pid") as string}`);
}

export async function cancelProject(pid: string) {
  const session = await auth();
  try {
    await prisma.project.update({
      where: {
        id: pid as string,
      },
      data: {
        status: "CANCELED",
      },
    });
  } catch (e) {
    console.log(e);
    return;
  }
  revalidatePath("project");
  redirect("/project");
}

export async function stopProject(pid: string) {
  const session = await auth();
  try {
    await prisma.project.update({
      where: {
        id: pid,
      },
      data: {
        status: "STOPPED",
      },
    });
    console.log("stop project!");
  } catch (e) {
    console.log(e);
    return;
  }
  console.log("stop project!");
  revalidatePath("project");
  redirect("/project");
}

export async function getProjectInfo(pid: string) {
  try {
    const project = await prisma.project.findUnique({
      where: {
        id: pid,
      },
      include: {
        tasks: {
          include: {
            workers: {
              include: {
                worker: true,
              },
            },
            taskReport: true
          },
        },
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

export async function createThread(formData: FormData) {
  const session = await auth();
  if (!session?.user.sub) return;
  try {
    const thread = await prisma.projectThread.create({
      data: {
        projectId: formData.get("projectId") as string,
        authorId: session?.user.sub,
        type: "NORMAL",
        message: formData.get("message") as string,
      },
    });
  } catch (e) {
    console.log(e);
    return;
  }
  revalidatePath("/project");
}

export async function completeTask(formData: FormData) {
  const session = await auth();
  if (!session) {
    return;
  }
  try {
    await prisma.task.update({
      where: {
        id: formData.get("taskId") as string,
      },
      data: {
        isComplete: !(formData.get("isComplete") === "true" ? true : false),
      },
    });
  } catch (e) {
    console.log(e);
    return;
  }
  revalidatePath("/project");
}
