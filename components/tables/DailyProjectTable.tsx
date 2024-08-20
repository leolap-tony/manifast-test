"use client";
import React, { useMemo } from "react";
import { ProjectWithTasks } from "@/types/queryInterface";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Chips from "../elements/Chips";
import Link from "next/link";
import { getUniqueWorkers } from "@/lib/getUniqueWorkers";
import UserArray from "../UserArray";
import ProgressBar from "../ProgressBar";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function DailyProjectTable({
  projects,
}: {
  projects: ProjectWithTasks[];
}) {
  const columns: ColumnDef<ProjectWithTasks>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "프로젝트 명",
        cell: ({ row }) => (
          <div className="flex flex-row gap-2 items-center">
            <Link href={`/project/${row.original.id}`}>
              {row.original.name}
            </Link>
            <Chips
              type="difficulty"
              value={row.original.difficulty as number}
            />
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "상태",
        cell: (info) => (
          <div className="w-full flex justify-center">
            <Chips type="status" value={info.getValue() as string} />
          </div>
        ),
      },
      {
        accessorKey: "tasks",
        header: "작업자",
        cell: ({ row }) => {
          const worker = getUniqueWorkers(row.original.tasks);
          return <UserArray users={worker} orientation="col" maxAmount={3} />;
        },
      },
      {
        accessorKey: "startDate",
        header: "시작일",
        accessorFn: (row) => {
          const date =
            row.status === "REQUEST" ? row.request_startDate : row.startDate;
          return date ? format(date, "PPP", { locale: ko }) : "미정";
        },
      },
      {
        accessorKey: "endDate",
        header: "종료일",
        accessorFn: (row) => {
          const date =
            row.status === "REQUEST" ? row.request_endDate : row.endDate;
          return date ? format(date, "PPP", { locale: ko }) : "미정";
        },
      },
      {
        id: "process",
        header: "진척률",
        accessorFn: (row) => {
          const milestoneTasks = row.tasks.filter(
            (task) => task.isMilestone === true
          );
          const completed = milestoneTasks.filter(
            (task) => task.isComplete === true
          ).length;
          const progress = milestoneTasks.length
            ? (completed / milestoneTasks.length) * 100
            : 0;
          return progress;
        },
        cell: (info) => (
          <ProgressBar size="sm" value={info.getValue() as number} />
        ),
      },
      { accessorKey: "group.name", header: "고객명" },
    ],
    []
  );
  const table = useReactTable({
    columns: columns,
    data: projects,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="p-4 text-center">
              결과가 없습니다.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
