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
import Link from "next/link";

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
            owner: true,
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

      <section className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-semibold">오늘 진행중인 프로젝트</h2>
          <Button asChild>
            <Link href={"/project/request"}>프로젝트 요청</Link>
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>프로젝트</TableHead>
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
            {user?.group?.projects.map((project) => (
              <TableRow>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.status}</TableCell>
                <TableCell>{user.group?.manager?.name}</TableCell>
                <TableCell>{project.startDate?.toLocaleDateString()}</TableCell>
                <TableCell>{project.endDate?.toLocaleDateString()}</TableCell>
                <TableCell>30%</TableCell>
                <TableCell>{project.difficulty}</TableCell>
                <TableCell>{user.group?.owner.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </main>
  );
}
