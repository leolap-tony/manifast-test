import { Task, TaskWorker, User } from "@prisma/client";

// TaskWithWorkers는 Task와 TaskWorkerWithWorker 배열을 포함합니다.
export interface TaskWithWorkers extends Task {
  workers: TaskWorkerWithWorker[];
}

// TaskWorkerWithWorker는 TaskWorker와 User를 포함합니다.
interface TaskWorkerWithWorker extends TaskWorker {
  worker: User;
}

// 주어진 TaskWithWorkers 배열에서 유일한 작업자(User) 배열을 반환합니다.
export function getUniqueWorkers(tasks: TaskWithWorkers[]): User[] {
  // 모든 Task에서 작업자 추출
  const workers = tasks.flatMap((task) =>
    task.workers.map((taskWorker) => taskWorker.worker)
  );

  // 중복 제거를 위한 Set 사용
  const uniqueWorkers = new Set(workers);

  // Set을 배열로 변환하여 반환
  return Array.from(uniqueWorkers);
}
