import { ProjectThread, User } from "@prisma/client";
import React from "react";
import { Separator } from "./ui/separator";
import UserAvatar from "./elements/UserAvatar";
import formatDistanceDate from "@/lib/formatDistanceDate";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface ThreadDailyListProps {
  date: string;
  threads: Array<ProjectThread & { author: User }>;
}

function ThreadMessage({
  thread,
}: {
  thread: ProjectThread & { author: User };
}) {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex flex-row justify-between items-center pr-5">
        <UserAvatar size="xl" user={thread.author} label />
        <div className="text-body-sm-n text-text-sub">
          {formatDistanceDate(thread.createdAt)}
        </div>
      </div>
      <div className="pl-14 pr-5 pb-3 text-body-md-n text-text-body">
        {thread.message}
      </div>
    </div>
  );
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
