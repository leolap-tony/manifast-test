import { auth } from "@/auth";
import React from "react";
import Header from "@/components/navigation/Header";
import prisma from "@/db";

export default async function page() {
  const session = await auth();
  const members = await prisma.user.findMany({
    where: { id: session?.user.sub },
    select: {
      group: {
        select: {
          members: {
            select: {
              id: true,
              name: true,
              image: true,
              role: true,
              project: { select: { status: true, difficulty: true } },
              tasks: { select: { inputRate: true, task: true } },
            },
          },
        },
      },
    },
  });
  return (
    <main className="page-contents">
      {<pre>{JSON.stringify(members, null, 2)}</pre>}
      <Header type="page" title="멤버" />
      <section className="page-section"></section>
    </main>
  );
}
