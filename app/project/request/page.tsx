'use client'

import React, {useState, useEffect} from 'react'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Calendar as CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from "@/components/ui/textarea"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"



const Page = () => {
  const [ type, setType ] =useState<String>();
  const [ startDate, setStartDate ] = useState<Date>();
  const [ endDate, setEndDate ] = useState<Date>();

  return (
    <div className='flex flex-col gap-6 w-full p-8'>
      <h1 className='text-3xl font-bold'>프로젝트 요청</h1>
      <Separator/>
      <div className='flex flex-col'>
        <h2 className='text-xl font-semibold'>기본 정보</h2>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 p-4'>
          <div className='flex p-2 gap-4'>
            <div className=''>프로젝트명</div>
            <Input className="w-[300px]"/>
          </div>
          <div className='flex p-1 gap-3'>
            <div>종류</div>
            <Select onValueChange={(value)=>setType(value)}>
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="UXUI (웹/앱) 디자인" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">UXUI (웹/앱) 디자인</SelectItem>
                <SelectItem value="dark">브랜딩 디자인 (BX)</SelectItem>
                <SelectItem value="system">랜딩페이지 디자인</SelectItem>
                <SelectItem value="system2">콘텐츠 디자인 (SNS 피드/카드뉴스)</SelectItem>
                <SelectItem value="system3">인쇄물 디자인 (명함) / 사이니지 디자인 (디지털 배너)</SelectItem>
                <SelectItem value="system4">인쇄물 디자인 (리플랫/책자)</SelectItem>
                <SelectItem value="system5">PPT 디자인</SelectItem>
                <SelectItem value="system6">UX 리서치 </SelectItem>
                <SelectItem value="system7">2D / 3D 모션 그래픽</SelectItem>
                <SelectItem value="system8">3D 렌더링</SelectItem>
                <SelectItem value="system9">직접 정의</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='flex p-1 gap-4'>
            <div>시작일</div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className='mr-2 h-4 w-4'/>
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
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
          <div className='flex p-1 gap-4'>
            <div>종료일</div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[280px] justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className='mr-2 h-4 w-4'/>
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
      <div className='flex flex-col'>
        <h2 className='text-xl font-semibold'>예상 작업 리스트</h2>
        <Table>          
                <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">작업 이름</TableHead>
                      <TableHead>평균소요기간</TableHead>
                    
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">INV001</TableCell>
                      <TableCell>Project name</TableCell>              
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">INV001</TableCell>
                      <TableCell>Project name</TableCell>             
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">INV001</TableCell>
                      <TableCell>Project name</TableCell>                
                    </TableRow>
                </TableBody>
            </Table>
      </div>
      <div className='flex flex-col gap-4'>
        <h2 className='text-xl font-semibold'>요청 사항</h2>
        <Textarea placeholder="Type your message here." id="message-2" />
      </div>
      <Button asChild className='w-fit'>
        <Link href="/project/test">프로젝트 요청</Link>
      </Button>
      <div>{type}</div>
    </div>
  )
}

export default Page 