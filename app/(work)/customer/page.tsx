import { Separator } from "@/components/ui/separator";
import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import prisma from "@/db";
import Link from "next/link";
import Header from "@/components/navigation/Header";
import UserAvatar from "@/components/elements/UserAvatar";

const page = async () => {
  const customers = await prisma.group.findMany({
    include: {
      manager: true,
      projects: true,
    },
  });
  return (
    <main className="page-contents">
      <Header type="page" title="고객" />
      <section className="page-section p-6">
        {/* <div>{JSON.stringify(customers)}</div> */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="">고객</TableHead>
              <TableHead>전담 PM</TableHead>
              <TableHead>플랜</TableHead>
              <TableHead>계약 시작일</TableHead>
              <TableHead>계약 종료일</TableHead>
              <TableHead>프로젝트 수</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">
                  <Link href={`/customer/${customer.id}`}>
                    [{customer.name}]
                  </Link>
                </TableCell>
                <TableCell>
                  {customer.manager ? (
                    <UserAvatar size="md" user={customer.manager} label />
                  ) : (
                    <span>[없음]</span>
                  )}
                </TableCell>
                <TableCell>베이직</TableCell>
                <TableCell>2024.06.08</TableCell>
                <TableCell>2024.06.08</TableCell>
                <TableCell>{customer.projects.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </main>
  );
};

export default page;
