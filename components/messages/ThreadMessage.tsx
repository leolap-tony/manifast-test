import { ProjectThread, ThreadType, User } from "@prisma/client";
import React from "react";
import UserAvatar from "../elements/UserAvatar";
import formatDistanceDate from "@/lib/formatDistanceDate";
import { cva } from "class-variance-authority";
import Icon from "../elements/Icon";

const threadCard = cva("relative w-full flex flex-col gap-2  pl-14 pr-5 py-3", {
  variants: {
    variant: {
      USER: "",
      SYSTEM: "bg-background-primary border border-primary rounded-md",
    }, // SYSTEM variant
  },
  defaultVariants: {
    variant: "USER",
  },
});

const threadNotice = cva("", {
  variants: {
    type: {
      REQUEST: "프로젝트가 요청되었습니다.",
      START: "프로젝트가 시작되었습니다.",
      STOP: "",
    },
  },
});

function ThreadNotice({ type }: { type: string }) {
  return (
    <div className="bg-background-gray border-l-2 border-foreground p-3 text-text text-title-sm">
      <span className="mr-3">🖍️</span>
      {threadNotice({ type: type })}
    </div>
  );
}

export default function ThreadMessage({
  thread,
}: {
  thread: ProjectThread & { author: Partial<User> };
}) {
  return (
    <div className={threadCard({ variant: thread.author ? "USER" : "SYSTEM" })}>
      {!thread.author ? (
        <div className="absolute left-5 top-3 flex flex-row gap-3">
          <Icon icon="mnfstsys" className="w-6 h-6 fill-primary" />
          <div className="text-title-sm text-text-title text-sm">
            시스템 메시지
          </div>
        </div>
      ) : (
        <div className="absolute left-0 top-0">
          <UserAvatar size="xl" user={thread.author} label />
        </div>
      )}

      <div className="flex flex-col gap-5">
        <div className="w-full text-right text-text-sub text-body-sm-n">
          <span>{formatDistanceDate(thread.createdAt)}</span>
        </div>
        <div className="w-full flex flex-col gap-3">
          {thread.type !== null ? (
            <ThreadNotice type={thread.type as string} />
          ) : null}
          <div className="w-full text-body-md-n text-text-body">
            {thread.message}
          </div>
        </div>
      </div>
    </div>
  );
}
