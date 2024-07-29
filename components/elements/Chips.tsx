import { ProjectStatus } from "@prisma/client";

type ChipsProps =
  | { type: "status"; value: ProjectStatus }
  | { type: "difficulty"; value: number };

export default function Chips({ type, value }: ChipsProps) {
  let label = "";
  let token = "";

  switch (type) {
    case "status":
      switch (value) {
        case "REQUEST":
          label = "요청됨";
          token = "bg-green-200";
          break;
        case "STANDBY":
          label = "시작전";
          token = "bg-gray-200";
          break;
        case "LIVE":
          label = "진행중";
          token = "bg-yellow-200";
          break;
        case "COMPLETE":
          label = "완료";
          token = "bg-blue-200";
          break;
        case "STOP":
          label = "중단";
          token = "bg-yellow-200";
          break;
        case "CANCEL":
          label = "취소";
          token = "bg-red-200";
          break;
        default:
          label = "ERR!";
          token = "bg-yellow-200";
      }
      break;

    case "difficulty":
      switch (value) {
        case 1:
          label = "하";
          token = "bg-gray-200";
          break;
        case 2:
          label = "중";
          token = "bg-gray-500";
          break;
        case 3:
          label = "상";
          token = "bg-black text-white";
          break;
        default:
          label = "ERR!";
      }
      break;

    default:
      label = "Unknown Type";
  }

  return (
    <div className={`px-2.5 py-1 rounded-full w-fit h-fit ${token}`}>
      <span>{label}</span>
    </div>
  );
}
