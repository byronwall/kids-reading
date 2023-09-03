import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type Profile } from "@prisma/client";
import bcrypt from "bcrypt";
import { type GetServerSidePropsContext } from "next";
import {
  type DefaultSession,
  getServerSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      id: string;
      activeProfile: Profile;
    };
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session({ session, user, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.activeProfile = token.activeProfile as Profile;
        // session.user.role = user.role; <-- put other properties on the session here
      }

      return session;
    },
    jwt({ token, user, trigger, session }) {
      // Add auth_time to token on signin in

      if (trigger === "update") {
        if ("activeProfile" in session) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          token.activeProfile = session.activeProfile;
        }
      }

      if (user !== undefined) {
        token.auth_time = Math.floor(Date.now() / 1000);
        token.id = user.id;
      }
      return Promise.resolve(token);
    },
  },
  jwt: {
    secret: env.JWT_SECRET,
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "a@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user?.password) {
          return null;
        }

        // check the passwords
        const passwordsMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (passwordsMatch) {
          return user;
        }

        return null;
      },
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx?: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  if (!ctx) {
    return getServerSession(authOptions);
  }

  return getServerSession(ctx.req, ctx.res, authOptions);
};
