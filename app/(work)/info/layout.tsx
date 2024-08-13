import Header from "@/components/navigation/Header";
import prisma from "@/db";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/elements/Tabs";
export default function layout({
  children,
  user,
  group,
}: Readonly<{
  user: React.ReactNode;
  group: React.ReactNode;
  children: React.ReactNode;
}>) {
  return (
    <main className="page-contents">
      <Header type="page" title="마이 페이지" />
      <Tabs defaultValue="myinfo" className="">
        <TabsList>
          <TabsTrigger value="myinfo">내 정보</TabsTrigger>
          <TabsTrigger value="groupinfo">내 그룹 정보</TabsTrigger>
        </TabsList>
        <TabsContent value="myinfo">{user}</TabsContent>
        <TabsContent value="groupinfo">{group}</TabsContent>
      </Tabs>
    </main>
  );
}
