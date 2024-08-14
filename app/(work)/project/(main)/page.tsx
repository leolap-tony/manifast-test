import React, { Suspense } from "react";

import { auth } from "@/auth";
import prisma from "@/db";
import MyProjectsTable from "@/components/tables/MyProjectsTable";
import { getAllMyProject } from "../actions";

export default async function page() {
  const project = await getAllMyProject();
  return (
    <section className="page-section">
      <div className="p-6">
        <MyProjectsTable projects={project as any} />
      </div>
    </section>
  );
}
