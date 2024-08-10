import React from "react";

import Header from "@/components/navigation/Header";
import prisma from "@/db";
import ProjectRequestForm from "./ProjectRequestForm";

export default async function Page() {
  const template = await prisma.projectTemplate.findMany({
    include: { taskTemplate: true },
  });

  return (
    <main className="page-contents">
      <Header type="page" title="프로젝트 요청" />
      <section className="page-section">
        {<ProjectRequestForm templates={template as any} />}
      </section>
    </main>
  );
}
