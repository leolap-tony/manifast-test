import { setMyUserInfo } from "@/app/(work)/info/actions";
import { auth } from "@/auth";
import { Button } from "@/components/elements/Button";
import { Input } from "@/components/elements/Input";
import KeyValueLabel from "@/components/elements/KeyValueLabel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/elements/Select";
import UserAvatar from "@/components/elements/UserAvatar";
import React from "react";

export default async function page() {
  const session = await auth();
  return (
    <section className="page-section">
      <div className="w-full h-full flex justify-center items-center">
        <form action={setMyUserInfo} className="flex flex-col gap-8 w-[400px]">
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
              name="name"
              required
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
              name="email"
              type="email"
              placeholder="입력해주세요"
              readOnly
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
            <Input
              name="phone"
              type="tel"
              required
              placeholder="ex)010-1234-5678"
            />
          </KeyValueLabel>
          <KeyValueLabel direction="col" label={<span>직무</span>}>
            <Select name="job">
              <SelectTrigger>
                <SelectValue placeholder="선택해주세요"></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="기획자">기획자</SelectItem>
                <SelectItem value="개발자">개발자</SelectItem>
                <SelectItem value="디자이너">디자이너</SelectItem>
                <SelectItem value="마케터">마케터</SelectItem>
                <SelectItem value="영업직">영업직</SelectItem>
                <SelectItem value="기타">기타</SelectItem>
              </SelectContent>
            </Select>
          </KeyValueLabel>
          <KeyValueLabel direction="col" label="프로필 이미지">
            <UserAvatar
              size="xl"
              user={{ image: session?.user.image, name: session?.user.name }}
            />
          </KeyValueLabel>
          <Button size="lg">가입 완료</Button>
        </form>
      </div>
    </section>
  );
}
