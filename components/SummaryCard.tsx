import React from "react";
import { Separator } from "./ui/separator";

type CardProps =
  | {
      type: "project";
      value: number;
    }
  | { type: "inputRate" | "difficulty"; value: [number, number] };

export default function SummaryCard({ type, value }: CardProps) {
  let label = "";
  switch (type) {
    case "project":
      label = "진행 중인 프로젝트";
      break;
    case "inputRate":
      label = "오늘 투입률";
      break;
    case "difficulty":
      label = "오늘 업무 난이도";
      break;
    default:
      label = "에러";
  }

  const ProjectType = ({ value }: { value: number }) => {
    return (
      <div className="text-right text-title-md text-text-title">{value}</div>
    );
  };

  const InputRateType = ({ value }: { value: [number, number] }) => {
    return (
      <div className="flex flex-row items-center gap-2 text-body-sm-n text-text-body">
        <div className="flex flex-row items-center gap-1">
          <div>배정</div>
          <div className="text-right text-title-md text-text-title">
            {value[0]}
          </div>
          <div>%</div>
        </div>
        {value[1] ? (
          <>
            <Separator className="h-3" orientation="vertical" />
            <div className="flex flex-row items-center gap-1">
              <div>실제</div>
              <div className="text-right text-title-md text-text-title">
                {value[1]}
              </div>
              <div>%</div>
            </div>
          </>
        ) : null}
      </div>
    );
  };

  const DifficultyType = ({ value }: { value: [number, number] }) => {
    const difficultyRate = value[0] / value[1];
    let icon = "";

    if (difficultyRate <= 0.74) {
      icon = "😎";
    } else if (difficultyRate <= 1.0) {
      icon = "🙂";
    } else if (difficultyRate <= 1.24) {
      icon = "😵‍💫";
    } else if (difficultyRate <= 1.49) {
      icon = "😵";
    } else if (1.5 <= difficultyRate) {
      icon = "☠️";
    } else {
      icon = "🤔";
    }
    return (
      <div className="flex flex-row items-baseline gap-4">
        <div className="text-right text-body-sm-n text-text-body">{`${value[0]} / ${value[1]}`}</div>
        <div className="text-3xl">{icon}</div>
      </div>
    );
  };

  return (
    <div className="relative w-full h-20 border rounded-lg text-body-md-m text-text-sub">
      <div className="absolute left-4 top-4 text-left">{label}</div>
      <div className="absolute right-4 bottom-4">
        {type === "project" && <ProjectType value={value as number} />}
        {type === "inputRate" && (
          <InputRateType value={value as [number, number]} />
        )}
        {type === "difficulty" && (
          <DifficultyType value={value as [number, number]} />
        )}
      </div>
    </div>
  );
}
