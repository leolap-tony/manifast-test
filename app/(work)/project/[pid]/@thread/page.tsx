import React from "react";
import { getProjectThreads } from "../../actions";
import { ProjectThread, User } from "@prisma/client";
import ThreadDailyList from "@/components/messages/ThreadDailyList";

export default async function thread({ params }: { params: { pid: string } }) {
  const threads = await getProjectThreads(params.pid);

  const groupByDate = (threads: Array<ProjectThread & { author: User }>) => {
    return threads.reduce(
      (groups, thread) => {
        const date = thread.createdAt.toISOString().split("T")[0];
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(thread);
        return groups;
      },
      {} as { [key: string]: Array<ProjectThread & { author: User }> }
    );
  };
  let groupedThreads: {
    [key: string]: Array<ProjectThread & { author: User }>;
  } = {};

  if (threads && threads.length > 0) {
    groupedThreads = groupByDate(threads);
  }
  return (
    <section className="page-contents">
      <div className="w-full px-6 flex flex-col gap-6">
        {Object.entries(groupedThreads).map(([date, threads]) => (
          <ThreadDailyList key={date} date={date} threads={threads} />
        ))}
      </div>
    </section>
  );
}
