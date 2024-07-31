import { DefaultSession, User } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      loginName?: string;
      orgName?: string;
    } & DefaultSession["user"];
    error?: string;
    clientId: string;
  }

  interface User {
    emailVerified: boolean;
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    email: string;
    loginName: string;
    image: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user?: User;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: string;
  }
}
