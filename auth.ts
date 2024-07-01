import NextAuth, { NextAuthConfig, type Session } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import credentials from "next-auth/providers/credentials"
import google from "next-auth/providers/google"
import naver from "next-auth/providers/naver"
import kakao from "next-auth/providers/kakao"

const prisma = new PrismaClient()

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    // pages: {
    //   newUser:'/signup'
    // },
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
        // naver({

        // }),
        // kakao({

        // })
    ],
    session: {
        strategy: "jwt",
        maxAge: 10*60, // 30 days
        updateAge: 0
      },
      callbacks: {  
        async jwt(props) {
          if (props) {
            // console.log(`in jwt2 : ${JSON.stringify(props)}`)
          }
          if(props.user){
            props.token.role = props.user.role
          }
          return props.token
        },
        async session({session, token} : {session: Session, token?: any}) {
          if (session.user) {
            session.user.sub = token ? token.sub : null 
            session.user.role = token.role 
          }
          // console.log('in session : '+JSON.stringify(session, null, 2))
          return session
        },
        authorized( {request, auth} ) {
          // console.log('in authorize:',auth)
          return !!auth
        },
      },
} satisfies NextAuthConfig
)