import { NextAuthConfig } from "next-auth";
import ZitadelProvider from "next-auth/providers/zitadel";

export default {
  providers: [
    ZitadelProvider({
      issuer: process.env.ZITADEL_ISSUER as string,
      clientId: process.env.ZITADEL_CLIENT_ID as string,
      clientSecret: process.env.ZITADEL_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope: "openid email profile offline_access",
        },
      },
      async profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          firstName: profile.given_name,
          lastName: profile.family_name,
          email: profile.email,
          loginName: profile.preferred_username,
          image: profile.picture,
        };
      },
    }),
  ],
  callbacks: {},
} satisfies NextAuthConfig;
