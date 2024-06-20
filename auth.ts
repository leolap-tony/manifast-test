import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import credentials from "next-auth/providers/credentials"
import google from "next-auth/providers/google"
import naver from "next-auth/providers/naver"
import kakao from "next-auth/providers/kakao"

const prisma = new PrismaClient()

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        // credentials({
        //     async authorize(credentials) {
                
        //         return null
        //     }
        // }),
        google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        naver({

        }),
        kakao({

        })
    ],
})