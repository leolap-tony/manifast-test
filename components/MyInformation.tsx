import React from "react";
import Header from "./navigation/Header";
import KeyValueLabel from "./elements/KeyValueLabel";
import { Button } from "./elements/Button";
import Link from "next/link";
import Image from "next/image";
import { Authority, Role, User } from "@prisma/client";
import { roleAndAuthorityToKorean } from "@/lib/textReplacer";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function MyInformation({ user }: { user: User }) {
  return (
    <div>
      <Header type="section" title={user?.name as string}></Header>
      <ul className="flex flex-col gap-3 px-6 mb-6">
        <li>
          <KeyValueLabel direction="horizontal" label="이메일" labelWidth={86}>
            {user?.email}
          </KeyValueLabel>
        </li>
        <li>
          <KeyValueLabel direction="horizontal" label="연락처" labelWidth={86}>
            {user?.phone}
          </KeyValueLabel>
        </li>
        <li>
          <KeyValueLabel direction="horizontal" label="가입일" labelWidth={86}>
            {format(user?.createdAt, "PPP", { locale: ko })}
          </KeyValueLabel>
        </li>
        <li>
          <KeyValueLabel direction="horizontal" label="직무" labelWidth={86}>
            {user?.job}
          </KeyValueLabel>
        </li>
        <li>
          <KeyValueLabel direction="horizontal" label="권한" labelWidth={86}>
            {roleAndAuthorityToKorean(user.authority as Authority)}
          </KeyValueLabel>
        </li>
        <li>
          <KeyValueLabel direction="horizontal" label="역할" labelWidth={86}>
            {roleAndAuthorityToKorean(user.role as Role)}
          </KeyValueLabel>
        </li>
        <li>
          <KeyValueLabel
            direction="horizontal"
            label="프로필 이미지"
            labelWidth={86}
          >
            {user?.image && (
              <Image
                src={user.image}
                alt="profile"
                height={32}
                width={32}
                className="rounded-full"
              />
            )}
          </KeyValueLabel>
        </li>
      </ul>
      <div className="px-6">
        <Button variant="outline" asChild className="w-fit">
          <Link href="/myinfo/update">수정</Link>
        </Button>
      </div>
    </div>
  );
}
