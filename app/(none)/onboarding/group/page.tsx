"use client";

import { setMyGroup } from "@/app/(work)/info/actions";
import { signOut } from "next-auth/react";
import { Button } from "@/components/elements/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/elements/Dialog";
import { Input } from "@/components/elements/Input";
import KeyValueLabel from "@/components/elements/KeyValueLabel";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState } from "react";

export default function Page() {
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const session = useSession();
  const handleSubmit = async (e: FormData) => {
    const result = await setMyGroup(e);
    if (result?.result === "error") {
      setSuccess(false);
      setOpen(true);
    } else {
      setSuccess(true);
      setOpen(true);
    }
  };

  return (
    <section className="page-section">
      <div className="w-full h-full flex justify-center items-center">
        <form
          action={(e) => handleSubmit(e)}
          className="flex flex-col gap-8 w-[400px]"
        >
          <h1 className="w-full text-left text-title-lg">
            {session.data?.user.name}님 반갑습니다.
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
            <Input name="groupId" required placeholder="입력해주세요" />
          </KeyValueLabel>
          <div className='flex justify-between gap-5'>
            <Button variant='outline' size='lg' className='w-full' type='button'><Link href={'/onboarding/user'}>이전</Link></Button>
            <Button size="lg" className="w-full">참여</Button>
          </div>
          <div className="bg-slate-50 w-full rounded-xl flex justify-between p-8">
            <div>그룹의 계정이 없나요?</div>
            <Button variant='outline'><Link href={'/onboarding/group/create'}>그룹 새로 생성</Link></Button>
          </div>
          <Dialog open={open} onOpenChange={(e) => setOpen(e)}>
            <DialogContent>
              {success ? (
                <>
                  <DialogTitle>성공했습니다.</DialogTitle>
                  <DialogDescription>
                    정보 반영을 위해 다시로그인
                  </DialogDescription>
                  <Button onClick={() => signOut()}>계속하기</Button>
                </>
              ) : (
                <>
                  <DialogTitle>실패했습니다.</DialogTitle>
                  <DialogDescription>다시 시도하세요.</DialogDescription>
                </>
              )}
            </DialogContent>
          </Dialog>
          {/*<div className="w-full p-8 bg-background-gray rounded-[10px] flex flex-row justify-between gap-8">
            <p className="text-body-md-n w-full">그룹이 없나요?</p>
            <Button variant="outline" className="w-full">
              그룹 새로 생성
            </Button>
          </div>*/}
        </form>
      </div>
    </section>
  );
}
