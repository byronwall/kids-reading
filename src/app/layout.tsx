import "~/styles/globals.css";

import { type Metadata } from "next";

import { MainNav } from "~/components/main-nav";
import { marketingConfig } from "~/config/marketing";
import { getServerAuthSession } from "~/server/auth";

import Provider from "./_trpc/Provider";
import { NextAuthProvider } from "./authProvider";

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
  console.log("session and page props");

  const session = await getServerAuthSession();

  return (
    <html>
      <body>
        <NextAuthProvider session={session}>
          <Provider>
            <div className="flex min-h-screen flex-col pb-20">
              <header className="bg-background container z-40">
                <div className="flex h-20 items-center justify-between py-6">
                  <MainNav items={marketingConfig.mainNav} />
                  <UserMenuOrLogin />
                </div>
              </header>
              <main className="flex-1">
                <div className="container flex max-w-[96rem] flex-col items-center gap-4 text-center">
                  {children}
                </div>
              </main>
            </div>
          </Provider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
