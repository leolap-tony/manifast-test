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
      REQUEST: "bg-[#E0F2FE]",
      STANDBY: "bg-background-gray",
      LIVE: "bg-[#FEF3C7]",
      COMPLETE: "bg-[#DCFCE7]",
      STOP: "bg-[#F3E8FF]",
      CANCEL: "bg-background-primary",
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
      case "REQUEST":
        label = "요청됨";
        break;
      case "STANDBY":
        label = "시작전";
        break;
      case "LIVE":
        label = "진행중";
        break;
      case "COMPLETE":
        label = "완료됨";
        break;
      case "STOP":
        label = "중단됨";
      case "CANCEL":
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
