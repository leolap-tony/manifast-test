// 'use client'
import { auth } from "@/auth";
import React from "react";
import { getProjectInfo } from "../project/actions";
// import { createReport, getReports } from "./actions";

const page = async () => {
  const session = await auth();
  // const reports = await getReports();
  return (
    <div className="flex flex-col gap-4 h-screen">
      <h1>dashboard</h1>
      <p>{JSON.stringify(session)}</p>
      {/* <p>{JSON.stringify(reports)}</p> */}
      <p>test page for dashboard</p>
      {/* <button onClick={()=>createReport()}>create Report</button> */}
    </div>
  );
};

export default page;
