import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import { api } from "~/utils/api";
import { MainNav } from "~/components/main-nav";
import { buttonVariants } from "~/components/ui/button";
import { marketingConfig } from "~/config/marketing";
import { cn } from "~/lib/utils";
import Head from "next/head";
import Link from "next/link";

import { AuthShowcase } from "../components/AuthShowcase";
import { siteConfig } from "~/config/site";
import "~/styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <>
        <Head>
          <title>Kids Reading</title>
          <meta name="description" content="Kids Reading" />
          <link rel="icon" href="/favicon.svg" />
        </Head>
        <div className="flex min-h-screen flex-col pb-20">
          <header className="bg-background container z-40">
            <div className="flex h-20 items-center justify-between py-6">
              <MainNav items={marketingConfig.mainNav} />
              <nav>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: "secondary", size: "sm" }),
                    "px-4"
                  )}
                >
                  Login
                </Link>
              </nav>
            </div>
          </header>
          <main className="flex-1">
            <Component {...pageProps} />
          </main>

          <AuthShowcase />
        </div>
      </>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
