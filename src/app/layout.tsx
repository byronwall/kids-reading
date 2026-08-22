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

  if (session?.user?.activeProfile?.id) {
    await callQuerySsrServer(appRouter.awardRouter.getAllAwardsForProfile);
    await callQuerySsrServer(appRouter.questionRouter.getFocusedWords);
  }
  if (session?.user) {
    await callQuerySsrServer(appRouter.userRouter.getAllProfiles);
  }

  return (
    <html lang="en">
      <body>
        <NextAuthProvider session={session}>
          <Provider>
            <SsrContextServer>
              <div className="flex min-h-screen w-full flex-col">
                <header className="sticky top-0 z-40 w-full border-b border-border bg-background">
                  <div className="flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    <MainNav items={marketingConfig.mainNav} />
                    <UserMenuOrLogin />
                  </div>
                </header>
                <GlobalNotifications />
                <main className="flex w-full flex-1 flex-col">
                  <div className="flex w-full flex-col items-center gap-6 px-4 py-8 text-center sm:px-6 md:py-12 lg:px-8">
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
