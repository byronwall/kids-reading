"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

import { Button, buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { UserAccountNav } from "~/components/nav/UserAccountNav";

export function UserMenuOrLogin() {
  const { data: session } = useSession();

  const needsAuth = session === undefined || session === null;

  return (
    <nav>
      {needsAuth ? (
        <div className="flex gap-2">
          <Button
            className={cn(buttonVariants({ variant: "secondary" }), "px-4")}
            onClick={() => signIn()}
          >
            Login
          </Button>
          <Button>
            <Link href="/register">Sign up</Link>
          </Button>
        </div>
      ) : (
        <UserAccountNav user={session.user} />
      )}
    </nav>
  );
}
