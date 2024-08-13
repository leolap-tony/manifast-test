import React from "react";
import Header from "../../../../components/navigation/Header";
import KeyValueLabel from "../../../../components/elements/KeyValueLabel";
import { Button } from "../../../../components/elements/Button";
import Link from "next/link";
import Image from "next/image";
import { Authority, Role, User } from "@prisma/client";
import { roleAndAuthorityToKorean } from "@/lib/textReplacer";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { getMyGroup, getMyInfo } from "../actions";
import { auth } from "@/auth";
import UserAvatar from "@/components/elements/UserAvatar";
import MemberControl from "./MemberControl";
import { group } from "console";

export default async function user() {
  const session = await auth();
  const data = await getMyGroup(session?.user.sub as string);
  return (
    <section className="page-section">
      <section>
        <Header type="section" title={data?.group?.name}></Header>
        <ul className="flex flex-col gap-3 px-6 pb-6">
          <li>
            <KeyValueLabel direction="row" label="그룹 관리자" labelWidth={86}>
              <UserAvatar size="md" user={data?.group?.owner as User} label />
            </KeyValueLabel>
          </li>
          <li>
            <KeyValueLabel direction="row" label="그룹 이메일" labelWidth={86}>
              {data?.group?.email}
            </KeyValueLabel>
          </li>
          <li>
            <KeyValueLabel direction="row" label="그룹 연락처" labelWidth={86}>
              {data?.group?.phone}
            </KeyValueLabel>
          </li>
          <li>
            <KeyValueLabel direction="row" label="생성일" labelWidth={86}>
              {format(data?.group?.createdAt as Date, "PPP", { locale: ko })}
            </KeyValueLabel>
          </li>
          <li>
            <KeyValueLabel direction="row" label="그룹 ID" labelWidth={86}>
              {data?.group?.id}
            </KeyValueLabel>
          </li>
          <li>
            <KeyValueLabel direction="row" label="플랜" labelWidth={86}>
              {data?.group?.membershipInfo?.membership.name}
            </KeyValueLabel>
          </li>
        </ul>
        <MemberControl
          userId={session?.user.sub as string}
          groupId={data?.group?.id as string}
          members={data?.group?.members as any}
        />
      </section>
    </section>
  );
}
