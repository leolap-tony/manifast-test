import Header from "@/components/navigation/Header";
import prisma from "@/db";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/elements/Tabs";
import { Suspense } from "react";
export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="page-layout">
      <Header type="page" title="멤버" />
      <Suspense>{children}</Suspense>
    </main>
  );
}
