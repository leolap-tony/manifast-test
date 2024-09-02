import { DailyTaskList } from "@/components/tables/DailyTaskReportTable";
import { TaskReport } from "@prisma/client";
import { report } from "process";
import { create } from "zustand";

interface TaskReportFormAction {
  setTaskReports: (data: Partial<TaskReport>[]) => void;
  updateTaskReports: (index: number, updated: Partial<TaskReport>) => void;
}

export const useReportStore = create<
  { taskReports: Partial<TaskReport>[] } & TaskReportFormAction
>()((set) => ({
  taskReports: [],
  setTaskReports: (data) => {
    set({ taskReports: data });
  },
  updateTaskReports: (index, updated) => {
    set((state) => ({
      taskReports: state.taskReports.map((report, i) =>
        i === index ? { ...report, ...updated } : report,
      ),
    }));
  },
}));
