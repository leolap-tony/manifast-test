"use server";
import { auth } from "@/auth";
import prisma from "@/db";
import { ProjectWithTasks } from "@/types/queryInterface";
import { Project, Task } from "@prisma/client";
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
              authorId: user.id,
              type: "SYSTEM",
              message: "프로젝트 요청입니다",
            },
          ],
        },
      },
    });
  } catch (error) {
    console.error(error);
    return;
  }
  redirect(`/project/${project?.id}`);
}

export async function updateProject(data: Partial<ProjectWithTasks>) {
  try {
    console.log(data);
    await prisma.$transaction([
      prisma.task.deleteMany({
        where: { projectId: data.id },
      }),
      prisma.project.update({
        where: { id: data.id },
        data: {
          startDate: data.startDate && new Date(data.startDate),
          endDate: data.endDate && new Date(data.endDate),
          difficulty: data.difficulty,
          tasks: {
            create: data.tasks?.map((task) => ({
              name: task.name,
              isMilestone: task.isMilestone,
              startDate: task.startDate,
              endDate: task.endDate,
              isComplete: task.isComplete,
              workers: {
                create: task.workers.map((worker)=>({
                  userId:worker.userId,                  
                  inputRate:worker.inputRate
                }))
              }
              
            }))
          }
        }
      })
    ])
  } catch (error) {
    throw error; // 에러를 다시 던져 호출자가 처리할 수 있게 합니다.
  }
  revalidatePath(`/project/${data.id}`);
  redirect(`/project/${data.id}`);
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
}
