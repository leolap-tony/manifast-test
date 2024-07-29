"use server";

import { auth } from "@/auth";
import prisma from "@/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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
  redirect("/myinfo");
}
