import "~/styles/globals.css";

import { type Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { MainNav } from "~/components/main-nav";
import { marketingConfig } from "~/config/marketing";
import { getServerAuthSession } from "~/server/auth";

import Provider from "./_trpc/Provider";
import { NextAuthProvider } from "./authProvider";
import { GlobalNotifications } from "./GlobalNotifications";
import { SentenceCreatorDialog } from "./SentenceCreatorDialog";
import { SsrContextProvider } from "./SsrContext";
import { getTrpcServer } from "./_trpc/serverClient";

import { UserMenuOrLogin } from "../components/UserMenuOrLogin";

export const metadata: Metadata = {
  title: "Kids Reading",
  description: "A site to help practice reading with a kid.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerAuthSession();

  const trpcServer = await getTrpcServer();
  const awards = await trpcServer.awardRouter.getAllAwardsForProfile();

  return (
    <html>
      <body>
        <NextAuthProvider session={session}>
          <Provider>
            <SsrContextProvider
              initialData={{
                awardRouter: {
                  getAllAwardsForProfile: awards,
                },
              }}
            >
              <div className="flex min-h-screen flex-col pb-20">
                <header className="bg-background container z-40">
                  <div className="flex h-20 items-center justify-between py-6">
                    <MainNav items={marketingConfig.mainNav} />
                    <UserMenuOrLogin />
                  </div>
                </header>
                <GlobalNotifications />
                <main className="flex-1">
                  <div className="container flex max-w-[96rem] flex-col items-center gap-4 text-center">
                    {children}
                  </div>
                </main>
                <SentenceCreatorDialog />
              </div>
              <ReactQueryDevtools initialIsOpen={false} />
            </SsrContextProvider>
          </Provider>
        </NextAuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
