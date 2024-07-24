import type { NextAuthConfig, Session } from "next-auth";
import google from "next-auth/providers/google";

export default {
  secret: process.env.AUTH_SECRET,
  // pages: {
  //   signIn: '/login',
  //   newUser: '/signup'
  // },
  callbacks: {
    async jwt(props) {
      if (props.user) {
        props.token.role = props.user.role;
      }
      return props.token;
    },
    async session({ session, token }: { session: Session; token?: any }) {
      if (session.user) {
        session.user.sub = token ? token.sub : null;
        session.user.role = token.role;
      }
      return session;
    },
    authorized({ request, auth }) {
      return !!auth;
    },
  },
  providers: [
    // credentials({
    //     async authorize(credentials) {

    //         return null
    //     }
    // }),
    google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // naver({

    // }),
    // kakao({

    // })
  ],
} satisfies NextAuthConfig;
