import NextAuth, { NextAuthConfig, type Session } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import google from "next-auth/providers/google";

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // in seconds
    updateAge: 0,
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt(props) {
      if (props.user) {
        props.token.role = props.user.role;
        props.token.authority = props.user.authority;
        if (props.trigger === "signUp") {
          props.token.isNewUser = true; // 토큰에 새 유저 여부 저장
        }
      }
      return props.token;
    },
    async session({ session, token }: { session: Session; token?: any }) {
      if (session.user) {
        session.user.sub = token ? token.sub : null;
        session.user.role = token.role;
        session.user.authority = token.authority;

        if (token.isNewUser) {
          session.isNewUser = token.isNewUser;
        }
      }
      return session;
    },
    authorized({ request, auth }) {
      return !!auth;
    },
  },
  providers: [
    google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
} satisfies NextAuthConfig);
