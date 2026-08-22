"use client";

import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

import { Button } from "~/components/ui/button";
import { UserAccountNav } from "~/components/nav/UserAccountNav";

export function UserMenuOrLogin() {
  const { data: session } = useSession();

  const needsAuth = session === undefined || session === null;

  return (
    <nav aria-label="Account" className="flex items-center">
      {needsAuth ? (
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => signIn()}>
            Login
          </Button>
          <Button asChild>
            <Link href="/register">Sign up</Link>
          </Button>
        </div>
      ) : (
        <UserAccountNav user={session.user} />
      )}
    </nav>
  );
}
