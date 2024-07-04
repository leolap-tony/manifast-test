interface Tasks {
  [key: string]: any;
  uiux: Task[];
  branding: Task[];
  landingpage: Task[];
  contents: Task[];
  print: Task[];
  ppt: Task[];
  ux: Task[];
  motiongraphic: Task[];
  rendering: Task[];
}
export interface Task {
  milestone: boolean;
  order: number;
  taskName: string;
  description: string;
  time: string;
}

export const TASKS: Tasks = {
  uiux: [
    {
      milestone: true,
      order: 1,
      taskName: "메뉴 구조도 작성",
      description: "",
      time: "2일",
    },
    {
      milestone: true,
      order: 1,
      taskName: "1차 컨셉 디자인",
      description: "",
      time: "1주",
    },
    {
      milestone: true,
      order: 1,
      taskName: "2차 상세 디자인",
      description: "",
      time: "2-3주",
    },
    {
      milestone: true,
      order: 1,
      taskName: "3차 최종 디자인",
      description: "",
      time: "1-2주",
    },
    {
      milestone: true,
      order: 1,
      taskName: "스토리보드 제작",
      description: "",
      time: "1-2주",
    },
  ],
  branding: [
    {
      milestone: true,
      order: 1,
      taskName: "브랜드 요구사항 인터뷰",
      description: "",
      time: "1일",
    },
    {
      milestone: true,
      order: 2,
      taskName: "디자인 전략",
      description: "",
      time: "1주",
    },
    {
      milestone: true,
      order: 3,
      taskName: "1차 컨셉 시안",
      description: "",
      time: "1주",
    },
    {
      milestone: true,
      order: 4,
      taskName: "2차 최종 시안",
      description: "",
      time: "1-2주",
    },
    {
      milestone: true,
      order: 5,
      taskName: "어플리케이션 제작",
      description: "",
      time: "1-2주",
    },
    {
      milestone: true,
      order: 6,
      taskName: "브랜드 가이드북",
      description: "",
      time: "2주",
    },
  ],
  landingpage: [
    {
      milestone: true,
      order: 1,
      taskName: "와이어프레임 확정",
      description: "",
      time: "2일",
    },
    {
      milestone: true,
      order: 2,
      taskName: "1차 컨셉 디자인",
      description: "",
      time: "1주",
    },
    {
      milestone: true,
      order: 3,
      taskName: "2차 최종 디자인",
      description: "",
      time: "1-2주",
    },
    {
      milestone: true,
      order: 4,
      taskName: "퍼블리싱 진행",
      description: "",
      time: "1-2주",
    },
    {
      milestone: true,
      order: 5,
      taskName: "스토리보드 제작",
      description: "",
      time: "1주",
    },
    {
      milestone: true,
      order: 6,
      taskName: "도메인-호스팅 연결",
      description: "",
      time: "1일",
    },
  ],
  contents: [
    {
      milestone: true,
      order: 1,
      taskName: "사전 조율",
      description: "",
      time: "1일",
    },
    {
      milestone: true,
      order: 2,
      taskName: "1차 컨셉 디자인",
      description: "",
      time: "1일",
    },
    {
      milestone: true,
      order: 3,
      taskName: "최종 디자인",
      description: "",
      time: "2일",
    },
    {
      milestone: true,
      order: 4,
      taskName: "디자인 수정",
      description: "",
      time: "1일",
    },
  ],
  print: [
    {
      milestone: true,
      order: 1,
      taskName: "사전 조율",
      description: "",
      time: "1일",
    },
    {
      milestone: true,
      order: 2,
      taskName: "1차 컨셉 디자인",
      description: "",
      time: "1일",
    },
    {
      milestone: true,
      order: 3,
      taskName: "최종 디자인",
      description: "",
      time: "1일",
    },
    {
      milestone: true,
      order: 4,
      taskName: "디자인 수정",
      description: "",
      time: "1일",
    },
  ],
  ppt: [
    {
      milestone: true,
      order: 1,
      taskName: "사전 조율",
      description: "",
      time: "1일",
    },
    {
      milestone: true,
      order: 2,
      taskName: "1차 컨셉 디자인",
      description: "",
      time: "2일",
    },
    {
      milestone: true,
      order: 3,
      taskName: "최종 디자인",
      description: "",
      time: "2일",
    },
    {
      milestone: true,
      order: 4,
      taskName: "디자인 수정",
      description: "",
      time: "1일",
    },
    {
      milestone: true,
      order: 5,
      taskName: "추가 디자인",
      description: "",
      time: "2일",
    },
  ],
  ux: [
    {
      milestone: true,
      order: 1,
      taskName: "리서치 요구사항 인터뷰",
      description: "",
      time: "1일",
    },
    {
      milestone: true,
      order: 2,
      taskName: "리서치 개요 설정",
      description: "",
      time: "3일",
    },
    {
      milestone: true,
      order: 3,
      taskName: "리서치 기획 및 참여자 선정",
      description: "",
      time: "1-2주",
    },
    {
      milestone: true,
      order: 4,
      taskName: "테스트 진행",
      description: "",
      time: "1주",
    },
    {
      milestone: true,
      order: 5,
      taskName: "결과 데이터 분석",
      description: "",
      time: "1주",
    },
    {
      milestone: true,
      order: 6,
      taskName: "결과 보고서 제작",
      description: "",
      time: "1주",
    },
  ],
  motiongraphic: [
    {
      milestone: true,
      order: 1,
      taskName: "사전 조율",
      description: "",
      time: "2일",
    },
    {
      milestone: true,
      order: 2,
      taskName: "씬 구분 및 스타일 프레임",
      description: "",
      time: "3일",
    },
    {
      milestone: true,
      order: 3,
      taskName: "프리비즈",
      description: "",
      time: "1-2주",
    },
    {
      milestone: true,
      order: 4,
      taskName: "씬 제작",
      description: "",
      time: "1-3주",
    },
    {
      milestone: true,
      order: 5,
      taskName: "프리뷰",
      description: "",
      time: "1주",
    },
    {
      milestone: true,
      order: 6,
      taskName: "렌더링",
      description: "",
      time: "1-2주",
    },
  ],
  rendering: [
    {
      milestone: true,
      order: 1,
      taskName: "기획 내용 확인, 레퍼런스",
      description: "",
      time: "2일",
    },
    {
      milestone: true,
      order: 2,
      taskName: "장면 구성 및 디자인 기획",
      description: "",
      time: "3일",
    },
    {
      milestone: true,
      order: 3,
      taskName: "씬 제작 및 디벨롭",
      description: "",
      time: "2-4일",
    },
    {
      milestone: true,
      order: 4,
      taskName: "렌더링 및 공유",
      description: "",
      time: "2일",
    },
  ],
};
