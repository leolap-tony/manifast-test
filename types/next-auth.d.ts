import NextAuth, { DefaultSession, User, AdapterUser } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      /** The user's postal address. */
      sub: string;
      role: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role: string;
    phoen: string;
  }
}

// declare module "next-auth/jwt" {
//   interface JWT {
//     role: string
//   }
// }

declare module "@auth/core/adapters" {
  export interface AdapterUser extends User {
    role: string;
    phone: string;
  }
}
