import { TaskWithWorkers } from "@/types/queryInterface";
import { User } from "@prisma/client";

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
