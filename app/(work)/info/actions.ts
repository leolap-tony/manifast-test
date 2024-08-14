"use server";

import { auth } from "@/auth";
import prisma from "@/db";
import { redirect } from "next/navigation";
import { cache } from "react";

export async function getMyInfo(userId: string) {
  try {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        name: true,
        email: true,
        phone: true,
        createdAt: true,
        job: true,
        authority: true,
        role: true,
        image: true,
      },
    });
  } catch (e) {
    throw e;
  }
}

export async function getMyGroup(userId: string) {
  try {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        group: {
          select: {
            name: true,
            email: true,
            phone: true,
            createdAt: true,
            id: true,
            membershipInfo: {
              select: { membership: { select: { name: true } } },
            },
            members: {
              select: {
                id: true,
                name: true,
                image: true,
                role: true,
                authority: true,
              },
            },
            businessInfo: true,
            owner: true,
          },
        },
      },
    });
  } catch (e) {
    throw e;
  }
}

export async function setMyUserInfo(formData: FormData) {
  try {
    await prisma.user.update({
      where: {
        email: formData.get("email") as string,
      },
      data: {
        name: formData.get("name") as string,
        phone: formData.get("phone") as string,
        job: formData.get("job") as string,
      },
    });
  } catch (e) {
    throw e;
  }
  redirect("/onboarding/group");
}

export async function updateMyInfo(formData: FormData) {
  const session = await auth();
  try {
    await prisma.user.update({
      where: {
        id: session?.user.sub,
      },
      data: {
        name: formData.get("name") as string,
        phone: formData.get("phone") as string,
        job: formData.get("job") as string,
      },
    });
  } catch (e) {
    console.log(e);
  }
  redirect("/info");
}

export async function updateOwner(userId: string, groupId: string) {
  try {
    return await prisma.group.update({
      where: {
        id: groupId,
      },
      data: {
        ownerId: userId,
        members: {
          updateMany: [
            {
              where: {
                authority: "OWNER",
              },
              data: {
                authority: "ADMIN",
              },
            },
            {
              where: {
                id: userId,
              },
              data: {
                authority: "OWNER",
              },
            },
          ],
        },
      },
    });
  } catch (error) {
    throw error;
  }
}
