import { auth } from "@/auth";
import SummaryCard from "@/components/SummaryCard";
import React from "react";

export default async function Summary() {
  const session = await auth();

  const totalProject = projects.filter(
    (project) => project.status === "LIVE" || project.status === "REQUEST"
  ).length;

  console.log(totalProject, totalTask);

  return (
    <div className="grid grid-cols-3 gap-4 p-6">
      <SummaryCard type="project" value={totalProject} />
      <SummaryCard type="inputRate" value={[0, 0]} />
      <SummaryCard type="difficulty" value={[0, 0]} />
    </div>
  );
}
