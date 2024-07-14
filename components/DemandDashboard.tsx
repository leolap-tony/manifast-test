import { auth, signOut } from "@/auth";
import Image from "next/image";
import prisma from "@/db";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function DemandDashboard() {
  const session = await auth();
  const user =
    session &&
    (await prisma.user.findUnique({
      where: {
        id: session.user.sub,
      },
      include: {
        group: {
          include: {
            manager: true,
            projects: true,
          },
        },
      },
    }));
  return (
    <main className="flex flex-col gap-12 p-12 w-full">
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold">
          {session?.user.name}님, 안녕하세요
        </h1>
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <Button variant="outline">로그 아웃</Button>
        </form>
      </div>
      <Separator />
      <p>{JSON.stringify(user)}</p>
      <div className="flex gap-4">
        <div className="border rounded-lg w-1/3 p-6 flex justify-between">
          <div>진행중인 프로젝트</div>
          <div className="pt-6 text-xl font-semibold">
            {user?.group?.projects.length}
          </div>
        </div>
        <div className="border rounded-lg w-1/3 p-6 flex justify-between">
          <div>전담 PM</div>
          <div className="pt-6 text-xl font-semibold">
            {user?.group?.manager?.name}
          </div>
        </div>
      </div>
      {session?.user.role == "ADMIN" && (
        <section className="flex flex-col gap-8">
          <h2 className="text-3xl font-semibold">오늘 진행중인 프로젝트</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">프로젝트</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>전담 PM</TableHead>
                <TableHead>시작일</TableHead>
                <TableHead>종료일</TableHead>
                <TableHead>진척률</TableHead>
                <TableHead>난이도</TableHead>
                <TableHead>고객</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Project name</TableCell>
                <TableCell>2024.06.08</TableCell>
                <TableCell>40%</TableCell>
                <TableCell>50%</TableCell>
                <TableCell>메모</TableCell>
                <TableCell>상</TableCell>
                <TableCell>(그룹 관리자)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Project name</TableCell>
                <TableCell>2024.06.08</TableCell>
                <TableCell>40%</TableCell>
                <TableCell>50%</TableCell>
                <TableCell>메모</TableCell>
                <TableCell>상</TableCell>
                <TableCell>(그룹 관리자)</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </section>
      )}
      {/* <p>{JSON.stringify(session)}</p> */}
    </main>
  );
}
