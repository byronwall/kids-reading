"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

import { UserAccountNav } from "./UserAccountNav";

export function UserMenuOrLogin() {
  const { data: session } = useSession();

  const needsAuth = session === undefined || session === null;

  return (
    <nav>
      {needsAuth ? (
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "secondary", size: "sm" }),
            "px-4"
          )}
        >
          Login
        </Link>
      ) : (
        <UserAccountNav user={session.user} />
      )}
    </nav>
  );
}
