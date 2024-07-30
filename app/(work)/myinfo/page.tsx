import React from "react";

import Link from "next/link";
import Image from "next/image";
import { auth } from "@/auth";
import prisma from "@/db";

import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/elements/Tabs";
import { Button } from "@/components/elements/Button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Header from "@/components/navigation/Header";
import KeyValueLabel from "@/components/elements/KeyValueLabel";
import UserAvatar from "@/components/elements/UserAvatar";

export default async function Page() {
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
    <main className="page-contents">
      <Header type="page" title="마이페이지" />
      <section className="page-section">
        <Tabs defaultValue="myinfo" className="">
          <TabsList>
            <TabsTrigger value="myinfo">내 정보</TabsTrigger>
            <TabsTrigger value="groupinfo">내 그룹 정보</TabsTrigger>
          </TabsList>
          <TabsContent value="myinfo">
            <Header type="section" title={user?.name as string}></Header>
            <div className="flex flex-col gap-10 w-full p-6">
              <ul className="flex flex-col gap-3">
                <h2 className="text-title-sm text-text-title">{user?.name}</h2>
                <li>
                  <KeyValueLabel
                    direction="horizontal"
                    label="이메일"
                    labelWidth={86}
                  >
                    {user?.email}
                  </KeyValueLabel>
                </li>
                <li>
                  <KeyValueLabel
                    direction="horizontal"
                    label="연락처"
                    labelWidth={86}
                  >
                    {user?.phone}
                  </KeyValueLabel>
                </li>
                <li>
                  <KeyValueLabel
                    direction="horizontal"
                    label="가입일"
                    labelWidth={86}
                  >
                    {user?.createdAt.toLocaleDateString()}
                  </KeyValueLabel>
                </li>
                <li>
                  <KeyValueLabel
                    direction="horizontal"
                    label="직무"
                    labelWidth={86}
                  >
                    {user?.job}
                  </KeyValueLabel>
                </li>
                <li>
                  <KeyValueLabel
                    direction="horizontal"
                    label="권한"
                    labelWidth={86}
                  >
                    authority
                  </KeyValueLabel>
                </li>
                <li>
                  <KeyValueLabel
                    direction="horizontal"
                    label="역할"
                    labelWidth={86}
                  >
                    {user?.role}
                  </KeyValueLabel>
                </li>
                <li>
                  <KeyValueLabel
                    direction="horizontal"
                    label="프로필 이미지"
                    labelWidth={86}
                  >
                    {user?.image && (
                      <Image
                        src={user.image}
                        alt="profile"
                        height={32}
                        width={32}
                        className="rounded-full"
                      />
                    )}
                  </KeyValueLabel>
                </li>
              </ul>

              <Button variant="outline" asChild className="w-fit">
                <Link href="/myinfo/update">수정</Link>
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="groupinfo">
            <div className="flex flex-col gap-10 w-full p-4">
              <ul className="flex flex-col gap-4">
                <h2 className="text-title-sm text-text-title">
                  {user?.group?.name}
                </h2>
                <li>
                  <KeyValueLabel
                    direction="horizontal"
                    label="그룹 관리자"
                    labelWidth={86}
                  >
                    {/*<UserAvatar size="md" user={user?.group?.owner}>*/}오너
                  </KeyValueLabel>
                </li>
                <li>
                  <KeyValueLabel
                    direction="horizontal"
                    label="그룹 이메일"
                    labelWidth={86}
                  >
                    {user?.group?.email}
                  </KeyValueLabel>
                </li>
                <li>
                  <KeyValueLabel
                    direction="horizontal"
                    label="그룹 연락처"
                    labelWidth={86}
                  >
                    {user?.group?.phone}
                  </KeyValueLabel>
                </li>
                <li>
                  <KeyValueLabel
                    direction="horizontal"
                    label="생성일"
                    labelWidth={86}
                  >
                    {user?.group?.createdAt.toLocaleDateString()}
                  </KeyValueLabel>
                </li>
                <li>
                  <KeyValueLabel
                    direction="horizontal"
                    label="그룹 ID"
                    labelWidth={86}
                  >
                    {user?.group?.id}
                  </KeyValueLabel>
                </li>
                <li>
                  <KeyValueLabel
                    direction="horizontal"
                    label="플랜"
                    labelWidth={86}
                  >
                    플랜
                  </KeyValueLabel>
                </li>
              </ul>

              <div>
                <h2 className="text-title-sm text-text-title">멤버 정보</h2>
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
                <h2 className="text-title-sm text-text-title">비즈니스 정보</h2>
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
      </section>
    </main>
  );
}
