import { ProjectStatus } from "@prisma/client";

export const getDifficultyIcon = (difficultyRate: number) => {
  if (difficultyRate <= 0.74) {
    return "😎";
  } else if (difficultyRate <= 1.0) {
    return "🙂";
  } else if (difficultyRate <= 1.24) {
    return "😵‍💫";
  } else if (difficultyRate <= 1.49) {
    return "😵";
  } else if (1.5 <= difficultyRate) {
    return "☠️";
  } else {
    return "🤔";
  }
};

export const statusToString = (status: ProjectStatus | null) => {
  switch (status) {
    case "REQUEST":
      return "요청됨";
    case "STANDBY":
      return "시작전";
    case "LIVE":
      return "진행중";
    case "COMPLETE":
      return "완료";
    case "STOP":
      return "중단";
    case "CANCEL":
      return "취소";
    default:
      return "에러!";
  }
};
