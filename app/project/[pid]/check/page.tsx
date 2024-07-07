'use client'

import React, {ChangeEvent, FormEvent, useEffect, useState} from "react";
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
import { TASKS,Task } from "@/data/tasks";

const page = () => {
  //세션 정보
  //프로젝트 정보
  //공급 그룹 정보
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(()=>{
    TASKS[`uiux`].map((task)=>{
      setTasks((prev)=>[...prev,{...task,startDate:'',}])
    })
  },[])

  const handleChange = (e:ChangeEvent<HTMLInputElement>, i:number) => {
    const {name, value} = e.target;
    console.log(name, value)
    console.log('test')
    setTasks((prev)=>{
      prev[i] = {...prev[i],[name]:value}
      const newValue = [...prev]
      newValue[i]={...newValue[i],[name]:value}
      return newValue
    })
  }
  const handleSwitch = (i:number) => {
    setTasks((prev)=>{
      const newValue = [...prev]
      console.log(!newValue[i].milestone)
      newValue[i] = {...newValue[i],milestone:!newValue[i].milestone}
      return newValue
    })
  }

  return (
    <div className="flex flex-col gap-8 p-8 w-full">
      <h1 className="text-3xl font-bold">프로젝트 검토/수정</h1>
      <Separator />
      <p>{JSON.stringify(tasks)}</p>
      <section className="flex flex-col">
        <h2 className="text-xl font-semibold">기본 정보</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-4 p-4">
          <div className="flex items-center">
            <Label className="w-28">프로젝트명</Label>
            <Input name="projectName" className="" />
          </div>
          <div className="flex items-center">
            <Label className="w-28">종류</Label>
            <Input name="projectName" className="" />
          </div>
          <div className="flex items-center">
            <Label className="w-28">시작일</Label>
            <Input name="projectName" className="" />
          </div>
          <div className="flex items-center">
            <Label className="w-28">종료일</Label>
            <Input name="projectName" className="" />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">예상 작업 리스트</h2>
          <div className="flex gap-4">
            <Button variant={"outline"}>삭제</Button>
            <Button variant={"outline"}>작업자 일괄 배정</Button>
            <Button>작업 추가</Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox />
              </TableHead>
              <TableHead>작업</TableHead>
              <TableHead>마일스톤</TableHead>
              <TableHead>시작일</TableHead>
              <TableHead>종료일</TableHead>
              <TableHead>작업자&투입률</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task,i)=>(
              <TableRow>
                <TableCell>
                  <Checkbox />
                </TableCell>
                <TableCell>
                  <Input name='taskName' defaultValue={tasks[i].taskName} onChange={(e)=>handleChange(e,i)}/>
                </TableCell>
                <TableCell>
                  <Switch name='milestone' defaultChecked={tasks[i].milestone} onClick={()=>handleSwitch(i)}/>
                </TableCell>
                <TableCell>
                  <Input />
                </TableCell>
                <TableCell>
                  <Input />
                </TableCell>
                <TableCell className="flex flex-col gap-1">
                  <div className="flex gap-2">                  
                    <Select name="type">
                      <SelectTrigger>
                        <SelectValue placeholder="작업자 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wendy">Wendy</SelectItem>
                        <SelectItem value="zoey">Zoey</SelectItem>
                        <SelectItem value="tony">Tony</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input />                  
                  </div>                  
                </TableCell>
                <TableCell><Button>작업자추가</Button></TableCell>              
              </TableRow>
            ))}            
          </TableBody>
        </Table>
      </section>

      <section className="flex flex-col items-start gap-5">
        <h2 className="text-xl font-semibold">난이도</h2>
        <ToggleGroup type="single" variant={"outline"} size={"lg"}>
          <ToggleGroupItem value="high">상</ToggleGroupItem>
          <ToggleGroupItem value="medium">중</ToggleGroupItem>
          <ToggleGroupItem value="low">하</ToggleGroupItem>
        </ToggleGroup>
      </section>

      <div className="flex justify-between items-center">
        <Button>검토 완료</Button>
        <Button variant={"outline"} className="text-red-500">
          프로젝트 취소/중단하기
        </Button>
      </div>
    </div>
  );
};

export default page;
