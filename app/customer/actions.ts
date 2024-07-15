"use server";

import { auth } from "@/auth";
import prisma from "@/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ProjectType } from "@prisma/client";

export async function updatePM(formData: FormData) {
  const session = await auth();
  if (!(session?.user.role == "WORKER" || session?.user.role == "MANAGER"))
    return;
  try {
    const group = await prisma.group.update({
      where: {
        id: formData.get("cid") as string,
      },
      data: {
        managerId: formData.get("managerId") as string,
      },
    });
    console.log(group);
  } catch (e) {
    console.log(e);
    return;
  }
  revalidatePath("/customer");
}
