import { Authority, ProjectStatus, Role } from "@prisma/client";

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

export const statusToKorean = (status: ProjectStatus | null) => {
  switch (status) {
    case "REQUEST":
      return "요청됨";
    case "STANDBY":
      return "시작전";
    case "LIVE":
      return "진행중";
    case "COMPLETE":
      return "완료됨";
    case "STOP":
      return "중단됨";
    case "CANCEL":
      return "취소됨";
    default:
      return "에러!";
  }
};

export const roleAndAuthorityToKorean = (value: Authority | Role) => {
  switch (value) {
    case "OWNER":
      return "대표관리자";
    case "ADMIN":
      return "관리자";
    case "MEMBER":
      return "멤버";
    case "MANAGER":
      return "PM";
    case "WORKER":
      return "작업자";
    default:
      return "에러!";
  }
};
