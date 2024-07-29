"use client";

import React, { useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { TASKS, Task } from "@/data/tasks";
import { createProject } from "../actions";

const Page = () => {
  const [type, setType] = useState<String>("uiux");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  return (
    <form action={createProject} className="flex flex-col gap-8 w-full p-8">
      <h1 className="text-3xl font-bold">프로젝트 요청</h1>
      <Separator />
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold">기본 정보</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 p-4">
          <div className="flex items-center">
            <Label className="w-28">프로젝트명</Label>
            <Input name="projectName" className="" required />
          </div>
          <div className="flex items-center">
            <Label className="w-28">종류</Label>
            <Select name="type" onValueChange={(value) => setType(value)}>
              <SelectTrigger className="">
                <SelectValue placeholder="UXUI (웹/앱) 디자인" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UIUX">UXUI (웹/앱) 디자인</SelectItem>
                <SelectItem value="BRANDING">브랜딩 디자인 (BX)</SelectItem>
                <SelectItem value="LANDINGPAGE">랜딩페이지 디자인</SelectItem>
                <SelectItem value="CONTENTS">
                  콘텐츠 디자인 (SNS 피드/카드뉴스)
                </SelectItem>
                <SelectItem value="PRINT">
                  인쇄물 디자인 (명함) / 사이니지 디자인 (디지털 배너)
                </SelectItem>
                <SelectItem value="PRINT">
                  인쇄물 디자인 (리플랫/책자)
                </SelectItem>
                <SelectItem value="PPT">PPT 디자인</SelectItem>
                <SelectItem value="UX">UX 리서치 </SelectItem>
                <SelectItem value="MOTIONGRAPHIC">
                  2D / 3D 모션 그래픽
                </SelectItem>
                <SelectItem value="RENDERING">3D 렌더링</SelectItem>
                <SelectItem value="ETC">직접 정의</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center">
            <Label className="w-28">시작일</Label>
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
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center">
            <Label className="w-28">종료일</Label>
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
      </div>
      <div className="flex flex-col">
        <h2 className="text-xl font-semibold">예상 작업 리스트</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">작업 이름</TableHead>
              <TableHead>평균소요기간</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TASKS[`${type}`]?.map((task: Task, i: number) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{task.taskName}</TableCell>
                <TableCell>{task.time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">요청 사항</h2>
        <Textarea
          name="message"
          placeholder="Type your message here."
          id="message-2"
        />
      </div>
      <input type="hidden" name="startDate" value={startDate?.toISOString()} />
      <input type="hidden" name="endDate" value={endDate?.toISOString()} />
      {/* <input
        type="hidden"
        name="tasks"
        value={JSON.stringify(TASKS[`${type}`])}
      />
      {TASKS[`${type}`].map((task: Task) => (
        <input type="hidden" name="tasklist" value={JSON.stringify(task)} />
      ))} */}
      <Button className="w-fit">프로젝트 요청</Button>
    </form>
  );
};

export default Page;
