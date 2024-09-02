"use client";
import React, { useMemo, useState, useCallback, useEffect } from "react";
import { Button } from "@/components/elements/Button";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/elements/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ko } from "date-fns/locale";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/elements/Checkbox";
import { Switch } from "@/components/elements/Switch";
import { Project, Task, TaskWorker, User } from "@prisma/client";
import {
  ProjectWithTasks,
  TaskWithWorkers,
  TaskWorkerWithWorker,
} from "@/types/queryInterface";
import { Select, SelectItem } from "@radix-ui/react-select";
import {
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/elements/Select";
import UserAvatar from "@/components/elements/UserAvatar";
import { useFormStore } from "@/hooks/useProjectFormStore";
import Icon from "@/components/elements/Icon";
import Header from "@/components/navigation/Header";
import KeyValueLabel from "@/components/elements/KeyValueLabel";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/elements/Toggle-group";
import { updateProject, updateProjectStatus } from "../actions";
import { useRouter } from "next/navigation";

export default function ProjectRequestForm({
  project,
  members,
}: {
  project: ProjectWithTasks;
  members: Partial<User>[] | null;
}) {
  const {
    name,
    setName,
    startDate,
    endDate,
    difficulty,
    setDifficulty,
    setStatus,
    request_endDate,
    request_startDate,
    setDate,
    projectTemplateName,
    managerId,
    setManagerId,
    tasks,
    initData,
    addTask,
    removeWorker,
    updateTask,
    addWorker,
    updateWorker,
    removeTask,
  } = useFormStore();
  const router = useRouter();

  useEffect(() => {
    initData(project);
  }, []);

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const handleDeleteSelectedTasks = () => {
    // 선택된 행의 인덱스를 가져옵니다.
    const selectedRowIndexes = Object.keys(rowSelection).map(Number);

    // 인덱스를 역순으로 정렬하여 삭제
    selectedRowIndexes
      .sort((a, b) => b - a)
      .forEach((index) => {
        removeTask(index);
      });

    // 선택 초기화
    setRowSelection({});
  };
  const memberDataSelector = useCallback(
    (userId: string) => {
      return members?.find((member) => member.id === userId);
    },
    [members],
  );
  const handleSubmit = async () => {
    try {
      const form = useFormStore.getState() as ProjectWithTasks;
      const data = Object.fromEntries(
        Object.entries(form).filter((e) => typeof e[1] !== "function"),
      );
      await updateProject(data);
    } catch (error) {
      alert("프로젝트를 수정할 수 없습니다.");
    }
  };
  const handleCancle = async () => {
    if (project.status === "CANCEL") {
      await updateProjectStatus(project.id, "STANDBY");
    } else {
      await updateProjectStatus(project.id, "CANCEL");
    }
    router.push(`/project/${project.id}`);
  };

  const columns: ColumnDef<TaskWithWorkers>[] = useMemo(
    () => [
      {
        id: "select-col",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
      },
      {
        id: "name",
        accessorKey: "name",
        header: "작업 이름",
        cell: ({ row }) => (
          <Input
            value={row.original.name}
            onChange={(e) => updateTask(row.index, { name: e.target.value })}
          />
        ),
      },
      {
        id: "isMilestone",
        accessorKey: "isMilestone",
        header: "마일스톤",
        cell: ({ row }) => (
          <Switch
            checked={row.original.isMilestone}
            onCheckedChange={(value) =>
              updateTask(row.index, { isMilestone: value })
            }
          />
        ),
      },
      {
        id: "startDate",
        accessorKey: "startDate",
        header: "시작일",
        cell: ({ row }) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-full justify-between text-left gap-1")}
              >
                {row.original.startDate ? (
                  format(row.original.startDate, "yyyy.MM.dd", { locale: ko })
                ) : (
                  <div>시작일</div>
                )}
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                initialFocus
                selected={row.original.startDate || undefined}
                onSelect={(date) => updateTask(row.index, { startDate: date })}
              />
            </PopoverContent>
          </Popover>
        ),
      },
      {
        id: "endDate",
        accessorKey: "endDate",
        header: "종료일",
        cell: ({ row }) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-full justify-between text-left gap-1")}
              >
                {row.original.endDate ? (
                  format(row.original.endDate, "yyyy.MM.dd", { locale: ko })
                ) : (
                  <div>종료일</div>
                )}
                <CalendarIcon className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                initialFocus
                selected={row.original.endDate || undefined}
                onSelect={(date) => updateTask(row.index, { endDate: date })}
                fromDate={
                  row.original.startDate ? row.original.startDate : undefined
                }
              />
            </PopoverContent>
          </Popover>
        ),
      },
      {
        id: "workers",
        accessorKey: "workers",
        header: "작업자",
        cell: ({ row }) => (
          <div className="flex flex-row items-center gap-2">
            <div className="flex flex-col gap-2">
              {row.original.workers.length ? (
                row.original.workers.map((worker, idx) => {
                  return (
                    <div key={idx} className="flex flex-row items-center gap-2">
                      <div className="w-[108px]">
                        <Select
                          onValueChange={(e) =>
                            updateWorker(row.index, idx, { userId: e })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                <UserAvatar
                                  user={memberDataSelector(worker.userId)}
                                  label
                                />
                              }
                            >
                              <UserAvatar
                                user={memberDataSelector(worker.userId)}
                                label
                              />
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent className="w-[108px] flex flex-col gap-2">
                            {members &&
                              members.map((member, idx) => (
                                <SelectItem
                                  key={idx}
                                  value={member.id as string}
                                >
                                  <UserAvatar user={member} label />
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex flex-row items-center gap-1">
                        <Input
                          className="w-[48px] text-right"
                          defaultValue={worker.inputRate || 0}
                          onChange={(e) => {
                            updateWorker(row.index, idx, {
                              inputRate: Number(e.currentTarget.value),
                            });
                          }}
                        />
                        {/* <span>%</span> */}
                      </div>
                      <div className="">
                        <Button variant='ghost' className="bg-gray-200 rounded-full h-5 w-5" onClick={()=>{removeWorker(row.index,idx)}}>✕</Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="w-[180px] py-3 h-10 text-center">
                  작업자 없음
                </div>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => {
                addWorker(row.index, {
                  id: "",
                  taskId: row.original.id,
                  userId: "",
                  inputRate: 0,
                } as TaskWorkerWithWorker);
              }}
              className="gap-1"
            >
              작업자
              <Icon icon="plus" />
            </Button>
          </div>
        ),
      },
    ],
    [members, memberDataSelector, addWorker, updateTask, updateWorker],
  );

  const table = useReactTable({
    columns: columns,
    data: tasks as TaskWithWorkers[],
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  });

  return (
    <div>
      <section>
        <Header type="section" title="기본 정보" />
        <div className="px-6 pb-6 grid grid-cols-2 gap-x-8 gap-y-3">
          <KeyValueLabel direction="row" label="프로젝트명" labelWidth={80}>
            <Input
              defaultValue={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />
          </KeyValueLabel>
          <KeyValueLabel direction="row" label="종류" labelWidth={80}>
            <Input defaultValue={projectTemplateName} disabled/>
          </KeyValueLabel>
          <KeyValueLabel direction="row" label="시작일" labelWidth={80}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-between text-left gap-1")}
                >
                  {startDate ? (
                    format(startDate, "yyyy.MM.dd", { locale: ko })
                  ) : (
                    <div>시작일</div>
                  )}
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  initialFocus
                  selected={startDate || undefined}
                  onSelect={(date) => setDate(false, "start", date as Date)}
                />
              </PopoverContent>
            </Popover>
          </KeyValueLabel>
          <KeyValueLabel direction="row" label="종료일" labelWidth={80}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-between text-left gap-1")}
                >
                  {endDate ? (
                    format(endDate, "yyyy.MM.dd", { locale: ko })
                  ) : (
                    <div>종료일</div>
                  )}
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  initialFocus
                  selected={endDate || undefined}
                  onSelect={(date) => setDate(false, "end", date as Date)}
                  fromDate={startDate ? startDate : undefined}
                />
              </PopoverContent>
            </Popover>
          </KeyValueLabel>
        </div>
      </section>

      <section>
        <Header type="section" title="작업 리스트">
          <Button variant="destructive" onClick={handleDeleteSelectedTasks}>
            작업 제거
          </Button>
          <Button
            onClick={() =>
              addTask({
                name: "",
                isMilestone: false,
                startDate: null,
                endDate: null,
                workers: [] as TaskWorkerWithWorker[],
              } as TaskWithWorkers)
            }
          >
            작업 추가
          </Button>
        </Header>
        <div className="px-6">
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
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>PM 업무</TableCell>
                <TableCell>-</TableCell>
                <TableCell>{project.startDate?.toLocaleDateString()}</TableCell>
                <TableCell>{project.endDate?.toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="w-[108px]">
                    <Select
                      onValueChange={(e) =>
                        setManagerId(e)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            <UserAvatar
                              user={memberDataSelector(managerId as string)}
                              label
                            />
                          }                         
                        >
                          <UserAvatar
                            user={memberDataSelector(managerId as string)}
                            label
                          />
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="w-[108px] flex flex-col gap-2">
                        {members &&
                          members.map((member, idx) => (
                            <SelectItem key={idx} value={member.id as string}>
                              <UserAvatar user={member} label />
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                </TableCell>
              </TableRow>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="p-4 text-center"
                  >
                    작업이 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
      <section>
        <Header type="section" title="난이도" />
        <div className="px-6 pb-6">
          <ToggleGroup
            type="single"
            value={String(difficulty)}
            onValueChange={(e) => setDifficulty(Number(e))}
            className="w-fit border rounded-md p-1"
          >
            <ToggleGroupItem value="3">상</ToggleGroupItem>
            <ToggleGroupItem value="2">중</ToggleGroupItem>
            <ToggleGroupItem value="1">하</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </section>
      <div className="w-full px-6 flex flex-row justify-between">
        <Button onClick={() => handleSubmit()} className="w-fit">
          검토 완료
        </Button>
        <Button
          variant="outline"
          onClick={() => handleCancle()}
          className="w-fit text-primary"
        >
          {project.status === "CANCEL"
            ? "프로젝트 재개하기"
            : "프로젝트 취소하기"}
        </Button>
      </div>
    </div>
  );
}
