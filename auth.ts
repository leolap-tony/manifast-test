import NextAuth, { NextAuthConfig, type Session } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import credentials from "next-auth/providers/credentials";
import google from "next-auth/providers/google";
import naver from "next-auth/providers/naver";
import kakao from "next-auth/providers/kakao";
import authConfig from "./auth.config";

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/signin",
  },
  // providers: [
  //   google({
  //     clientId: process.env.GOOGLE_CLIENT_ID,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  //   }),
  // ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60, // in seconds
    updateAge: 0,
  },
  ...authConfig,
} satisfies NextAuthConfig);
