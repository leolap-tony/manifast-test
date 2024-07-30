"use client";
import React from "react";
import UserAvatar from "../elements/UserAvatar";
import { useSession } from "next-auth/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface HeaderProps {
  type: "dashboard" | "projectdetail" | "page" | "section";
  title?: string;
  children?: React.ReactNode;
  projectDetailComponent?: React.ReactNode;
  sectionComponent?: React.ReactNode;
}

// headerVariants 상수 정의
const headerVariants = cva("flex-shrink-0 w-full", {
  variants: {
    type: {
      dashboard: "h-[92px] pt-8 pb-5 px-6 border-b",
      projectdetail: "h-[92px] pt-8 pb-5 px-6 border-b",
      page: "h-[92px] pt-8 pb-5 px-6 border-b",
      section: "h-fit py-2 px-6",
    },
  },
  defaultVariants: {
    type: "page",
  },
});

const headerContentVariants = cva(
  "h-full flex flex-row items-center justify-between",
  {
    variants: {
      type: {
        dashboard: "text-title-lg",
        projectdetail: "gap-3",
        page: "gap-3",
        section: "gap-3 h-10",
      },
    },
    defaultVariants: {
      type: "page",
    },
  }
);

const titleVariants = cva("text-title-lg", {
  variants: {
    type: {
      dashboard: "",
      projectdetail: "text-title-lg",
      page: "text-title-lg",
      section: "text-title-sm",
    },
  },
  defaultVariants: {
    type: "page",
  },
});

export default function Header({
  type,
  title,
  children,
  projectDetailComponent,
  sectionComponent,
}: HeaderProps) {
  const session = useSession().data;
  const user = session?.user;

  return (
    <header className={cn(headerVariants({ type }))}>
      <div className={cn(headerContentVariants({ type }))}>
        {type === "dashboard" ? (
          <div className="flex flex-row items-center">
            <UserAvatar user={user as any} size="lg" label />
            님, 안녕하세요.
          </div>
        ) : (
          <div className="flex flex-row items-center justify-between gap-3">
            <h1 className={cn(titleVariants({ type }))}>{title}</h1>
            {type === "projectdetail" && projectDetailComponent}
            {type === "section" && sectionComponent}
          </div>
        )}
        <div className="flex flex-row items-center gap-3">{children}</div>
      </div>
    </header>
  );
}
