"use server";
import { auth } from "@/auth";
import prisma from "@/db";
import { ProjectWithTasks } from "@/types/queryInterface";
import { Task } from "@prisma/client";
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
        Group: {
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
        managerId: user.Group?.managerId,
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
  const project = await prisma.project.update({
    where: { id: data.id },
    data: {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
      difficulty: data.difficulty,
    },
  });

  if (data.tasks) {
    const upsertOps = data.tasks.flatMap((task) =>
      task.workers.map((worker) =>
        prisma.taskWorker.upsert({
          where: { taskId_userId: { taskId: task.id, userId: worker.userId } },
          update: { inputRate: worker.inputRate },
          create: {
            taskId: task.id,
            userId: worker.userId,
            inputRate: worker.inputRate,
          },
        })
      )
    );

    // 모든 upsert 작업을 병렬로 실행하여 처리
    await prisma.$transaction(upsertOps);
  }

  return project;
}
