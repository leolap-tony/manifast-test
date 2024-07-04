import { auth, signOut } from "@/auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import prisma from "@/db";

import { Separator } from "@/components/ui/separator";
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
import SignOutButton from "@/components/SignOutButton";

export default async function Home() {
  const session = await auth();
  const user =
    session &&
    (await prisma.user.findUnique({
      where: {
        id: session.user.sub,
      },
    }));
  if (!user?.role) {
    redirect("/onboarding");
  }
  return (
    <main className="flex flex-col gap-12 p-12 w-full">
      <div className="flex justify-between">
        <h1 className="text-4xl font-bold">
          {session?.user.name}님, 안녕하세요
        </h1>
        {/* <SignOutButton/>      */}
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
      <div className="flex gap-4">
        <div className="border rounded-lg w-1/3 p-12">진행중인 프로젝트</div>
        <div className="border rounded-lg w-1/3 p-12">진행중인 프로젝트</div>
        <div className="border rounded-lg w-1/3 p-12">진행중인 프로젝트</div>
      </div>
      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-semibold">오늘 작업</h2>
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
      </section>
      <section className="flex flex-col gap-8">
        <h2 className="text-3xl font-semibold">오늘 진행중인 프로젝트</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">프로젝트</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>담당 디자이너</TableHead>
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
              <TableCell>2024.06.08</TableCell>
              <TableCell>40%</TableCell>
              <TableCell>50%</TableCell>
              <TableCell>메모</TableCell>
              <TableCell>상</TableCell>
              <TableCell>(그룹 관리자)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
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
      {/* <p>{JSON.stringify(session)}</p> */}
    </main>
  );
}
