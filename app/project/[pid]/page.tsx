import React from "react";
import { auth } from "@/auth";
import Link from "next/link";

import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Textarea } from "@/components/ui/textarea";
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
import prisma from "@/db";

const page = async ({ params }: { params: { pid: string } }) => {
  const session = await auth();
  const project = await prisma.project.findUnique({
    where: {
      id: params.pid,
    },
    include: {
      group: {
        include: { manager: true, owner: true },
      },
      tasks: true,
    },
  });
  return (
    <div className="flex flex-col p-8 w-full gap-8">
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">{project?.name}</h1>
        {session?.user.role == "WORKER" && (
          <Button asChild>
            <Link href={`/project/${params.pid}/check`}>프로젝트 검토하기</Link>
          </Button>
        )}
      </div>
      <div className="grid grid-cols-3 gap-4 p-6 bg-slate-50 rounded-lg ">
        <div className="flex gap-8">
          <div className="font-semibold">전담 PM</div>
          <div>{project?.group.manager?.name}</div>
        </div>
        <div className="flex gap-8">
          <div className="font-semibold">그룹</div>
          <div>{project?.group.name}</div>
        </div>
        <div className="flex gap-8">
          <div className="font-semibold">종류</div>
          <div>{project?.type}</div>
        </div>
        <div className="flex gap-8">
          <div className="font-semibold">작업자</div>
          <div>Jane</div>
        </div>
        <div className="flex gap-8">
          <div className="font-semibold">그룹 관리자</div>
          <div>{project?.group.owner.name}</div>
        </div>
        <div className="flex gap-8">
          <div className="font-semibold">상태</div>
          <div>{project?.status}</div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="text-lg">30% 요청됨</div>
          <div className="text-lg">2024.06.08 - 2024.06.18 (예정)</div>
        </div>
        <Progress value={30} className="[&>*]:bg-red-500" />
      </div>

      <Tabs defaultValue="thread" className="">
        <TabsList>
          <TabsTrigger value="thread">스레드</TabsTrigger>
          <TabsTrigger value="wbs">WBS</TabsTrigger>
        </TabsList>
        <TabsContent value="thread">
          <div className="flex flex-col gap-8 w-full p-4">
            <ToggleGroup type="single">
              <ToggleGroupItem value="normal">일반 메시지</ToggleGroupItem>
              <ToggleGroupItem value="complete">프로젝트 완료</ToggleGroupItem>
            </ToggleGroup>
            <Textarea placeholder="Type your message here." id="message-2" />
          </div>
        </TabsContent>
        <TabsContent value="wbs">
          <div className="flex flex-col">
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
