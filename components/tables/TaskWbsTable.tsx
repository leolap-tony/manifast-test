"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
} from "../ui/table";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import UserArray from "../UserArray";
import { getUniqueWorkers } from "@/lib/getUniqueWorkers";
import { TaskWithWorkers } from "@/types/queryInterface";
import Chips from "../elements/Chips";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "../ui/sheet";
import { Textarea } from "../elements/Textarea";
import Header from "../navigation/Header";
import KeyValueLabel from "../elements/KeyValueLabel";
import { Button } from "../elements/Button";
import { completeTask } from "@/app/(work)/project/actions";

export default function TaskWbsTable({ tasks }: { tasks: TaskWithWorkers[] }) {
  const columns: ColumnDef<TaskWithWorkers>[] = [
    {
      accessorKey: "name",
      header: "작업",
      cell: ({ row }) => {
        const users = row.original.workers.flatMap((task) => task.worker);
        return (
          <Sheet>
            <SheetTrigger asChild>
              <div className="w-full text-left">
                {row.original.isMilestone && <span>📍 </span>}
                {row.original.name}
              </div>
            </SheetTrigger>
            <SheetContent className="p-0 flex flex-col gap-0">
              <SheetHeader className="text-title-lg flex flex-row pt-8 pb-5 px-6">
                {row.original.isMilestone && <span>📍</span>}
                {row.original.name}
              </SheetHeader>
              <div className="flex flex-col gap-3 px-6 py-4 bg-background-gray">
                <KeyValueLabel label="작업자" labelWidth={86} direction="row">
                  <UserArray users={users} maxAmount={2} orientation="row" />
                </KeyValueLabel>
                <KeyValueLabel label="시작일" labelWidth={86} direction="row">
                  {row.original.startDate
                    ? format(row.original.startDate, "PPP", { locale: ko })
                    : "미정"}
                </KeyValueLabel>
                <KeyValueLabel label="종료일" labelWidth={86} direction="row">
                  {row.original.endDate
                    ? format(row.original.endDate, "PPP", { locale: ko })
                    : "미정"}
                </KeyValueLabel>
                <KeyValueLabel label="상태" labelWidth={86} direction="row">
                  {row.original.isComplete ? (
                    <Chips type="status" value="COMPLETE" />
                  ) : (
                    <Chips type="status" value="LIVE" />
                  )}
                </KeyValueLabel>
              </div>
              <Header type="section" title="작업물" />
              <div className="px-6">
                <Textarea defaultValue="구현 예정" disabled />
              </div>
              <Button
                variant={row.original.isComplete ? "outline" : "default"}
                className="absolute right-6 bottom-2 w-fit"
                onClick={async (e) => {
                  try {
                    await completeTask(row.original.id, !row.original.isComplete);
                  } catch (error) {
                    alert('작업을 수정할 수 없습니다.')
                  }
                }}
              >
                {row.original.isComplete ? "완료 취소" : "작업 완료"}
              </Button>
            </SheetContent>
          </Sheet>
        );
      },
    },
    {
      accessorKey: "worker",
      header: "작업자",
      cell: ({ row }) => {
        const users = row.original.workers.flatMap((task) => task.worker);
        return <UserArray users={users} orientation="col" maxAmount={3} />;
      },
    },
    {
      accessorKey: "startDate",
      header: "시작일",
      accessorFn: (row) => {
        const date = row.startDate;
        return date ? format(date, "PPP", { locale: ko }) : "미정";
      },
    },
    {
      accessorKey: "endDate",
      header: "종료일",
      accessorFn: (row) => {
        const date = row.endDate;
        return date ? format(date, "PPP", { locale: ko }) : "미정";
      },
    },
    {
      accessorKey: "isComplete",
      header: "상태",
      cell: (info) => (
        <div className="w-full flex justify-center">
          {info.getValue() ? (
            <Chips type="status" value="COMPLETE" />
          ) : (
            <Chips type="status" value="LIVE" />
          )}
        </div>
      ),
    },
  ];

  const table = useReactTable({
    columns: columns,
    data: tasks,
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
              검색 결과가 없습니다.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
