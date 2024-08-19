import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/elements/Tabs";
import { Suspense } from "react";

import ThreadChatInput from "@/components/messages/ThreadChatInput";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/auth";
import prisma from "@/db";

export default function layout({
  children,
  wbs,
  thread,
  params,
}: Readonly<{
  children: React.ReactNode;
  thread: React.ReactNode;
  wbs: React.ReactNode;
  params: {
    pid: string;
  };
}>) {
  return (
    <main className="page-layout">
      <Suspense>{children}</Suspense>
      <Tabs defaultValue="thread">
        <TabsList>
          <TabsTrigger value="thread">스레드</TabsTrigger>
          <TabsTrigger value="wbs">WBS</TabsTrigger>
        </TabsList>
        <TabsContent value="thread" className="flex flex-col gap-4">
          <ThreadChatInput projectId={params.pid} />
          <Separator />
          <Suspense>{thread}</Suspense>
        </TabsContent>
        <TabsContent value="wbs">{wbs}</TabsContent>
      </Tabs>
    </main>
  );
}
