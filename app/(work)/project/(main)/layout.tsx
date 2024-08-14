import Header from "@/components/navigation/Header";
import prisma from "@/db";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/elements/Tabs";
import { Suspense } from "react";
import { Button } from "@/components/elements/Button";
import Link from "next/link";
export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="page-layout">
      <Header type="page" title="프로젝트">
        <Button asChild>
          <Link href="/project/request">프로젝트 요청</Link>
        </Button>
      </Header>
      <Suspense>{children}</Suspense>
    </main>
  );
}
