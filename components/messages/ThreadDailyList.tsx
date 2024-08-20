import { ProjectThread, User } from "@prisma/client";
import React from "react";
import { Separator } from "../ui/separator";

import { format } from "date-fns";
import { ko } from "date-fns/locale";

import ThreadMessage from "./ThreadMessage";

interface ThreadDailyListProps {
  date: string;
  threads: Array<ProjectThread & { author: Partial<User> }>;
}

export default function ThreadDailyList({
  date,
  threads,
}: ThreadDailyListProps) {
  return (
    <div className="w-full">
      <div className="flex flex-row items-center gap-1 text-body-md-m text-text-title text-nowrap mb-6 box-border overflow-hidden">
        <div>{format(new Date(date), "PPP", { locale: ko })}</div>
        <div className="text-primary">({threads.length})</div>
        <Separator></Separator>
      </div>
      <div className="w-full flex flex-col gap-6">
        {threads.map((thread, index) => (
          <ThreadMessage key={index} thread={thread} />
        ))}
      </div>
    </div>
  );
}
