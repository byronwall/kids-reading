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

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "name" | "image" | "email">;
}

export function UserAccountNav({ user }: UserAccountNavProps) {
  const { activeProfile, setActiveProfile } = useActiveProfile();

  const { data: allProfiles } = trpc.userRouter.getAllProfiles.useQuery();

  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex p-1">
            {activeProfile?.name}
            <Icons.chevronDown className="h-6 w-6" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {allProfiles?.map((profile) => (
            <DropdownMenuItem
              asChild
              key={profile.id}
              onClick={() => setActiveProfile(profile)}
            >
              <span
                className={cn({
                  "bg-slate-400": profile.id === activeProfile?.id,
                })}
              >
                {profile.name}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="bg-primary-foreground flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
            <Icons.user className="h-6 w-6" />
          </div>
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
