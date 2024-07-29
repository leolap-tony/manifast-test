"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCaption,
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
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { TASKS, Task } from "@/data/tasks";
import {
  checkProject,
  getUserGroup,
  getProjectInfo,
  updateProject,
  stopProject,
} from "../../actions";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const Page = () => {
  const { pid } = useParams();
  const project = useQuery({
    queryKey: ["project", pid],
    queryFn: async () => {
      const data = await getProjectInfo(pid as string);
      return data;
    },
  });
  const user = useQuery({
    queryKey: ["user", pid],
    queryFn: async () => {
      const data = await getUserGroup();
      return data;
    },
  });

  const [tasks, setTasks] = useState<Task[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(
    project.data?.request_startDate!,
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    project.data?.request_endDate!,
  );
  const [difficulty, setDifficulty] = useState<string>();
  const [checkAll, setCheckAll] = useState<boolean>(false);

  // useEffect(() => {
  //   TASKS[`${project.data?.type}`]?.map((task: Task) => {
  //     setTasks((prev) => [...prev, { ...task }]);
  //   });
  // }, [project.data?.type]);

  useEffect(() => {
    setTasks((prev) => {
      const newValue = [...prev];
      newValue.forEach((e) => (e.checked = checkAll));
      return newValue;
    });
  }, [checkAll]);
  useEffect(() => {
    setStartDate(project.data?.request_startDate!);
    setEndDate(project.data?.request_endDate!);
    setDifficulty(project.data?.difficulty.toString());
  }, [project.data]);
  useEffect(() => {
    const tasks = project.data?.tasks.map((task) => {
      return {
        checked: false,
        milestone: task.isMilestone,
        taskName: task.name,
        startDate: task.startDate,
        endDate: task.endDate,
        workers: task.workers.map((worker) => ({
          worker: worker.worker.id,
          workerName: worker.worker.name,
          inputRate: worker.inputRate,
        })),
      };
    });
    console.log("tasks:", tasks);
    tasks && setTasks(tasks as Task[]);
  }, [project.data?.tasks]);

  const updateProjectWithTasks = updateProject.bind(null, tasks);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, i: number) => {
    const { name, value } = e.target;
    console.log(name, value);
    console.log("test");
    setTasks((prev) => {
      const newValue = [...prev];
      newValue[i] = { ...newValue[i], [name]: value };
      return newValue;
    });
  };
  const handleSwitch = (i: number) => {
    setTasks((prev) => {
      const newValue = [...prev];
      newValue[i] = { ...newValue[i], milestone: !newValue[i].milestone };
      return newValue;
    });
  };
  const handleDate = (date: Date, i: number, name: string) => {
    setTasks((prev) => {
      const newValue = [...prev];
      newValue[i] = { ...newValue[i], [name]: date.toLocaleDateString() };
      return newValue;
    });
  };
  const addWorker = (i: number) => {
    setTasks((prev) => {
      const newValue = [...prev];
      newValue[i].workers?.push({ worker: "", inputRate: 0 });
      return newValue;
    });
  };
  const deleteTaks = () => {
    setTasks((prev) => {
      const newValue = [...prev];
      return newValue.filter((e) => !e.checked);
    });
  };
  const addTask = () => {
    setTasks((prev) => {
      return [
        ...prev,
        {
          checked: false,
          milestone: false,
          order: 1,
          taskName: "",
          description: "",
          time: "",
          startDate: undefined,
          endDate: undefined,
          workers: [{ worker: "", inputRate: 0 }],
        },
      ];
    });
  };

  return (
    <form
      className="flex flex-col gap-8 p-8 w-full"
      action={updateProjectWithTasks}
    >
      <h1 className="text-3xl font-bold">프로젝트 수정</h1>
      <Separator />
      <section className="flex flex-col">
        <h2 className="text-xl font-semibold">기본 정보</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 p-4">
          <div className="flex items-center">
            <Label className="w-28">프로젝트명</Label>
            <Input name="" defaultValue={project.data?.name} disabled />
          </div>
          <div className="flex items-center">
            <Label className="w-28">종류</Label>
            <Input
              name=""
              className=""
              defaultValue={project.data?.type!}
              disabled
            />
          </div>
          <div className="flex items-center">
            <Label className="w-28">시작일</Label>
            <input
              type="hidden"
              name="startDate"
              value={startDate?.toLocaleDateString()}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  // onSelect={(e)=>console.log(new Date(e!.toDateString()))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center">
            <Label className="w-28">종료일</Label>
            <input
              type="hidden"
              name="endDate"
              value={endDate?.toLocaleDateString()}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">예상 작업 리스트</h2>
          <div className="flex gap-4">
            <Button type="button" variant={"outline"} onClick={deleteTaks}>
              삭제
            </Button>
            <Button type="button" variant={"outline"}>
              작업자 일괄 배정
            </Button>
            <Button type="button" onClick={addTask}>
              작업 추가
            </Button>
          </div>
        </div>
        <Table className="border">
          <TableHeader className="bg-neutral-50">
            <TableRow>
              <TableHead>
                <Checkbox
                  onCheckedChange={(e: any) => setCheckAll(Boolean(e))}
                />
              </TableHead>
              <TableHead>작업</TableHead>
              <TableHead>마일스톤</TableHead>
              <TableHead>시작일</TableHead>
              <TableHead>종료일</TableHead>
              <TableHead>작업자&투입률</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Checkbox
                    checked={tasks[i].checked}
                    onCheckedChange={(e) => {
                      setTasks((prev) => {
                        const newValue = [...prev];
                        newValue[i].checked = Boolean(e);
                        return newValue;
                      });
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    name="taskName"
                    defaultValue={tasks[i].taskName}
                    onChange={(e) => handleChange(e, i)}
                  />
                </TableCell>
                <TableCell>
                  <Switch
                    defaultChecked={tasks[i].milestone}
                    onClick={() => handleSwitch(i)}
                  />
                </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !tasks[i].startDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {tasks[i].startDate ? (
                          format(tasks[i].startDate as Date, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={tasks[i].startDate}
                        onSelect={(date) =>
                          handleDate(date as Date, i, "startDate")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !tasks[i].endDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {tasks[i].endDate ? (
                          format(tasks[i].endDate as Date, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={tasks[i].endDate}
                        onSelect={(date) =>
                          handleDate(date as Date, i, "endDate")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell className="flex flex-col gap-1">
                  {tasks[i].workers?.map((worker, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <Select
                        name="worker"
                        onValueChange={(e) => {
                          setTasks((prev) => {
                            const newValue = [...prev];
                            newValue[i].workers![j].worker = e;
                            return newValue;
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={worker.workerName} />
                        </SelectTrigger>
                        <SelectContent defaultValue={worker.worker}>
                          {user.data &&
                            user.data.group!.members.map((member, k) => (
                              <SelectItem key={k} value={member.id}>
                                {member.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <Input
                        name="inputRate"
                        type="number"
                        min="0"
                        max="100"
                        className="w-16"
                        value={worker.inputRate}
                        onChange={(e) =>
                          setTasks((prev) => {
                            const newValue = [...prev];
                            newValue[i].workers![j].inputRate = parseInt(
                              e.target.value,
                            );
                            return newValue;
                          })
                        }
                      />
                      <span>%</span>
                    </div>
                  ))}
                </TableCell>
                <TableCell>
                  <Button type="button" onClick={() => addWorker(i)}>
                    작업자추가
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>

      <section className="flex flex-col items-start gap-5">
        <h2 className="text-xl font-semibold">난이도</h2>
        <ToggleGroup
          type="single"
          variant={"outline"}
          size={"lg"}
          onValueChange={setDifficulty}
        >
          <ToggleGroupItem value="3">상</ToggleGroupItem>
          <ToggleGroupItem value="2">중</ToggleGroupItem>
          <ToggleGroupItem value="1">하</ToggleGroupItem>
        </ToggleGroup>
        <input type="hidden" name="difficulty" value={difficulty} />
      </section>
      <div className="flex justify-between items-center">
        <Button>수정 완료</Button>

        <Button
          type="button"
          variant={"outline"}
          className="text-red-500"
          onClick={async () => {
            await stopProject(pid as string);
          }}
        >
          프로젝트 중단하기
        </Button>
      </div>
      <input type="hidden" name="pid" value={pid} />
    </form>
  );
};

export default Page;
