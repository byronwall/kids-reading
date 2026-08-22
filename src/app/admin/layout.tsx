"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Icons } from "~/components/common/icons";
import { cn } from "~/lib/utils";

type DashLink = {
  href: string;
  label: string;
  icon?: keyof typeof Icons;
};

const links: DashLink[] = [
  { href: "/admin", label: "Home", icon: "check" },
  { href: "/admin/sentences", label: "Sentences", icon: "book" },
  { href: "/admin/words", label: "Words", icon: "pencil" },
  { href: "/admin/awards", label: "Awards", icon: "trophy" },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // this includes the leading slash
  const path = usePathname();

  return (
    <div className="grid-sidebar w-full text-left">
      <nav
        aria-label="Admin sections"
        className="top-0 flex flex-col gap-1 text-left sm:sticky"
      >
        {links.map(({ href, label, icon }) => {
          const Icon = Icons[icon ?? "arrowRight"];

          return (
            <Link
              href={href}
              key={href}
              className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700"
            >
              <span
                className={cn(
                  "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  path === href
                    ? "bg-amber-100 text-amber-950"
                    : "text-stone-600 hover:bg-amber-50 hover:text-amber-950"
                )}
              >
                <Icon
                  className={cn(
                    "mr-2 h-4 w-4",
                    path === href ? "text-amber-600" : "text-stone-400"
                  )}
                />
                <span>{label}</span>
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="min-w-0 max-w-3xl">{children}</div>
    </div>
  );
}
