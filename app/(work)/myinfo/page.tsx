import React from "react";

import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import prisma from "@/db";

import { Separator } from "@/components/ui/separator";
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

const page = async () => {
  const session = await auth();
  const user =
    session &&
    (await prisma.user.findUnique({
      where: {
        id: session.user.sub,
        // email:session.user.email as string
      },
      include: {
        group: {
          include: {
            members: true,
          },
        },
      },
    }));
  return (
    <div className="w-full flex flex-col gap-8 p-12">
      <h1 className="text-4xl font-bold">내정보</h1>
      <Tabs defaultValue="myinfo" className="">
        <TabsList>
          <TabsTrigger value="myinfo">내 정보</TabsTrigger>
          <TabsTrigger value="groupinfo">내 그룹 정보</TabsTrigger>
        </TabsList>
        <TabsContent value="myinfo">
          <div className="flex flex-col gap-10 w-full p-4">
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold">{user?.name}</h1>
              <div className="flex gap-4">
                <span className="w-36 font-semibold">이메일</span>
                <span className="font-light">{user?.email}</span>
              </div>
              <div className="flex gap-4">
                <span className="w-36 font-semibold">연락처</span>
                <span className="font-light">{user?.phone}</span>
              </div>
              <div className="flex gap-4">
                <span className="w-36 font-semibold">가입일</span>
                <span className="font-light">
                  {JSON.stringify(user?.createdAt)}
                </span>
              </div>
              <div className="flex gap-4">
                <span className="w-36 font-semibold">직무</span>
                <span className="font-light">{user?.job}</span>
              </div>
              <div className="flex gap-4">
                <span className="w-36 font-semibold">권한</span>
                <span className="font-light">{user?.role}</span>
              </div>
              <div className="flex gap-4">
                <span className="w-36 font-semibold">역활</span>
                <span className="font-light">{user?.email}</span>
              </div>
              <div className="flex gap-4">
                <span className="w-36 font-semibold">이미지</span>
                {user?.image && (
                  <Image
                    src={user.image}
                    alt="profile"
                    height={32}
                    width={32}
                    className="rounded-full"
                  />
                )}
              </div>
            </div>

            <Button variant="outline" asChild className="w-20">
              <Link href="/myinfo/update">수정</Link>
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="groupinfo">
          <div className="flex flex-col gap-10 w-full p-4">
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold">{user?.group?.name}</h1>
              <div className="flex gap-4">
                <span className="w-36 font-semibold">그룹 관리자</span>
                <span className="font-light">{user?.group?.ceo}</span>
              </div>
              <div className="flex gap-4">
                <span className="w-36 font-semibold">그룹 이메일</span>
                <span className="font-light">{user?.group?.email}</span>
              </div>
              <div className="flex gap-4">
                <span className="w-36 font-semibold">그룹 연락처</span>
                <span className="font-light">{user?.group?.phone}</span>
              </div>
              <div className="flex gap-4">
                <span className="w-36 font-semibold">생성일</span>
                <span className="font-light">
                  {JSON.stringify(user?.group?.createdAt)}
                </span>
              </div>
              <div className="flex gap-4">
                <span className="w-36 font-semibold">그룹ID</span>
                <span className="font-light">{user?.group?.id}</span>
              </div>
              <div className="flex gap-4">
                <span className="w-36 font-semibold">플랜</span>
                <span className="font-light">프로 플랜</span>
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-semibold">멤버 정보</h1>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">멤버</TableHead>
                    <TableHead className="w-[200px]">이메일</TableHead>
                    <TableHead className="w-[200px]">권한</TableHead>
                    <TableHead className="w-[200px]">역할</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user?.group &&
                    user.group?.members.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell>{member.name}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>{member.role}</TableCell>
                        <TableCell>{member.job}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-semibold">비즈니스 정보</h1>
              <div className="flex gap-4">
                <span className="w-36 font-semibold">상호명</span>
                <span className="font-light">{user?.group?.name}</span>
              </div>
              <div className="flex gap-4">
                <span className="w-36 font-semibold">대표자명</span>
                <span className="font-light">{user?.group?.ceo}</span>
              </div>
              <div className="flex gap-4">
                <span className="w-36 font-semibold">사업자등록번호</span>
                <span className="font-light">
                  {user?.group?.businessNumber}
                </span>
              </div>
              <div className="flex gap-4">
                <span className="w-36 font-semibold">주소</span>
                <span className="font-light">{user?.group?.address}</span>
              </div>
              <div className="flex gap-4">
                <span className="w-36 font-semibold">규모</span>
                <span className="font-light">스타트업</span>
              </div>
              <div className="flex gap-4">
                <span className="w-36 font-semibold">사업 카테고리</span>
                <span className="font-light">디자인, 소프트웨어</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
