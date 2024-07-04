import React from "react";
import { auth } from "@/auth";

import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Textarea } from "@/components/ui/textarea";

const page = async ({ params }: { params: { pid: string } }) => {
  const session = await auth();
  return (
    <div className="flex flex-col p-8 w-full gap-8">
      <h1 className="text-3xl font-bold">프로젝트명 : {params.pid}</h1>
      <div className="flex flex-col p-6 bg-slate-50 rounded-lg ">
        <div className="flex justify-around">
          <div className="flex">
            <div>전담 PM</div>
            <div>Jane</div>
          </div>
          <div className="flex">
            <div>그룹</div>
            <div>그룹이름</div>
          </div>
          <div className="flex">
            <div>종류</div>
            <div>BX 디자인</div>
          </div>
        </div>
        <div className="flex justify-around">
          <div className="flex">
            <div>작업자</div>
            <div>Jane</div>
          </div>
          <div className="flex">
            <div>그룹 관리자</div>
            <div>그룹 관리자명</div>
          </div>
          <div className="flex">
            <div>상태</div>
            <div>요청됨</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="text-lg">30% 요청됨</div>
          <div className="text-lg">2024.06.08 - 2024.06.18 (예정)</div>
        </div>
        <Progress value={30} className="[&>*]:bg-pink-500" />
      </div>

      <Tabs defaultValue="thread" className="">
        <TabsList>
          <TabsTrigger value="thread">스레드</TabsTrigger>
          <TabsTrigger value="wbs">WBS</TabsTrigger>
        </TabsList>
        <TabsContent value="thread">
          <div className="flex flex-col gap-8 w-full p-4">
            <ToggleGroup type="single">
              <ToggleGroupItem value="normal">일반 메시지</ToggleGroupItem>
              <ToggleGroupItem value="complete">프로젝트 완료</ToggleGroupItem>
            </ToggleGroup>
            <Textarea placeholder="Type your message here." id="message-2" />
          </div>
        </TabsContent>
        <TabsContent value="wbs">
          <div className="flex flex-col gap-8 w-full p-4"></div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;
