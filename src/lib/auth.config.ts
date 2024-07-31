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
  callbacks: {
    async jwt({ token, user, account }) {
      token.user ??= user;
      token.accessToken ??= account?.access_token;
      token.refreshToken ??= account?.refresh_token;
      token.expiresAt ??= (account?.expires_in ?? 0) * 1000;
      token.error = undefined;

      if (Date.now() < (token.expiresAt as number)) {
        return token;
      }

      // TODO: refresh the token eh?
      return token;
    },

    async session({ session, token: { user, error: tokenError } }) {
      session.user = {
        id: user?.id ?? "",
        email: user?.email ?? "",
        image: user?.image ?? "",
        name: user?.name,
        loginName: user?.name ?? "",
        emailVerified: user?.emailVerified ?? false,
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
      };
      session.clientId = process.env.ZITADEL_CLIENT_ID as string;
      session.error = tokenError;
      return session;
    },
  },
} satisfies NextAuthConfig;
