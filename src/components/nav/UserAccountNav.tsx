"use client";

import Link from "next/link";
import { type User } from "next-auth";
import { signOut } from "next-auth/react";

import { trpc } from "~/lib/trpc/client";
import { useActiveProfile } from "~/hooks/useActiveProfile";
import { cn } from "~/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Icons } from "~/components/common/icons";
import { useQuerySsr } from "~/hooks/useQuerySsr";

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "name" | "image" | "email">;
}

const triggerClasses =
  "inline-flex items-center justify-center rounded-lg text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function UserAccountNav({ user }: UserAccountNavProps) {
  const { activeProfile, setActiveProfile } = useActiveProfile();

  const { data: allProfiles } = useQuerySsr(trpc.userRouter.getAllProfiles);

  return (
    <div className="flex items-center gap-1">
      <DropdownMenu>
        <DropdownMenuTrigger className={cn(triggerClasses, "h-11 gap-1 px-3")}>
          <span className="max-w-[12ch] truncate">{activeProfile?.name}</span>
          <Icons.chevronDown className="h-4 w-4 shrink-0" />
          <span className="sr-only">Switch profile</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {allProfiles?.map((profile) => (
            <DropdownMenuItem
              asChild
              key={profile.id}
              onClick={() => setActiveProfile(profile)}
            >
              <span
                aria-current={
                  profile.id === activeProfile?.id ? "true" : undefined
                }
                className={cn(
                  "flex w-full items-center",
                  profile.id === activeProfile?.id &&
                    "font-semibold text-secondary-foreground"
                )}
              >
                {profile.name}
                {profile.id === activeProfile?.id && (
                  <Icons.check className="ml-auto h-4 w-4" />
                )}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            triggerClasses,
            "h-11 w-11 rounded-full bg-secondary text-secondary-foreground hover:bg-accent"
          )}
        >
          <Icons.user className="h-6 w-6" />
          <span className="sr-only">Account menu</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {user.name && <p className="font-medium">{user.name}</p>}
              {user.email && (
                <p className="text-muted-foreground w-[200px] truncate text-sm">
                  {user.email}
                </p>
              )}
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/user">Manage</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={(event) => {
              event.preventDefault();
              void signOut({
                callbackUrl: `${window.location.origin}`,
              });
            }}
          >
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
