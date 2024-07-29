"use client";
import React from "react";
import UserAvatar from "../elements/UserAvatar";
import { useSession } from "next-auth/react";

interface HeaderProps {
  type: "Dashboard" | "ProjectDetail" | "Default";
  title?: string;
  children?: React.ReactNode;
}

export default function Header({ type, title, children }: HeaderProps) {
  const session = useSession().data;
  const user = session?.user;

  return (
    <header className="flex-shrink-0 w-full h-[92px] pt-8 pb-5 px-6 border-b">
      <div className="h-full flex flex-row items-center justify-between">
        {type === "Dashboard" ? (
          <div className="flex flex-row items-center text-title-lg">
            <UserAvatar user={user as any} size="lg" label />
            님, 안녕하세요.
          </div>
        ) : (
          <div className="flex flex-row items-center justify-between gap-3">
            <h1 className="text-title-lg">{title}</h1>
            {type === "ProjectDetail" && (
              <div className="border p-1 px-2 rounded-[4px] text-body-md-m">
                D-00
              </div>
            )}
          </div>
        )}
        <div className="flex flex-row items-center justify-between gap-3">
          {children}
        </div>
      </div>
    </header>
  );
}
