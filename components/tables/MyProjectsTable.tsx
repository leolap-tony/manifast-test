"use client";

import { ProjectWithTasks } from "@/types/queryInterface";
import React from "react";

import Chips from "@/components/elements/Chips";
import UserAvatar from "@/components/elements/UserAvatar";
import UserArray from "@/components/UserArray";
import { getUniqueWorkers } from "@/lib/getUniqueWorkers";
import { Project, Task, User } from "@prisma/client";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import Link from "next/link";
import { DataTable } from "./data-table";

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "name",
    header: "프로젝트",
    size: 500,
    cell: (props) => (
      <Link href={`/project/${props.row.original.id}`}>
        <span className="flex flex-row items-center gap-2">
          {props.getValue() as string}
          <Chips type="difficulty" value={props.row.original.difficulty} />
        </span>
      </Link>
    ),
  },
  {
    accessorKey: "manager",
    header: "전담PM",
    cell: (props) => {
      return <UserAvatar user={props.getValue() as User} label />;
    },
  },
  {
    accessorKey: "tasks",
    header: "작업자",
    cell: (props) => {
      const worker = getUniqueWorkers(props.getValue() as any);
      return <UserArray users={worker} orientation="col" maxAmount={3} />;
    },
  },
  {
    accessorKey: "startDate",
    header: "시작일",
    accessorFn: (row) =>
      row.startDate
        ? format(row.startDate as Date, "PPP", { locale: ko })
        : "미정",
  },
  {
    accessorKey: "endDate",
    header: "종료일",
    accessorFn: (row) =>
      row.endDate ? format(row.endDate as Date, "PPP", { locale: ko }) : "미정",
  },
  { accessorKey: "group.name", header: "고객" },
];

export default function MyProjectsTable({
  projects,
}: {
  projects: ProjectWithTasks;
}) {
  return <DataTable columns={columns} data={projects as any} filter />;
}
