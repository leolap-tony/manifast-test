import { auth } from "@/auth";
import NextAuth from "next-auth";
import authConfig from "./auth.config";

export default NextAuth(authConfig).auth((req) => {
  if (!req.auth) {
    const newUrl = new URL("/api/auth/signin", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
  if (!req.auth?.user.role && !req.nextUrl.pathname.startsWith("/onboarding")) {
    const newUrl = new URL("/onboarding", req.nextUrl.origin);
    return Response.redirect(newUrl);
  }
});
// export default NextAuth(authConfig).auth

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|signin|.*\\.png$).*)"],
};
