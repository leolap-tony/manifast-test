import { Separator } from '@/components/ui/separator'
import React from 'react'
import Link from 'next/link'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Button } from '@/components/ui/button'

const page = () => {
  return (
    <div className='w-full flex flex-col gap-8 p-12'>
        <div className='flex justify-between items-center'>
          <h1 className='text-4xl font-bold'>프로젝트</h1>
          <Button asChild>
            <Link href="/project/request">프로젝트 요청</Link>
          </Button>
        </div>
        <Separator></Separator>
        <Table>          
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">작업 이름</TableHead>
              <TableHead>프로젝트 이름</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>전담 PM</TableHead>
              <TableHead>전담 디자이너</TableHead>
              <TableHead>시작일</TableHead>
              <TableHead>종료일</TableHead>
              <TableHead>진척률</TableHead>
              <TableHead>난이도</TableHead>
              <TableHead>고객</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Project name</TableCell>
              <TableCell>진행중</TableCell>
              <TableCell>JANE</TableCell>
              <TableCell>ZOEY</TableCell>
              <TableCell>2024.06.08</TableCell>
              <TableCell>2024.06.08</TableCell>
              <TableCell>40%</TableCell>
              <TableCell>상</TableCell>
              <TableCell>(그룹 관리자)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Project name</TableCell>
              <TableCell>진행중</TableCell>
              <TableCell>JANE</TableCell>
              <TableCell>ZOEY</TableCell>
              <TableCell>2024.06.08</TableCell>
              <TableCell>2024.06.08</TableCell>
              <TableCell>40%</TableCell>
              <TableCell>상</TableCell>
              <TableCell>(그룹 관리자)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell>Project name</TableCell>
              <TableCell>진행중</TableCell>
              <TableCell>JANE</TableCell>
              <TableCell>ZOEY</TableCell>
              <TableCell>2024.06.08</TableCell>
              <TableCell>2024.06.08</TableCell>
              <TableCell>40%</TableCell>
              <TableCell>상</TableCell>
              <TableCell>(그룹 관리자)</TableCell>
            </TableRow>
          </TableBody>
        </Table>
    </div>
  )
}

export default page