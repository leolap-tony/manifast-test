"use server";
import { auth } from "@/auth";
import prisma from "@/db";
import {
  projectWithTaskAndManager,
  ProjectWithTasks,
} from "@/types/queryInterface";
import { Project, ProjectStatus, Task } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function createProject(formData: FormData) {
  const session = await auth();
  const user =
    session?.user &&
    (await prisma.user.findUnique({
      where: {
        id: session.user.sub,
      },
      select: {
        id: true,
        groupId: true,
        group: {
          select: {
            managerId: true,
          },
        },
      },
    }));
  if (!user?.groupId) return;
  const task = await prisma.taskTemplate.findMany({
    where: {
      projectTemplateName: formData.get("projectTemplateName") as string,
    },
    select: { name: true, isMilestone: true },
  });
  // tasks = JSON.parse(tasks);
  let project;
  try {
    project = await prisma.project.create({
      data: {
        name: formData.get("name") as string,
        projectTemplateName: formData.get("projectTemplateName") as string,
        status: "REQUEST",
        groupId: user.groupId,
        request_startDate: new Date(formData.get("startDate") as string),
        request_endDate: new Date(formData.get("endDate") as string),
        message: formData.get("message") as string,
        managerId: user.group?.managerId,
        tasks: {
          create: task,
        },

        threads: {
          create: [
            {
              type: "REQUEST",
              message: "프로젝트 요청입니다",
            },
          ],
        },
      },
    });
  } catch (error) {
    // console.error(error);
    throw error;
    return;
  }
  redirect(`/project/${project?.id}`);
}

export async function updateProject(data: Partial<projectWithTaskAndManager>) {
  try {
    console.log(data);
    await prisma.$transaction([
      prisma.task.deleteMany({
        where: { projectId: data.id },
      }),
      prisma.project.update({
        where: { id: data.id },
        data: {
          name: data.name,
          startDate: data.startDate && new Date(data.startDate),
          endDate: data.endDate && new Date(data.endDate),
          difficulty: data.difficulty,
          status: data.status === "REQUEST" ? "STANDBY" : data.status,
          managerId: data.managerId,
          tasks: {
            create: data.tasks?.map((task) => ({
              name: task.name,
              isMilestone: task.isMilestone,
              startDate: task.startDate,
              endDate: task.endDate,
              isComplete: task.isComplete,
              workers: {
                create: task.workers.map((worker) => ({
                  userId: worker.userId,
                  inputRate: worker.inputRate,
                })),
              },
              taskReport: {
                create: task.taskReport?.map((report) => ({
                  userId: report.userId,
                  standardInputRate: report.standardInputRate,
                  todayInputRate: report.todayInputRate,
                  message: report.message,
                  date: new Date(report.date),
                })),
              },
            })),
          },
        },
      }),
    ]);
  } catch (error) {
    throw error; // 에러를 다시 던져 호출자가 처리할 수 있게 합니다.
  }
  revalidatePath(`/project/${data.id}`);
  redirect(`/project/${data.id}`);
}

export async function getProject(projectId: string) {
  try {
    return await prisma.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        manager: true,
        group: {
          include: { manager: true, owner: true },
        },
        tasks: {
          select: {
            id: true,
            name: true,
            startDate: true,
            endDate: true,
            isComplete: true,
            isMilestone: true,
            workers: {
              select: {
                worker: { select: { id: true, name: true, image: true } },
              },
            },
          },
        },
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function getProjectThreads(projectId: string) {
  try {
    return await prisma.projectThread.findMany({
      where: {
        projectId: projectId,
      },
      include: {
        author: { select: { id: true, name: true, image: true } },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function completeTask(taskId: string, status: boolean) {
  const session = await auth();
  try {
    await prisma.task.update({
      where: { id: taskId, workers: { some: { userId: session?.user.sub } } },
      data: { isComplete: status },
    });
  } catch (e) {
    throw e;
  }
  revalidatePath("/project");
}

export async function getAllMyProject() {
  const session = await auth();
  try {
    return await prisma.project.findMany({
      where: {
        OR: [
          { managerId: session?.user.sub },
          { group: { members: { some: { id: session?.user.sub } } } },
        ],
      },
      select: {
        id: true,
        name: true,
        status: true,
        manager: { select: { name: true, image: true } },
        difficulty: true,
        startDate: true,
        endDate: true,
        request_startDate: true,
        request_endDate: true,
        group: { select: { name: true } },
        tasks: {
          select: {
            workers: {
              select: { worker: { select: { name: true, image: true } } },
            },
          },
        },
      },
    });
  } catch (error) {
    throw error;
  }
}

export async function postThreadMessage({
  projectId,
  type,
  authorId,
  message,
}: {
  projectId: string;
  type?: ProjectStatus;
  authorId?: string;
  message?: string;
}) {
  try {
    await prisma.projectThread.create({
      data: { projectId, type, authorId, message },
    });
    return { result: "success" };
  } catch (error) {
    return { result: "error" };
  }
}

export async function updateProjectStatus(
  projectId: string,
  status: ProjectStatus,
) {
  const session = await auth();
  try {
    await prisma.$transaction([
      prisma.project.update({
        where: { id: projectId, managerId: session?.user.sub },
        data: { status },
      }),
      prisma.projectThread.create({
        data: { projectId: projectId, type: status },
      }),
    ]);
    return { result: "success" };
  } catch (error) {
    return { result: "error" };
  }
}
