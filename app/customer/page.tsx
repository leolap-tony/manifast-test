import { Separator } from '@/components/ui/separator'
import React from 'react'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

const page = () => {
  return (
    <div className='w-full flex flex-col gap-8 p-12'>
        <h1 className='text-4xl font-bold'>고객</h1>
        <Separator></Separator>
        <Table>          
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">작업 이름</TableHead>
              <TableHead>프로젝트 이름</TableHead>
              <TableHead>종료일</TableHead>
              <TableHead>배정 투입률</TableHead>
              <TableHead>실제 투입률</TableHead>
              <TableHead>메모</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Project name</TableCell>
              <TableCell>2024.06.08</TableCell>
              <TableCell>40%</TableCell>
              <TableCell>50%</TableCell>
              <TableCell>메모</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Project name</TableCell>
              <TableCell>2024.06.08</TableCell>
              <TableCell>40%</TableCell>
              <TableCell>50%</TableCell>
              <TableCell>메모</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Project name</TableCell>
              <TableCell>2024.06.08</TableCell>
              <TableCell>40%</TableCell>
              <TableCell>50%</TableCell>
              <TableCell>메모</TableCell>
            </TableRow>
          </TableBody>
        </Table>
    </div>
  )
}

export default page