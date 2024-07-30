// import { signIn } from "next-auth/react";
import { signIn } from "@/auth";
import Image from "next/image";
import Logo from "@/public/Logo.svg";

export default function Signin() {
  return (
    <div className="w-full h-[100vh] flex">
      {/* <Image
        src={Logo}
        height={27}
        alt="logo"
        className="absolute left-6 top-3"
      /> */}
      <form
        className="absolute inset-0 w-[400px] h-fit border rounded-lg drop-shadow-lg place-self-center place-content-center p-6 flex flex-col gap-8 items-center"
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/" });
        }}
      >
        <Image src={Logo} height={36} alt="logo" />
        <button
          className="w-full bg-black text-center text-white p-3 rounded-md text-sm"
          // onClick={() => signIn("google", { redirectTo: "/dashboard" })}
        >
          구글로 로그인
        </button>
      </form>
    </div>
  );
}
