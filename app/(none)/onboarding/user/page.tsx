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
          <h1 className="w-full text-left text-title-lg">처음 뵙겠습니다.</h1>
          <KeyValueLabel
            direction="col"
            label={
              <span>
                이름<span className="text-primary align-top"> *</span>
              </span>
            }
            hint="매니패스트에서 쓰일 이름"
          >
            <Input
              placeholder="입력해주세요"
              defaultValue={session?.user.name as string}
            />
          </KeyValueLabel>
          <KeyValueLabel
            direction="col"
            label={
              <span>
                이메일<span className="text-primary align-top"> *</span>
              </span>
            }
          >
            <Input
              placeholder="입력해주세요"
              disabled
              defaultValue={session?.user.email as string}
            />
          </KeyValueLabel>
          <KeyValueLabel
            direction="col"
            label={
              <span>
                연락처<span className="text-primary align-top"> *</span>
              </span>
            }
          >
            <Input placeholder="ex)010-1234-5678" />
          </KeyValueLabel>
          <KeyValueLabel direction="col" label="프로필 이미지">
            <UserAvatar
              size="xl"
              user={{ image: session?.user.image, name: session?.user.name }}
            />
          </KeyValueLabel>
          <Button size="lg">가입 완료</Button>
        </div>
      </div>
    </section>
  );
}
