import React from "react";
import Header from "./navigation/Header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { ProjectWithTasks } from "@/types/queryInterface";
import Chips from "./elements/Chips";
import { getUniqueWorkers } from "@/lib/getUniqueWorkers";
import UserArray from "./UserArray";

export default function DailyProjectTable({
  projects,
}: {
  projects: ProjectWithTasks[];
}) {
  return (
    <div className="w-full">
      <Header type="section" title="오늘 진행 중인 프로젝트" />
      <div className="px-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>프로젝트</TableHead>
              <TableHead>상태</TableHead>
              <TableHead>작업자</TableHead>
              <TableHead>시작일</TableHead>
              <TableHead>종료일</TableHead>
              <TableHead>진척률</TableHead>
              <TableHead>고객</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project, idx) => {
              const workers = getUniqueWorkers(project.tasks);
              return (
                <TableRow key={idx}>
                  <TableCell>
                    <div className="w-full flex flex-row gap-2 items-center">
                      <div>{project.name}</div>
                      <Chips type="difficulty" value={project.difficulty} />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chips type="status" value={project.status} />
                  </TableCell>
                  <TableCell>
                    <div className="w-full">
                      <UserArray
                        users={workers}
                        maxAmount={2}
                        orientation="col"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    {project.startDate?.toLocaleDateString()}
                  </TableCell>
                  <TableCell>{project.endDate?.toLocaleDateString()}</TableCell>
                  <TableCell>진척률</TableCell>
                  <TableCell>{project.group.name}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
