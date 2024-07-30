// 'use client'
import { auth } from "@/auth";
import React from "react";
import Header from "@/components/navigation/Header";
import { getProjectInfo } from "../project/actions";
import prisma from "@/db";

// import { createReport, getReports } from "./actions";

export default async function page() {
  const session = await auth();

  const offset = 1000 * 60 * 60 * 9;
  const koreaNow = new Date(new Date().getTime() + offset);
  const startOfToday = new Date(koreaNow.setHours(0, 0, 0, 0));
  const endOfToday = new Date(koreaNow.setHours(23, 59, 59, 999));

  return (
    <main className="page-contents">
      <Header type="dashboard" />
      <section className="page-section">
        <p>test page for dashboard</p>
        {/* <button onClick={()=>createReport()}>create Report</button> */}
      </section>
    </main>
  );
}
