import { Project, Task } from "@prisma/client";
import React from "react";
import { Progress } from "./elements/Progress";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface ProjectProgressProps {
  project: Pick<
    Project,
    "status" | "request_startDate" | "request_endDate" | "startDate" | "endDate"
  > & { tasks: Task[] };
}

const calculateProgress = (tasks: Task[]): number => {
  const milestoneTasks = tasks.filter((task) => task.isMilestone);
  const completedMilestones = milestoneTasks.filter(
    (task) => task.isComplete
  ).length;
  return milestoneTasks.length > 0
    ? Math.round((completedMilestones / milestoneTasks.length) * 100)
    : 0;
};

export default function ProjectProgress({ project }: ProjectProgressProps) {
  const progress = calculateProgress(project.tasks);

  const startDate =
    project.status === "REQUESTED"
      ? project.request_startDate
      : project.startDate;

  const endDate =
    project.status === "REQUESTED" ? project.request_endDate : project.endDate;

  const isRequested = project.status === "REQUESTED";

  return (
    <div className="px-6 pt-4 pb-2.5 flex flex-col gap-2">
      <div className="flex justify-between items-baseline">
        <div className="flex flex-row items-baseline gap-2">
          <div className="text-title-lg text-text-title">{progress}%</div>
          <div className="text-body-sm-m text-text-sub">{project.status}</div>
        </div>
        <div className="flex flex-row gap-1 text-body-sm-m text-text-sub">
          <div>
            {startDate
              ? format(startDate, "yyyy년 MMMM do", { locale: ko })
              : "미정"}
          </div>
          <div>→</div>
          {endDate ? format(endDate, "yyyy년 MMMM do", { locale: ko }) : "미정"}
          <div>{isRequested && "(예정)"}</div>
        </div>
      </div>
      <Progress value={progress} className="h-2 [&>*]:bg-red-500" />
    </div>
  );
}
