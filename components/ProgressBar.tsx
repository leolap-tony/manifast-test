import React from "react";
import { Progress } from "./elements/Progress";
import { cva } from "class-variance-authority";

// 컴포넌트에 대한 CVA 정의
const progressIndicatorClasses = cva(
  "flex flex-row items-center gap-1", // 기본 스타일
  {
    variants: {
      size: {
        lg: "", // 기본 스타일 (추가 스타일 없음)
        sm: "text-body-md-n", // sm 사이즈일 때 적용할 스타일
      },
    },
    defaultVariants: {
      size: "lg",
    },
  }
);

// Progress 컴포넌트의 스타일을 CVA로 정의
const progressClasses = cva("", {
  variants: {
    size: {
      lg: "h-4 w-full", // lg 사이즈일 때의 Progress 스타일
      sm: "h-1 w-full", // sm 사이즈일 때의 Progress 스타일
    },
  },
  defaultVariants: {
    size: "lg",
  },
});

export default function ProgressBar({
  value,
  size = "lg",
}: {
  value: number;
  size: "sm" | "lg";
}) {
  return (
    <div className={progressIndicatorClasses({ size })}>
      {size === "sm" && <div>{value}%</div>}
      <Progress className={progressClasses({ size })} value={value} />
    </div>
  );
}
