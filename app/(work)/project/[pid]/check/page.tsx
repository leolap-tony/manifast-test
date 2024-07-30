"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/elements/Button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/elements/Input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/elements/Switch";
import { Checkbox } from "@/components/elements/Checkbox";
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
  cancelProject,
} from "../../actions";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Header from "@/components/navigation/Header";
import KeyValueLabel from "@/components/elements/KeyValueLabel";
import { ko } from "date-fns/locale";
import Icon from "@/components/elements/Icon";

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
    project.data?.request_startDate!
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    project.data?.request_endDate!
  );
  const [difficulty, setDifficulty] = useState<string>();
  const [checkAll, setCheckAll] = useState<boolean>(false);

  useEffect(() => {
    TASKS[`${project.data?.type}`]?.map((task: Task) => {
      setTasks((prev) => [...prev, { ...task }]);
    });
  }, [project.data?.type]);

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
  }, [project.data]);
  const checkProjectWithTasks = checkProject.bind(null, tasks);

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
      newValue[i] = { ...newValue[i], [name]: date };
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
    <main className="page-contents">
      <Header type="page" title="프로젝트 검토" />
      <form className="flex flex-col w-full" action={checkProjectWithTasks}>
        <section className="flex flex-col pt-2 pb-6">
          <Header type="section" title="기본 정보" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-3 px-6">
            <KeyValueLabel
              direction="horizontal"
              label="프로젝트명"
              labelWidth={80}
            >
              <Input name="" defaultValue={project.data?.name} disabled />
            </KeyValueLabel>
            <KeyValueLabel direction="horizontal" label="종류" labelWidth={80}>
              <Input name="" defaultValue={project.data?.type!} disabled />
            </KeyValueLabel>
            <KeyValueLabel
              direction="horizontal"
              label="시작일"
              labelWidth={80}
            >
              <input
                type="hidden"
                name="startDate"
                value={startDate?.toISOString()}
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
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
            </KeyValueLabel>

            <KeyValueLabel
              direction="horizontal"
              label="종료일"
              labelWidth={80}
            >
              <input
                type="hidden"
                name="endDate"
                value={endDate?.toISOString()}
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
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
            </KeyValueLabel>
          </div>
        </section>

        <section className="flex flex-col">
          <Header type="section" title="작업 리스트">
            <div className="flex gap-2">
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
          </Header>
          <div className="px-6">
            <Table>
              <TableHeader>
                <TableRow className="text-nowrap">
                  <TableHead>
                    <Checkbox
                      onCheckedChange={(e: any) => setCheckAll(Boolean(e))}
                    />
                  </TableHead>
                  <TableHead>작업 이름</TableHead>
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
                              !tasks[i].startDate && "text-muted-foreground"
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
                              !tasks[i].endDate && "text-muted-foreground"
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
                    <TableCell className="flex flex-col gap-1 align-top">
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
                              <SelectValue placeholder="작업자 선택" />
                            </SelectTrigger>
                            <SelectContent>
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
                            onChange={(e) =>
                              setTasks((prev) => {
                                const newValue = [...prev];
                                newValue[i].workers![j].inputRate = parseInt(
                                  e.target.value
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
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => addWorker(i)}
                      >
                        작업자
                        <Icon icon="plus" className="fill-foreground ml-1" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="flex flex-col items-start">
          <Header type="section" title="난이도" />
          <div className="px-6 pb-6">
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
          </div>
          <input type="hidden" name="difficulty" value={difficulty} />
        </section>
        <div className="px-6 flex justify-between items-center">
          <Button>검토 완료</Button>
          <Button
            type="button"
            variant={"outline"}
            className="text-red-500"
            onClick={async () => {
              await cancelProject(pid as string);
            }}
          >
            프로젝트 취소하기
          </Button>
        </div>
        <input type="hidden" name="pid" value={pid} />
      </form>
    </main>
  );
};

export default Page;
