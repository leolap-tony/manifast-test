import { auth } from "@/auth";

import prisma from "@/db";

import { Button } from "@/components/elements/Button";
import { Input } from "@/components/elements/Input";
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
import Header from "./navigation/Header";
import { getUniqueWorkers } from "@/lib/getUniqueWorkers";
import UserArray from "./UserArray";
import Chips from "./elements/Chips";
import SummaryCard from "./SummaryCard";

export default async function SupplyDashboard() {
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
              where: {
                startDate: {
                  lte: new Date(),
                },
                endDate: {
                  gte: new Date(),
                },
              },
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
          where: {
            startDate: {
              lte: new Date(),
            },
            endDate: {
              gte: new Date(),
            },
          },
          include: {
            task: {
              include: {
                project: true,
                taskReport: {
                  where: {
                    userId: session.user.sub,
                    date: {
                      equals: new Date(),
                    },
                  },
                },
              },
            },
            // taskReport: {
            //   where: {
            //     date: {
            //       equals: new Date(),
            //     },
            //   },
            // },
          },
        },
      },
    }));

  return (
    <div className="flex flex-col">
      {/*<pre>{JSON.stringify(user, null, 2)}</pre>*/}
      <div className="grid grid-cols-3 gap-4 p-6">
        <SummaryCard type="project" value={0} />
        <SummaryCard type="inputRate" value={[0, 0]} />
        <SummaryCard type="difficulty" value={[0, 0]} />
      </div>
      {(session?.user.role == "MANAGER" || session?.user.role == "WORKER") && (
        <form className="flex flex-col" action={submitReport}>
          <Header type="section" title="오늘 작업">
            <Button>보고 등룩</Button>
          </Header>
          <div className="px-6 pb-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>작업 이름</TableHead>
                  <TableHead>프로젝트 이름</TableHead>
                  <TableHead>시작일</TableHead>
                  <TableHead>종료일</TableHead>
                  <TableHead>배정 투입률</TableHead>
                  <TableHead>실제 투입률</TableHead>
                  <TableHead>메모</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!user?.tasks?.some((task) => task.task.taskReport.length) ? (
                  user?.tasks?.map((task, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">
                        {task.task.name}
                      </TableCell>
                      <TableCell>{task.task.project.name}</TableCell>
                      <TableCell>
                        {task.startDate?.toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {task.endDate?.toLocaleDateString()}
                      </TableCell>
                      <TableCell>{task.inputRate}%</TableCell>
                      <TableCell className="flex items-center gap-2">
                        <Input name="todayInputRate" required />%
                      </TableCell>
                      <TableCell>
                        <Input name="message" />
                      </TableCell>
                      <input type="hidden" name="userId" value={task.userId} />
                      <input type="hidden" name="taskId" value={task.task.id} />
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="text-gray-400 p-4">
                    <TableCell>등록할 보고가 없습니다.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </form>
      )}
      {session?.user.role == "MANAGER" && (
        <section className="flex flex-col">
          <Header type="section" title="오늘 진행 중인 프로젝트" />
          <div className="px-6 pb-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="">프로젝트</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>담당 디자이너</TableHead>
                  <TableHead>시작일</TableHead>
                  <TableHead>종료일</TableHead>
                  <TableHead>진척률</TableHead>
                  <TableHead>고객</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {user?.managementGroups
                  .flatMap((group) => group.projects)
                  .map((project, i) => {
                    const worker = getUniqueWorkers(project.tasks);
                    return (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="w-full flex flex-row gap-2">
                            <div>{project.name}</div>
                            <Chips
                              type="difficulty"
                              value={project.difficulty}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Chips type="status" value={project.status} />
                        </TableCell>
                        <TableCell>
                          <UserArray
                            users={worker}
                            orientation="col"
                            maxAmount={2}
                          />
                        </TableCell>
                        <TableCell>
                          {project.startDate?.toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {project.endDate?.toLocaleDateString()}
                        </TableCell>
                        <TableCell>40%</TableCell>
                        <TableCell>{project.group?.name}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        </section>
      )}
    </div>
  );
}
