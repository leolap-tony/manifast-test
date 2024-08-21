"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/elements/Button";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/elements/Input";
import { Textarea } from "@/components/elements/Textarea";
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/elements/Select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import KeyValueLabel from "@/components/elements/KeyValueLabel";
import { ProjectTemplate, TaskTemplate } from "@prisma/client";
import Header from "@/components/navigation/Header";
import { ko } from "date-fns/locale";
import { createProject } from "../actions";

export default function ProjectRequestForm({
  templates,
}: {
  templates: Array<ProjectTemplate & { taskTemplate: TaskTemplate[] }>;
}) {
  const categories = templates
    .map((item) => item.category)
    .filter(
      (category, index, self) =>
        category !== null && self.indexOf(category) === index
    );
  const [templateName, setTemplateName] = useState<string | null>(null);
  const [templateTaskList, setTemplateTaskList] = useState<TaskTemplate[]>();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  useEffect(() => {
    setTemplateTaskList(
      templates.find((template) => template.name === templateName)?.taskTemplate
    );
  }, [templateName, templates]);

  const handleSubmit = async (formData : FormData) => {
    try {
      await createProject(formData)
    } catch (e) {
      alert('프로젝트를 생성할 수 없습니다.')
    }
  }

  return (
    <form action={handleSubmit} method="POST">
      <section>
        <Header type="section" title="기본 정보" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 px-6 pb-6">
          <KeyValueLabel direction="row" label="프로젝트 명" labelWidth={64}>
            <Input name="name" required />
          </KeyValueLabel>
          <KeyValueLabel direction="row" label="종류" labelWidth={64}>
            <Select
              name="projectTemplateName"
              required
              onValueChange={(e) => setTemplateName(e)}
            >
              <SelectTrigger>
                <SelectValue placeholder="선택하세요." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => {
                  return (
                    <SelectGroup key={category}>
                      <SelectLabel>{category}</SelectLabel>
                      {templates
                        .filter((template) => template.category === category)
                        .map((item) => {
                          return (
                            <SelectItem key={item.id} value={item.name}>
                              {item.name}
                            </SelectItem>
                          );
                        })}
                    </SelectGroup>
                  );
                })}
              </SelectContent>
            </Select>
          </KeyValueLabel>
          <KeyValueLabel direction="row" label="시작일" labelWidth={64}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-between text-left")}
                >
                  {startDate ? (
                    format(startDate, "PPP", { locale: ko })
                  ) : (
                    <div>시작일을 선택하세요</div>
                  )}
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  initialFocus
                  selected={startDate}
                  onSelect={setStartDate}
                />
              </PopoverContent>
            </Popover>
          </KeyValueLabel>
          <KeyValueLabel direction="row" label="종료일" labelWidth={64}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn("w-full justify-between text-left")}
                >
                  {endDate ? (
                    format(endDate, "PPP", { locale: ko })
                  ) : (
                    <div>종료일을 선택하세요</div>
                  )}
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  initialFocus
                  selected={endDate}
                  onSelect={setEndDate}
                />
              </PopoverContent>
            </Popover>
          </KeyValueLabel>
        </div>
      </section>
      <section>
        <Header type="section" title="에상 작업 리스트" />
        <div className="px-6 pb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">작업 이름</TableHead>
                <TableHead>평균소요기간</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templateTaskList?.map((task) => {
                return (
                  <TableRow key={task.id}>
                    <TableCell>{task.name}</TableCell>
                    <TableCell>{task.cost}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </section>
      <section>
        <Header type="section" title="요청 사항" />
        <div className="px-6 pb-6">
          <Textarea
            name="message"
            placeholder="요청 사항을 입력하세요"
            id="message"
          />
        </div>
      </section>
      <input
        type="hidden"
        name="startDate"
        value={startDate?.toString()}
        required
      />
      <input
        type="hidden"
        name="endDate"
        value={endDate?.toString()}
        required
      />
      <div className="p-6">
        <Button>프로젝트 요청</Button>
      </div>
    </form>
  );
}
