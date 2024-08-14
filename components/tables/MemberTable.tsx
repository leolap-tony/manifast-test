"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Task } from "@/data/tasks";
import {
  Group,
  Project,
  Role,
  TaskReport,
  TaskWorker,
  User,
} from "@prisma/client";
import React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import Link from "next/link";
import UserAvatar from "../elements/UserAvatar";
import Header from "../navigation/Header";
import {
  getDifficultyIcon,
  roleAndAuthorityToKorean,
} from "@/lib/textReplacer";
import Chips from "../elements/Chips";
import { Input } from "../elements/Input";
import { DataTable } from "./data-table";

export interface MemberTableProps extends Partial<User> {
  project: Partial<Project[]>;
  tasks: Partial<
    TaskWorker & { task: Partial<Task> & { taskReport: TaskReport } }
  >[];
}

const columns: ColumnDef<MemberTableProps>[] = [
  {
    accessorKey: "name",
    header: "이름",
    cell: ({ row }) => {
      return (
        <UserAvatar
          user={{ name: row.original.name, image: row.original.image }}
          label
        />
      );
    },
  },
  {
    accessorKey: "role",
    header: "직무",
    accessorFn: (info) => roleAndAuthorityToKorean(info.role as Role),
  },
  {
    id: "todayDifficulty",
    accessorKey: "project",
    header: "오늘 난이도",
    cell: ({ row }) => {
      const rate = row.original.project.reduce(
        (acc, item) => acc + (item ? item.difficulty : 0),
        0
      );
      const today = rate / row.original.project.length;
      return getDifficultyIcon(today ? today : 0);
    },
  },
  {
    id: "todayInputrate",
    accessorKey: "tasks",
    header: "오늘 투입률",
    accessorFn: (info) => {
      if (!info.tasks.length) return 0 + "%";
      const totalInput = info.tasks.reduce(
        (acc, task) => acc + (task.inputRate ?? 0),
        0
      );
      return totalInput + "%";
    },
  },
  { accessorKey: "project.length", header: "프로젝트 수" },
  { accessorKey: "_count.managementGroups", header: "고객 수" },
  { accessorKey: "tasks.length", header: "작업 수" },
  {
    accessorKey: "tasks",
    header: "보고 상태",
    accessorFn: (info) => {
      if (!info.tasks.length) return 0;
      const res = info.tasks.filter((task) => task.task?.taskReport.length);
      return res.length;
    },
    cell: (info) => {
      const value = info.getValue() as number;
      const taskLength = info.row.original.tasks.length;
      const status = () => {
        if (taskLength == 0 || value == taskLength) return "COMPLETE";
        if (value == 0) return "STANDBY";
        return "LIVE";
      };
      return (
        <div className="w-full flex justify-center">
          <Chips type="status" value={status()} />
        </div>
      );
    },
  },
];

export default function MemberTable({
  members,
}: {
  members: MemberTableProps[];
}) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    columns: columns,
    data: members,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });
  return <DataTable columns={columns} data={members} filter />;
}
