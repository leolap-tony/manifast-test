"use server";

import { auth } from "@/auth";
import prisma from "@/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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
  let tasks = formData.get("tasks") as any;
  tasks = JSON.parse(tasks);
  let project;
  try {
    project = await prisma.project.create({
      data: {
        name: formData.get("projectName") as string,
        groupId: user.groupId,
        request_startDate: new Date(formData.get("startDate") as string),
        request_endDate: new Date(formData.get("endDate") as string),
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
}

export async function getProjectInfo() {
  try {
    const project = await prisma.project.findMany();
    console.log(project);
    return project;
  } catch (error) {
    return { error: error };
  }
}
