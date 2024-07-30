// 'use client'
import { auth } from "@/auth";
import React from "react";
import Header from "@/components/navigation/Header";
import { getProjectInfo } from "../project/actions";
// import { createReport, getReports } from "./actions";

export default async function page() {
  const session = await auth();
  // const reports = await getReports();
  return (
    <main className="page-contents">
      <Header type="dashboard" />
      <section className="page-section">
        <p>{JSON.stringify(session)}</p>
        <p>test page for dashboard</p>
        {/* <button onClick={()=>createReport()}>create Report</button> */}
      </section>
    </main>
  );
}
