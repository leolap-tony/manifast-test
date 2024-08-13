"use client";
import React, { useEffect, useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Project, Task, TaskReport, TaskWorker } from "@prisma/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Input } from "../elements/Input";
import { useReportStore } from "@/hooks/useTaskReportFormStore";
import { createReport } from "@/app/(work)/dashboard/actions";
import { Button } from "../elements/Button";
import Header from "../navigation/Header";

export interface DailyTaskList extends Partial<TaskWorker> {
  id: string;
  userId: string;
  task: Task & {
    project: Pick<Project, "name" | "id">;
    taskReport: TaskReport[] | [];
  };
  inputRate: number;
}

export default function DailyTaskReportTable({
  tasks,
}: {
  tasks: DailyTaskList[];
}) {
  const { taskReports, setTaskReports, updateTaskReports } = useReportStore();

  useEffect(() => {
    const taskReportArray: Partial<TaskReport>[] = tasks.map((task) => ({
      userId: task.userId,
      taskId: task.taskId,
      standardInputRate: task.inputRate,
      todayInputRate: task.inputRate,
    }));
    setTaskReports(taskReportArray);
  }, []);
  const handleSubmit = async () => {
    createReport(taskReports);
  };

  const columns: ColumnDef<DailyTaskList>[] = useMemo(
    () => [
      {
        accessorKey: "task.name",
        header: "작업",
        cell: ({ row }) => (
          <div className="w-full text-left">
            <Link href={`/project/${row.original.task?.projectId}`}>
              {row.original.task?.isMilestone && <span>📍 </span>}
              {row.original.task?.name}
            </Link>
          </div>
        ),
      },
      {
        accessorKey: "task.project.name",
        header: "프로젝트",
      },

      {
        accessorKey: "startDate",
        header: "시작일",
        accessorFn: (row) => {
          const date = row.task?.startDate;
          return date ? format(date, "PPP", { locale: ko }) : "미정";
        },
      },
      {
        accessorKey: "endDate",
        header: "종료일",
        accessorFn: (row) => {
          const date = row.task?.endDate;
          return date ? format(date, "PPP", { locale: ko }) : "미정";
        },
      },
      {
        accessorKey: "inputRate",
        header: "배정 투입률",
        cell: ({ row }) => <span>{row.original.inputRate}%</span>,
        size: 40,
      },
      {
        id: "todayInputRate",
        header: "실제 투입률",
        cell: ({ row }) => {
          return (
            <div className="flex justify-center">
              <Input
                className="w-[60px]"
                type="number"
                placeholder={String(row.original.inputRate)}
                defaultValue={
                  row.original.task.taskReport.length
                    ? row.original.task.taskReport[0].todayInputRate
                    : undefined
                }
                disabled={row.original.task.taskReport.length >= 1}
                onChange={(e) =>
                  updateTaskReports(row.index, {
                    todayInputRate: Number(e.currentTarget.value),
                  })
                }
              />
            </div>
          );
        },
      },
      {
        id: "message",
        header: "메모",
        cell: ({ row }) => {
          return (
            <Input
              className="w-[120px]"
              disabled={row.original.task.taskReport.length >= 1}
              defaultValue={
                row.original?.task.taskReport.length > 0
                  ? row.original.task.taskReport[0].message ?? "없음"
                  : ""
              }
            />
          );
        },
      },
    ],
    []
  );
  const table = useReactTable({
    columns: columns,
    data: tasks,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <section>
      <Header type="section" title="오늘 작업">
        <Button onClick={handleSubmit}>보고 등록</Button>
      </Header>
      <div className="px-6 pb-6">
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
                    <TableCell key={cell.id} className="py-1.5">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
      </div>
    </section>
  );
}
