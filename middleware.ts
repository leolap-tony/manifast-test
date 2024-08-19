import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const { auth } = req;

  const redirect = (path: string) =>
    NextResponse.redirect(new URL(path, req.nextUrl.origin));

  // "/" 경로의 처리
  if (pathname === "/") {
    return redirect(auth ? "/dashboard" : "/signin");
  }

  // 인증되지 않은 사용자는 "/signin"을 제외한 모든 경로에서 "/signin"으로 리디렉션
  if (!auth && pathname !== "/signin") {
    return redirect("/signin");
  }

  // 인증된 사용자가 "/signin"에 접근할 경우 "/dashboard"로 리디렉션
  if (auth && pathname === "/signin") {
    return redirect("/dashboard");
  }

  if (
    auth &&
    (!auth.user.role || !auth.user.authority) &&
    !pathname.startsWith("/onboarding")
  ) {
    return redirect("/onboarding/user");
  }
  // 나머지 경우에는 요청한 경로로 접근 허용
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
