import Link from "next/link";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export function UserMenuOrLogin() {
  return (
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
  );
}
