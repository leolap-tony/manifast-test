import { auth } from "@/auth";
import React, { Suspense } from "react";
import Header from "@/components/navigation/Header";
import prisma from "@/db";
import MemberTable from "@/components/tables/MemberTable";
import { Project, Task, User } from "@prisma/client";
import { endOfToday, startOfToday } from "date-fns";
import { getMyMemberWorkLoads } from "./actions";

export default async function page() {
  const data = await getMyMemberWorkLoads();

  return (
    <section className="page-section">
      <div className="p-6">
        <MemberTable members={data?.group?.members as any} />
      </div>
    </section>
  );
}
