import React from "react";
import { auth } from "@/auth";

import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const page = async ({ params }: { params: { cid: string } }) => {
  const session = await auth();
  return (
    <div className="flex flex-col p-8 w-full gap-8">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">{params.cid}</h1>
        <Button variant={"outline"}>전담PM 수정</Button>
      </div>

      <div className="grid grid-cols-3 p-6 gap-4 bg-slate-50 rounded-lg ">
        <div className="flex gap-8">
          <div className="font-semibold">그룹 관리자</div>
          <div>Jane</div>
        </div>
        <div className="flex gap-8">
          <div className="font-semibold">그룹 이메일</div>
          <div>gildong@naver.com</div>
        </div>
        <div className="flex gap-8">
          <div className="font-semibold">플랜</div>
          <div>프로</div>
        </div>
        <div className="flex gap-8">
          <div className="font-semibold">전담 PM</div>
          <div>Jane</div>
        </div>
        <div className="flex gap-8">
          <div className="font-semibold">그룹 연락처</div>
          <div>02-1234-5678</div>
        </div>
        <div className="flex gap-8">
          <div className="font-semibold">플랜 기간</div>
          <div>2024.05.20~2024.08.20</div>
        </div>
      </div>

      <Tabs defaultValue="thread" className="">
        <TabsList>
          <TabsTrigger value="thread">프로젝트</TabsTrigger>
          <TabsTrigger value="wbs">WBS</TabsTrigger>
        </TabsList>
        <TabsContent value="thread">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">작업 이름</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>전담 PM</TableHead>
                <TableHead>작업자</TableHead>
                <TableHead>시작일</TableHead>
                <TableHead>종료일</TableHead>
                <TableHead>진척률</TableHead>
                <TableHead>난이도</TableHead>
                <TableHead>고객</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 1 }).map((e, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">프로젝트명</TableCell>
                  <TableCell>진행중</TableCell>
                  <TableCell>Jane</TableCell>
                  <TableCell>Zoey</TableCell>
                  <TableCell>2024.06.28</TableCell>
                  <TableCell>2024.06.29</TableCell>
                  <TableCell>40%</TableCell>
                  <TableCell>상</TableCell>
                  <TableCell>그룹명</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="wbs">
          <div className="flex flex-col gap-8 p-4">
            {Array.from({ length: 3 }).map((e, i) => (
              <div key={i} className="flex flex-col">
                <h2>프로젝트명</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">작업</TableHead>
                      <TableHead>작업자</TableHead>
                      <TableHead>시작일</TableHead>
                      <TableHead>종료일</TableHead>
                      <TableHead>완료 여부</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Array.from({ length: 2 }).map((e, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-medium">작업명</TableCell>
                        <TableCell>Zoey</TableCell>
                        <TableCell>2024.06.28</TableCell>
                        <TableCell>2024.06.29</TableCell>
                        <TableCell>완료</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
