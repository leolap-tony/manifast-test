import { Prisma, Group, Project, Task, TaskWorker, User } from "@prisma/client";
// TaskWithWorkers는 Task와 TaskWorkerWithWorker 배열을 포함합니다.

export interface GroupWithProjects extends Group {
  projects: ProjectWithTasks[];
}
export interface ProjectWithTasks extends Project {
  group?: Pick<Group, "name">;
  tasks: TaskWithWorkers[];
}

export interface TaskWithWorkers extends Task {
  workers: TaskWorkerWithWorker[];
}

// TaskWorkerWithWorker는 TaskWorker와 User를 포함합니다.
export interface TaskWorkerWithWorker extends TaskWorker {
  task?: Task;
  worker: User;
}

const taskWithWorkerAndReport = Prisma.validator<Prisma.TaskDefaultArgs>()({
  include: {
    workers: true,
    taskReport: true
  }
})

export type TaskWithWorkersAndReports = Prisma.TaskGetPayload<typeof taskWithWorkerAndReport>

const projectWithTaskReport = Prisma.validator<Prisma.ProjectDefaultArgs>()({
  include: {
    tasks: {
      include: { workers: true, taskReport: true }
    }
  }
})

export type ProjectWithTaskReport = Prisma.ProjectGetPayload<typeof projectWithTaskReport>
