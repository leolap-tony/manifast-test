"use server";

import { auth } from "@/auth";
import prisma from "@/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function onboarding(formData: FormData) {
  const session = await auth();
  console.log("in onboarding server action :", formData);
  try {
    await prisma.user.update({
      where: {
        id: session?.user.sub,
      },
      data: {
        role: formData.get("role") as string,
        phone: formData.get("phone") as string,
      },
    });
  } catch (error) {
    console.error("error in onboarding :", error);
  }
  revalidatePath("/");
  redirect("/onboarding/group");
}

export async function joinGroup(formData: FormData) {
  const session = await auth();
  try {
    const group = await prisma.group.findUnique({
      where: {
        id: formData.get("groupId") as string,
      },
    });
    if (!group) {
      throw new Error("그룹을 찾을 수 없습니다.");
    }
    const user = await prisma.user.update({
      where: {
        id: session?.user.sub,
      },
      data: {
        group: {
          connect: {
            id: formData.get("groupId") as string,
          },
        },
      },
    });
    console.log("user :", user);
  } catch (error) {
    console.error("error in joinGroup :", error);
    return { msg: "error" };
  }
  revalidatePath("/");
  redirect("/");
}

export async function createGroup(formData: FormData) {
  const session = await auth();
  if (!session?.user.sub) return;
  try {
    await prisma.group.create({
      data: {
        name: formData.get("name") as string,
        ownerId: session?.user.sub,
        ceo: formData.get("ceo") as string,
        businessNumber: formData.get("businessNumber") as string,
        email: formData.get("email") as string,
        phone: formData.get("phone") as string,
        address: formData.get("address") as string,
      },
    });
  } catch (error) {
    console.error("error in onboarding :", error);
  }
  revalidatePath("/");
  redirect("/");
}
