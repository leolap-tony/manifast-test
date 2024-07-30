import React from "react";
import { ProjectStatus } from "@prisma/client";
import { cva, type VariantProps } from "class-variance-authority";

type ChipsProps =
  | { type: "status"; value: string | null }
  | { type: "difficulty" | "remaining"; value: number };

const chipStyles = cva("px-2 py-1  w-fit h-fit", {
  variants: {
    type: {
      status: "rounded-full text-body-sm-m",
      difficulty: "rounded-md text-body-sm-m",
      remaining: "rounded-[4px] text-body-sm-m",
    },
    status: {
      REQUESTED: "bg-green-200",
      STARTED: "bg-gray-200",
      COMPLETED: "bg-blue-200",
      STOPPED: "bg-yellow-200",
      CANCELED: "bg-red-200",
    },
    difficulty: {
      1: "bg-primary/30",
      2: "bg-primary/50",
      3: "bg-primary/70",
    },
  },
  compoundVariants: [],
  defaultVariants: {
    type: "status",
  },
});

export default function Chips({ type, value }: ChipsProps) {
  let label = "";

  if (type === "status") {
    switch (value) {
      case "REQUESTED":
        label = "요청됨";
        break;
      case "STARTED":
        label = "시작됨";
        break;
      case "COMPLETED":
        label = "완료됨";
        break;
      case "STOPPED":
        label = "중단됨";
        break;
      case "CANCELED":
        label = "취소됨";
        break;
      default:
        label = "ERR!";
    }
  } else if (type === "difficulty") {
    switch (value) {
      case 1:
        label = "하";
        break;
      case 2:
        label = "중";
        break;
      case 3:
        label = "상";
        break;
      default:
        label = "ERR!";
    }
  } else if (type === "remaining") {
    label = `D-${value}`;
  } else {
    label = "Unknown Type";
  }

  return (
    <div className={chipStyles({ type, [type]: value })}>
      <span>{label}</span>
    </div>
  );
}
