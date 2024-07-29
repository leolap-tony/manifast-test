"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Google from "@/public/google.svg";
import { Button } from "@/components/elements/Button";

export default function Signin() {
  return (
    <div className="w-full h-[100vh] flex">
      <div className="absolute inset-0 w-[400px] h-fit border rounded-lg place-self-center place-content-center p-6 flex flex-col gap-8 items-center bg-background drop-shadow-md">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-text-title text-title-lg">로그인</h1>
          <p className="text-body-md-n text-text-sub">
            회사 이메일로 로그인해주세요.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => signIn("google", { redirectTo: "/dashboard" })}
          className="w-full"
        >
          <div className="flex flex-row gap-2 items-center">
            <Image src={Google} width={20} height={20} alt="google" />
            <span className="text-title-sm">구글 로그인</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
