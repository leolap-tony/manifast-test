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
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="page-layout">
      <Header type="dashboard" />
      {children}
    </main>
  );
}
