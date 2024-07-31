import { Group, Project, Task, TaskWorker, User } from "@prisma/client";
// TaskWithWorkers는 Task와 TaskWorkerWithWorker 배열을 포함합니다.

export interface GroupWithProjects extends Group {
  projects: ProjectWithTasks[];
}
export interface ProjectWithTasks extends Project {
  group: Pick<Group, "name">;
  tasks: TaskWithWorkers[];
}

export interface TaskWithWorkers extends Task {
  workers: TaskWorkerWithWorker[];
}

// TaskWorkerWithWorker는 TaskWorker와 User를 포함합니다.
export interface TaskWorkerWithWorker extends TaskWorker {
  worker: User;
}
