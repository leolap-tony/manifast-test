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
import SupplyDashboard from "@/components/SupplyDashboard";
import DemandDashboard from "@/components/DemandDashboard";

export default async function Home() {
  const session = await auth();
  // const user =
  //   session &&
  //   (await prisma.user.findUnique({
  //     where: {
  //       id: session.user.sub,
  //     },
  //     include: {
  //       tasks: {
  //         include: {
  //           task: {
  //             include: {
  //               project: true,
  //             },
  //           },
  //           taskReport: {
  //             where: {
  //               date: {
  //                 equals: new Date(),
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   }));
  return (
    <>
      {session?.user?.role == "WORKER" || session?.user.role == "MANAGER" ? (
        <SupplyDashboard />
      ) : (
        <DemandDashboard />
      )}
    </>
    // <main className="flex flex-col gap-12 p-12 w-full">
    //   <div className="flex justify-between">
    //     <h1 className="text-4xl font-bold">
    //       {session?.user.name}님, 안녕하세요
    //     </h1>
    //     <form
    //       action={async () => {
    //         "use server";
    //         await signOut();
    //       }}
    //     >
    //       <Button variant="outline">로그 아웃</Button>
    //     </form>
    //   </div>
    //   <Separator />
    //   <p>{JSON.stringify(user)}</p>
    //   <div className="flex gap-4">
    //     <div className="border rounded-lg w-1/3 p-6 flex justify-between">
    //       <div>진행중인 프로젝트</div>
    //       <div className="pt-6 text-xl font-semibold">
    //         {new Set(user?.tasks?.map((task) => task.task.projectId)).size}
    //       </div>
    //     </div>
    //     <div className="border rounded-lg w-1/3 p-6 flex justify-between">
    //       <div>오늘 투입률</div>
    //       <div className="pt-6 text-xl font-semibold">
    //         {user?.tasks?.reduce((a, c) => a + c.inputRate, 0)}%
    //       </div>
    //     </div>
    //     <div className="border rounded-lg w-1/3 p-6 flex justify-between">
    //       <div>오늘 업무 난이도</div>
    //       <div className="pt-6 text-xl font-semibold">3</div>
    //     </div>
    //   </div>
    //   {(session?.user.role == "ADMIN" || session?.user.role == "WORKER") && (
    //     <form className="flex flex-col gap-8" action={submitReport}>
    //       <div className="flex justify-between items-center">
    //         <h2 className="text-3xl font-semibold">오늘 작업</h2>
    //         <Button>보고 등룩</Button>
    //       </div>
    //       <Table>
    //         <TableHeader>
    //           <TableRow>
    //             <TableHead>작업 이름</TableHead>
    //             <TableHead>프로젝트 이름</TableHead>
    //             <TableHead>시작일</TableHead>
    //             <TableHead>종료일</TableHead>
    //             <TableHead>배정 투입률</TableHead>
    //             <TableHead className="w-[100px]">실제 투입률</TableHead>
    //             <TableHead>메모</TableHead>
    //           </TableRow>
    //         </TableHeader>
    //         <TableBody>
    //           {!user?.tasks?.some((task) => task.taskReport.length) ? (
    //             user?.tasks?.map((task, i) => (
    //               <TableRow key={i}>
    //                 <TableCell className="font-medium">
    //                   {task.task.name}
    //                 </TableCell>
    //                 <TableCell>{task.task.project.name}</TableCell>
    //                 <TableCell>
    //                   {task.startDate?.toLocaleDateString()}
    //                 </TableCell>
    //                 <TableCell>{task.endDate?.toLocaleDateString()}</TableCell>
    //                 <TableCell>{task.inputRate}%</TableCell>
    //                 <TableCell className="flex items-center gap-2">
    //                   <Input name="todayInputRate" required />%
    //                 </TableCell>
    //                 <TableCell>
    //                   <Input name="message" />
    //                 </TableCell>
    //                 <input type="hidden" name="userId" value={task.userId} />
    //                 <input type="hidden" name="taskId" value={task.id} />
    //               </TableRow>
    //             ))
    //           ) : (
    //             <TableRow className="text-gray-400 p-4">
    //               <TableCell>보고가 등록되었습니다.</TableCell>
    //             </TableRow>
    //           )}
    //         </TableBody>
    //       </Table>
    //     </form>
    //   )}
    //   {session?.user.role == "ADMIN" && (
    //     <section className="flex flex-col gap-8">
    //       <h2 className="text-3xl font-semibold">오늘 진행중인 프로젝트</h2>
    //       <Table>
    //         <TableHeader>
    //           <TableRow>
    //             <TableHead className="w-[100px]">프로젝트</TableHead>
    //             <TableHead>상태</TableHead>
    //             <TableHead>담당 디자이너</TableHead>
    //             <TableHead>시작일</TableHead>
    //             <TableHead>종료일</TableHead>
    //             <TableHead>진척률</TableHead>
    //             <TableHead>난이도</TableHead>
    //             <TableHead>고객</TableHead>
    //           </TableRow>
    //         </TableHeader>
    //         <TableBody>
    //           <TableRow>
    //             <TableCell>Project name</TableCell>
    //             <TableCell>2024.06.08</TableCell>
    //             <TableCell>40%</TableCell>
    //             <TableCell>50%</TableCell>
    //             <TableCell>메모</TableCell>
    //             <TableCell>상</TableCell>
    //             <TableCell>(그룹 관리자)</TableCell>
    //           </TableRow>
    //           <TableRow>
    //             <TableCell>Project name</TableCell>
    //             <TableCell>2024.06.08</TableCell>
    //             <TableCell>40%</TableCell>
    //             <TableCell>50%</TableCell>
    //             <TableCell>메모</TableCell>
    //             <TableCell>상</TableCell>
    //             <TableCell>(그룹 관리자)</TableCell>
    //           </TableRow>
    //         </TableBody>
    //       </Table>
    //     </section>
    //   )}
    //   {/* <p>{JSON.stringify(session)}</p> */}
    // </main>
  );
}
