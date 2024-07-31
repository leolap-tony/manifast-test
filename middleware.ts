import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // "/" 경로는 인증 여부와 상관없이 "/dashboard"로 리디렉션
  if (pathname === "/") {
    if (req.auth) {
      const newUrl = new URL("/dashboard", req.nextUrl.origin);
      return NextResponse.redirect(newUrl);
    } else {
      const newUrl = new URL("/signin", req.nextUrl.origin);
      return NextResponse.redirect(newUrl);
    }
  }

  // 인증되지 않은 사용자는 "/signin" 경로를 제외하고 모든 경로에서 "/signin"으로 리디렉션
  if (!req.auth && pathname !== "/signin") {
    const newUrl = new URL("/signin", req.nextUrl.origin);
    return NextResponse.redirect(newUrl);
  }

  // 인증된 사용자가 "/signin"에 접근할 경우 "/dashboard"로 리디렉션
  if (req.auth && pathname === "/signin") {
    const newUrl = new URL("/dashboard", req.nextUrl.origin);
    return NextResponse.redirect(newUrl);
  }

  // 나머지 경우에는 요청한 경로로 접근 허용
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
