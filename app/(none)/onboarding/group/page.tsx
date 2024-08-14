import { auth } from "@/auth";
import { Button } from "@/components/elements/Button";
import { Input } from "@/components/elements/Input";
import KeyValueLabel from "@/components/elements/KeyValueLabel";
import UserAvatar from "@/components/elements/UserAvatar";
import React from "react";

export default async function page() {
  const session = await auth();
  return (
    <section className="page-section">
      <div className="w-full h-full flex justify-center items-center">
        <div className="flex flex-col gap-8 w-[400px]">
          <h1 className="w-full text-left text-title-lg">
            {session?.user.name}님 반갑습니다.
          </h1>
          <KeyValueLabel
            direction="col"
            label={
              <span>
                그룹 ID를 입력해 주세요
                <span className="text-primary align-top"> *</span>
              </span>
            }
            hint="ID는 그룹 관리자에게 문의하세요."
          >
            <Input
              placeholder="입력해주세요"
              defaultValue={session?.user.name as string}
            />
          </KeyValueLabel>
          <Button size="lg">참여</Button>
          {/*<div className="w-full p-8 bg-background-gray rounded-[10px] flex flex-row justify-between gap-8">
            <p className="text-body-md-n w-full">그룹이 없나요?</p>
            <Button variant="outline" className="w-full">
              그룹 새로 생성
            </Button>
          </div>*/}
        </div>
      </div>
    </section>
  );
}
