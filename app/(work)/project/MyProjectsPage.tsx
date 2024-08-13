import React from "react";
import { DataTable } from "../../../components/tables/data-table";
import { auth } from "@/auth";
import prisma from "@/db";

import MyProjectsTable from "@/components/tables/MyProjectsTable";

export default async function MyProjectsPage() {
  const session = await auth();
  const project = await prisma.project.findMany({
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
  return (
    <div className="p-6">
      <MyProjectsTable projects={project as any} />
    </div>
  );
}
