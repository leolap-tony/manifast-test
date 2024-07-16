import { auth, signOut } from "@/auth";
import Image from "next/image";
import { redirect } from "next/navigation";
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
import { submitReport } from "@/app/actions";

export default async function Home() {
  const session = await auth();
  const user =
    session &&
    (await prisma.user.findUnique({
      where: {
        id: session.user.sub,
      },
      include: {
        managementGroups: {
          include: {
            projects: {
              include: {
                group: {
                  include: {
                    owner: true,
                  },
                },
                tasks: {
                  include: {
                    workers: {
                      include: {
                        worker: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        tasks: {
          include: {
            task: {
              include: {
                project: true,
              },
            },
            taskReport: {
              where: {
                date: {
                  equals: new Date(),
                },
              },
            },
          },
        },
      },
    }));
  return (
    <div className="flex flex-col gap-12 p-12 w-full">
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
      {/* <p>{JSON.stringify(user)}</p> */}
      <div className="flex gap-4">
        <div className="border rounded-lg w-1/3 p-6 flex justify-between">
          <div>진행중인 프로젝트</div>
          <div className="pt-6 text-xl font-semibold">
            {new Set(user?.tasks?.map((task) => task.task.projectId)).size}
          </div>
        </div>
        <div className="border rounded-lg w-1/3 p-6 flex justify-between">
          <div>오늘 투입률</div>
          <div className="pt-6 text-xl font-semibold">
            {user?.tasks?.reduce((a, c) => a + c.inputRate, 0)}%
          </div>
        </div>
        <div className="border rounded-lg w-1/3 p-6 flex justify-between">
          <div>오늘 업무 난이도</div>
          <div className="pt-6 text-xl font-semibold">3</div>
        </div>
      </div>
      {(session?.user.role == "MANAGER" || session?.user.role == "WORKER") && (
        <form className="flex flex-col gap-8" action={submitReport}>
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-semibold">오늘 작업</h2>
            <Button>보고 등룩</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>작업 이름</TableHead>
                <TableHead>프로젝트 이름</TableHead>
                <TableHead>시작일</TableHead>
                <TableHead>종료일</TableHead>
                <TableHead>배정 투입률</TableHead>
                <TableHead className="w-[100px]">실제 투입률</TableHead>
                <TableHead>메모</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!user?.tasks?.some((task) => task.taskReport.length) ? (
                user?.tasks?.map((task, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-medium">
                      {task.task.name}
                    </TableCell>
                    <TableCell>{task.task.project.name}</TableCell>
                    <TableCell>
                      {task.startDate?.toLocaleDateString()}
                    </TableCell>
                    <TableCell>{task.endDate?.toLocaleDateString()}</TableCell>
                    <TableCell>{task.inputRate}%</TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Input name="todayInputRate" required />%
                    </TableCell>
                    <TableCell>
                      <Input name="message" />
                    </TableCell>
                    <input type="hidden" name="userId" value={task.userId} />
                    <input type="hidden" name="taskId" value={task.id} />
                  </TableRow>
                ))
              ) : (
                <TableRow className="text-gray-400 p-4">
                  <TableCell>보고가 등록되었습니다.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </form>
      )}
      {session?.user.role == "MANAGER" && (
        <section className="flex flex-col gap-8">
          <h2 className="text-3xl font-semibold">오늘 진행중인 프로젝트</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">프로젝트</TableHead>
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
              {user?.managementGroups
                .flatMap((group) => group.projects)
                .map((project,i) => (
                  <TableRow key={i}>
                    <TableCell>{project.name}</TableCell>
                    <TableCell>{project.status}</TableCell>                   
                    <TableCell>
                      {Array.from(
                        new Set(
                          project.tasks
                            .flatMap((task) => task.workers)
                            .map((worker) => worker.worker.name),
                        ),
                      ).map((worker,i) => (
                        <div key={i}>{worker}</div>
                      ))}
                    </TableCell>
                    <TableCell>
                      {project.startDate?.toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {project.endDate?.toLocaleDateString()}
                    </TableCell>
                    <TableCell>40%</TableCell>
                    <TableCell>{project.difficulty}</TableCell>
                    <TableCell>{project.group?.owner.name}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </section>
      )}
    </div>
  );
}
