import prisma from "@/db";
import React from "react";
import { getProject } from "../../actions";
import TaskWbsTable from "@/components/tables/TaskWbsTable";
import { TaskWithWorkers } from "@/types/queryInterface";

export default async function wbs({ params }: { params: { pid: string } }) {
  const project = await getProject(params.pid);
  return (
    <section className="page-contents">
      <div className="p-6">
        <TaskWbsTable tasks={project?.tasks as TaskWithWorkers[]} />
      </div>
    </section>
  );
}
