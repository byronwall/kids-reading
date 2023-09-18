"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icons } from "~/components/icons";
import { cn } from "~/utils";

type DashLink = {
  href: string;
  label: string;
  icon?: keyof typeof Icons;
};

// TODO: improve the icons
const links: DashLink[] = [
  { href: "/admin", label: "Home", icon: "check" },
  { href: "/admin/sentences", label: "Sentences", icon: "logo" },
  { href: "/admin/words", label: "Words", icon: "pencil" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // this includes the leading slash
  const path = usePathname();

  return (
    <div className="grid-sidebar w-full">
      <div className="flex flex-col gap-2 text-left">
        {links.map(({ href, label, icon }) => {
          const Icon = Icons[icon ?? "arrowRight"];

          return (
            <Link href={href} key={href}>
              <span
                className={cn(
                  "hover:bg-accent hover:text-accent-foreground group flex items-center rounded-md px-3 py-2 text-sm font-medium",
                  path === href ? "bg-accent" : "transparent"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{label}</span>
              </span>
            </Link>
          );
        })}
      </div>
      <div className="max-w-3xl">{children}</div>
    </div>
  );
}
