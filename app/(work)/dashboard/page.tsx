// 'use client'
import { auth } from "@/auth";
import React, { Suspense } from "react";
import Header from "@/components/navigation/Header";

import { Skeleton } from "@/components/ui/skeleton";
import prisma from "@/db";
import ProjectDataPage from "./ProjectDataPage";
import TaskDataPage from "./TaskDataPage";
import Summary from "./Summary";

// import { createReport, getReports } from "./actions";

export default async function page() {
  const session = await auth();

  return (
    <section className="page-section">
      <Suspense
        fallback={
          <div className=" w-full grid grid-cols-3 gap-4 p-6">
            <Skeleton className="w-full h-20 rounded-md" />
            <Skeleton className="w-full h-20 rounded-md" />
            <Skeleton className="w-full h-20 rounded-md" />
          </div>
        }
      >
        <Summary />
      </Suspense>
      <Suspense
        fallback={
          <div className="w-full h-[200px] p-6">
            <Skeleton className="w-full h-full rounded-lg" />
          </div>
        }
      >
        <TaskDataPage />
      </Suspense>
      {session?.user.role !== "MEMBER" && (
        <Suspense
          fallback={
            <div className="w-full h-[200px] p-6">
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
          }
        >
          <ProjectDataPage />
        </Suspense>
      )}
    </section>
  );
}
