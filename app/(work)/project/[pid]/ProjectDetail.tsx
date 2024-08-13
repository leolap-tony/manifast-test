"use client";

import Chips from "@/components/elements/Chips";
import KeyValueLabel from "@/components/elements/KeyValueLabel";
import UserAvatar from "@/components/elements/UserAvatar";
import UserArray from "@/components/UserArray";
import { getUniqueWorkers } from "@/lib/getUniqueWorkers";
import { TaskWithWorkers } from "@/types/queryInterface";
import { Group, Project, Task, User } from "@prisma/client";
import React from "react";

export default function ProjectDetail({
  project,
}: {
  project: Project & {
    tasks: Task[];
    group: Group & { manager: User; owner: User };
  };
}) {
  const uniqueWorkers = getUniqueWorkers(project?.tasks as TaskWithWorkers[]);
  return (
    <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-background-light">
      <KeyValueLabel direction="row" label="전담 PM" labelWidth={86}>
        <UserAvatar size="md" user={project?.group.manager as User} label />
      </KeyValueLabel>
      <KeyValueLabel direction="row" label="그룹" labelWidth={86}>
        {project?.group.name}
      </KeyValueLabel>
      <KeyValueLabel direction="row" label="종류" labelWidth={86}>
        {project?.projectTemplateName}
      </KeyValueLabel>
      <KeyValueLabel direction="row" label="작업자" labelWidth={86}>
        <UserArray users={uniqueWorkers} orientation="row" maxAmount={3} />
      </KeyValueLabel>
      <KeyValueLabel direction="row" label="그룹 관리자" labelWidth={86}>
        <UserAvatar size="md" user={project?.group.owner as User} label />
      </KeyValueLabel>
      <KeyValueLabel direction="row" label="상태" labelWidth={86}>
        <Chips type="status" value={project?.status as string} />
      </KeyValueLabel>
    </div>
  );
}
