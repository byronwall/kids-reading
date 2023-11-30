import "~/styles/globals.css";

import { type Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { MainNav } from "~/components/nav/main-nav";
import { marketingConfig } from "~/config/marketing";
import { getServerAuthSession } from "~/server/auth";
import { callQuerySsrServer } from "~/hooks/useQuerySsrServer";
import { appRouter } from "~/server/api/root";
import { UserMenuOrLogin } from "~/components/user/UserMenuOrLogin";
import { SentenceCreatorDialog } from "~/components/sentences/SentenceCreatorDialog";
import { SsrContextServer } from "~/lib/trpc/SsrContextServer";
import Provider from "~/lib/trpc/Provider";
import { NextAuthProvider } from "~/lib/auth/authProvider";
import { GlobalNotifications } from "~/components/awards/GlobalNotifications";

export const metadata: Metadata = {
  title: "fawnix.rocks",
  description: "A site to help practice reading with a kid.",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  await callQuerySsrServer(appRouter.awardRouter.getAllAwardsForProfile);
  await callQuerySsrServer(appRouter.questionRouter.getFocusedWords);
  await callQuerySsrServer(appRouter.userRouter.getAllProfiles);

  return (
    <html>
      <body>
        <NextAuthProvider session={session}>
          <Provider>
            <SsrContextServer>
              <div className="flex min-h-screen flex-col pb-20">
                <header className="bg-background container z-40">
                  <div className="flex h-20 items-center justify-between py-6">
                    <MainNav items={marketingConfig.mainNav} />
                    <UserMenuOrLogin />
                  </div>
                </header>
                <GlobalNotifications />
                <main className="flex-1">
                  <div className="container flex max-w-full  flex-col items-center gap-4 text-center">
                    {children}
                  </div>
                </main>
                <SentenceCreatorDialog />
              </div>
              <ReactQueryDevtools initialIsOpen={false} />
            </SsrContextServer>
          </Provider>
        </NextAuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
