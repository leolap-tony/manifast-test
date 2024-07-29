"use client";

import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// KeyValueLabelProps 인터페이스 정의
interface KeyValueLabelProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof labelVariants> {
  direction: "vertical" | "horizontal"; // 방향 (수직 또는 수평)
  label: string; // 라벨 텍스트
  hint?: string; // 힌트 텍스트
  children: React.ReactNode; // 라벨에 대응하는 값 또는 콘텐츠
  labelWidth?: number; // 라벨의 가로 길이 (숫자)
}

// labelVariants 상수 정의
const labelVariants = cva("w-full h-fit flex", {
  variants: {
    direction: {
      vertical: "flex-col gap-2", // 수직 레이아웃
      horizontal: "flex-row items-center gap-3", // 수평 레이아웃
    },
  },
  defaultVariants: {
    direction: "vertical", // 기본 레이아웃 방향은 수직
  },
});

const labelStyleVariants = cva(
  "overflow-hidden whitespace-nowrap text-ellipsis flex-shrink-0 text-text-title text-body-md-m",
  {
    variants: {
      direction: {
        vertical: "w-full",
        horizontal: "", // 가로 레이아웃일 경우 max-width를 동적으로 설정
      },
    },
    defaultVariants: {
      direction: "vertical",
    },
  }
);

// KeyValueLabel 컴포넌트 정의
export default function KeyValueLabel({
  className,
  direction = "vertical", // 기본 값 설정
  label,
  children,
  hint,
  labelWidth, // 숫자 값으로 가로 길이 설정
  ...props
}: KeyValueLabelProps) {
  const labelStyle = labelWidth
    ? { width: `${labelWidth}px` }
    : direction === "horizontal"
      ? { width: "104px" }
      : {};

  return (
    <div className={cn(labelVariants({ direction }), className)} {...props}>
      <span
        className={cn(labelStyleVariants({ direction }))}
        style={labelStyle}
      >
        {label}
      </span>
      <div className="w-full text-text-body text-body-md-n">{children}</div>
      {direction === "vertical" && hint && <div>{hint}</div>}
    </div>
  );
}
