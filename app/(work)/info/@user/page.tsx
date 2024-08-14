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
import { getMyInfo } from "../actions";
import { auth } from "@/auth";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/elements/Dialog";

export default async function user() {
  const session = await auth();
  const user = await getMyInfo(session?.user.sub as string);
  return (
    <section className="page-section">
      <Header type="section" title={user?.name}></Header>
      <ul className="flex flex-col gap-3 px-6 mb-6">
        <li>
          <KeyValueLabel direction="row" label="이메일" labelWidth={86}>
            {user?.email}
          </KeyValueLabel>
        </li>
        <li>
          <KeyValueLabel direction="row" label="연락처" labelWidth={86}>
            {user?.phone}
          </KeyValueLabel>
        </li>
        <li>
          <KeyValueLabel direction="row" label="가입일" labelWidth={86}>
            {format(user?.createdAt as Date, "PPP", { locale: ko })}
          </KeyValueLabel>
        </li>
        <li>
          <KeyValueLabel direction="row" label="직무" labelWidth={86}>
            {user?.job}
          </KeyValueLabel>
        </li>
        <li>
          <KeyValueLabel direction="row" label="권한" labelWidth={86}>
            {roleAndAuthorityToKorean(user?.authority as Authority)}
          </KeyValueLabel>
        </li>
        <li>
          <KeyValueLabel direction="row" label="역할" labelWidth={86}>
            {roleAndAuthorityToKorean(user?.role as Role)}
          </KeyValueLabel>
        </li>
        <li>
          <KeyValueLabel direction="row" label="프로필 이미지" labelWidth={86}>
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
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-fit">
              수정
            </Button>
          </DialogTrigger>
          <DialogContent></DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
