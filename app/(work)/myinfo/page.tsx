import React from "react";

import { auth } from "@/auth";
import prisma from "@/db";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/elements/Tabs";

import Header from "@/components/navigation/Header";

import MyInformation from "@/components/MyInformation";
import { User } from "@prisma/client";
import MyGroupInformation from "@/components/MyGroupInformation";

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
            <MyInformation user={user as User} />
          </TabsContent>
          <TabsContent value="groupinfo">
            <MyGroupInformation group={user?.group as any} />
          </TabsContent>
        </Tabs>
      </section>
    </main>
  );
}
