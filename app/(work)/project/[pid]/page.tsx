import React, { Suspense } from "react";
import { auth } from "@/auth";
import Link from "next/link";

import { Button } from "@/components/elements/Button";

import Header from "@/components/navigation/Header";

import ProjectProgress from "@/components/ProjectProgress";

import ProjectDetail from "./ProjectDetail";
import { getProject } from "../actions";
import Chips from "@/components/elements/Chips";
import { differenceInDays, format } from "date-fns";
import { ko } from "date-fns/locale";

export default async function page({ params }: { params: { pid: string } }) {
  const session = await auth();
  const project = await getProject(params.pid);

  return (
    <>
      <Header
        type="projectdetail"
        title={project?.name}
        projectDetailComponent={
          project?.endDate && (
            <Chips
              type="remaining"
              value={differenceInDays(project?.endDate, new Date())}
            />
          )
        }
      >
        {project?.managerId === session?.user.sub && (
          <Button>
            <Link href={`/project/update?pid=${params.pid}`}>
              {project?.status === "REQUEST"
                ? "프로젝트 검토하기"
                : "프로젝트 수정하기"}
            </Link>
          </Button>
        )}
      </Header>
      <ProjectDetail project={project as any} />
      <ProjectProgress project={project as any} />
    </>
  );
}
