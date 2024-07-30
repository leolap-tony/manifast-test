import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import KeyValueLabel from "@/components/elements/KeyValueLabel";
import { Group, User } from "@prisma/client";
import Header from "./navigation/Header";
import UserAvatar from "./elements/UserAvatar";

export default function MyGroupInformation({
  group,
}: {
  group: Group & { members: User[] };
}) {
  return (
    <div>
      <Header type="section" title={group?.name as string}></Header>
      <ul className="flex flex-col gap-3 px-6 mb-6">
        <li>
          <KeyValueLabel
            direction="horizontal"
            label="그룹 관리자"
            labelWidth={86}
          >
            {/*<UserAvatar size="md" user={user?.group?.owner}>*/}오너
          </KeyValueLabel>
        </li>
        <li>
          <KeyValueLabel
            direction="horizontal"
            label="그룹 이메일"
            labelWidth={86}
          >
            {group?.email}
          </KeyValueLabel>
        </li>
        <li>
          <KeyValueLabel
            direction="horizontal"
            label="그룹 연락처"
            labelWidth={86}
          >
            {group?.phone}
          </KeyValueLabel>
        </li>
        <li>
          <KeyValueLabel direction="horizontal" label="생성일" labelWidth={86}>
            {group?.createdAt.toLocaleDateString()}
          </KeyValueLabel>
        </li>
        <li>
          <KeyValueLabel direction="horizontal" label="그룹 ID" labelWidth={86}>
            {group?.id}
          </KeyValueLabel>
        </li>
        <li>
          <KeyValueLabel direction="horizontal" label="플랜" labelWidth={86}>
            플랜
          </KeyValueLabel>
        </li>
      </ul>
      <Header type="section" title="멤버 정보"></Header>
      <div className="px-6 mb-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">멤버</TableHead>
              <TableHead className="w-[200px]">이메일</TableHead>
              <TableHead className="w-[200px]">권한</TableHead>
              <TableHead className="w-[200px]">역할</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {group &&
              group?.members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <UserAvatar user={member} label />
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.role}</TableCell>
                  <TableCell>{member.job}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <Header type="section" title="비즈니스 정보"></Header>
      <ul className="flex flex-col gap-3 px-6 mb-6">
        <li>
          <KeyValueLabel direction="horizontal" label="상호명" labelWidth={86}>
            상호명
          </KeyValueLabel>
        </li>
        <li>
          <KeyValueLabel direction="horizontal" label="플랜" labelWidth={86}>
            {group.ceo}
          </KeyValueLabel>
        </li>
        <li>
          <KeyValueLabel
            direction="horizontal"
            label="사업자등록번호"
            labelWidth={86}
          >
            {group.businessNumber}
          </KeyValueLabel>
        </li>
        <li>
          <KeyValueLabel direction="horizontal" label="주소" labelWidth={86}>
            주소
          </KeyValueLabel>
        </li>
        <li>
          <KeyValueLabel
            direction="horizontal"
            label="사업 카테고리"
            labelWidth={86}
          >
            사업 카테고리
          </KeyValueLabel>
        </li>
        <li>
          <KeyValueLabel direction="horizontal" label="규모" labelWidth={86}>
            규모
          </KeyValueLabel>
        </li>
        <li>
          <KeyValueLabel direction="horizontal" label="인원" labelWidth={86}>
            인원
          </KeyValueLabel>
        </li>
      </ul>
    </div>
  );
}
