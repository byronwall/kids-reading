import { MainNav } from "~/components/main-nav";
import { buttonVariants } from "~/components/ui/button";
import { marketingConfig } from "~/config/marketing";
import { cn } from "~/lib/utils";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";

import { AuthShowcase } from "../components/AuthShowcase";
import { siteConfig } from "~/config/site";

export default function Home() {
  const hello = api.authRouter.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>kids reading</title>
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
          <section className="space-y-2 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-16">
            <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
              <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
                A site to help with kid's reading.
              </h1>
              <p className="text-muted-foreground max-w-[42rem] leading-normal sm:text-xl sm:leading-8">
                A nice little site.
              </p>
              <div className="space-x-4">
                <Link
                  href="/login"
                  className={cn(buttonVariants({ size: "lg" }))}
                >
                  Get Started
                </Link>
                <Link
                  href={siteConfig.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" })
                  )}
                >
                  GitHub
                </Link>
              </div>
            </div>
          </section>
          <AuthShowcase />
        </main>
      </div>
    </>
  );
}
