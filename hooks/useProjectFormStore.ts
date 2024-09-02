import {
  ProjectWithTasks,
  TaskWithWorkers,
  TaskWorkerWithWorker,
} from "@/types/queryInterface";
import { Project, ProjectStatus, Task } from "@prisma/client";
import { create } from "zustand";

interface ProjectFormAction {
  initData: (project: ProjectWithTasks) => void;
  setName: (name: string) => void;
  setDate: (isRequest: boolean, target: "start" | "end", date: Date) => void;
  setStatus: (status: ProjectStatus) => void;
  setMessage: (message: string) => void;
  setDifficulty: (difficulty: number) => void;
  addTask: (task: TaskWithWorkers) => void;
  removeTask: (index: number) => void;
  updateTask: (index: number, updatedTask: Partial<TaskWithWorkers>) => void;
  modifyTaskWorkers: (
    taskIndex: number,
    modifyWorkerFn: (workers: TaskWorkerWithWorker[]) => TaskWorkerWithWorker[],
  ) => void;
  addWorker: (taskIndex: number, worker: TaskWorkerWithWorker) => void;
  removeWorker: (taskIndex: number, workerIndex: number) => void;
  updateWorker: (
    taskIndex: number,
    workerIndex: number,
    updatedWorker: Partial<TaskWorkerWithWorker>,
  ) => void;
}

export const useFormStore = create<
  Partial<ProjectWithTasks> & ProjectFormAction
>()((set, get) => ({
  tasks: [],
  initData: (project: ProjectWithTasks) => set(project),

  setName: (name: string) => set({ name }),

  setDate: (isRequest: boolean, target: "start" | "end", date: Date) => {
    const key = isRequest
      ? target === "start"
        ? "request_startDate"
        : "request_endDate"
      : target === "start"
        ? "startDate"
        : "endDate";

    set({ [key]: date });
  },

  setStatus: (status: ProjectStatus) => set({ status }),

  setMessage: (message: string) => set({ message }),

  setDifficulty: (difficulty: number) => set({ difficulty }),

  addTask: (task: TaskWithWorkers) =>
    set((state) => ({
      tasks: [...(state.tasks || []), task],
    })),

  removeTask: (index: number) =>
    set((state) => ({
      tasks: state.tasks ? state.tasks.filter((_, i) => i !== index) : [],
    })),

  updateTask: (index: number, updatedTask: Partial<TaskWithWorkers>) =>
    set((state) => ({
      tasks: state.tasks
        ? state.tasks.map((task, i) =>
            i === index ? { ...task, ...updatedTask } : task,
          )
        : [],
    })),

  modifyTaskWorkers: (
    taskIndex: number,
    modifyWorkerFn: (workers: TaskWorkerWithWorker[]) => TaskWorkerWithWorker[],
  ) =>
    set((state) => ({
      tasks: state.tasks
        ? state.tasks.map((task, i) =>
            i === taskIndex
              ? { ...task, workers: modifyWorkerFn(task.workers || []) }
              : task,
          )
        : [],
    })),

  addWorker: (taskIndex: number, worker: TaskWorkerWithWorker) =>
    get().modifyTaskWorkers(taskIndex, (workers) => [...workers, worker]),

  removeWorker: (taskIndex: number, workerIndex: number) =>
    get().modifyTaskWorkers(taskIndex, (workers) =>
      workers.filter((_, j) => j !== workerIndex),
    ),

  updateWorker: (
    taskIndex: number,
    workerIndex: number,
    updatedWorker: Partial<TaskWorkerWithWorker>,
  ) =>
    get().modifyTaskWorkers(taskIndex, (workers) =>
      workers.map((worker, j) =>
        j === workerIndex ? { ...worker, ...updatedWorker } : worker,
      ),
    ),
}));
