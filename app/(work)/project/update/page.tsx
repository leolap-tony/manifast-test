import Header from "@/components/navigation/Header";
import prisma from "@/db";
import React from "react";
import ProjectUpdateForm from "./ProjectUpdateForm";
import { Project, User } from "@prisma/client";
import { auth } from "@/auth";

export default async function page({
  searchParams,
}: {
  searchParams: { pid: string };
}) {
  const session = await auth();
  const project = await prisma.project.findUnique({
    where: { id: searchParams.pid },
    include: { tasks: { include: { workers: true } } },
  });
  const members =
    session?.user.sub === project?.managerId
      ? await prisma.user.findUnique({
          where: { id: session?.user.sub },
          select: {
            Group: {
              select: {
                members: { select: { id: true, name: true, image: true } },
              },
            },
          },
        })
      : null;
  return (
    <main className="page-contents">
      <Header
        type="page"
        title={
          project?.status === "REQUEST" ? "프로젝트 검토" : "프로젝트 수정"
        }
      />
      <ProjectUpdateForm
        project={project as any}
        members={members?.Group?.members as Partial<User>[]}
      />
    </main>
  );
}
