"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Icons } from "~/components/common/icons";
import { siteConfig } from "~/config/site";
import { cn } from "~/lib/utils";
import { type MainNavItem } from "~/types";

import { MobileNav } from "./mobile-nav";

interface MainNavProps {
  items?: MainNavItem[];
  children?: React.ReactNode;
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MainNav({ items, children }: MainNavProps) {
  const pathname = usePathname() ?? "";
  const [showMobileMenu, setShowMobileMenu] = React.useState<boolean>(false);

  return (
    <div className="flex flex-1 items-center justify-between gap-6 md:flex-initial md:justify-start md:gap-10">
      <Link
        href="/"
        className="flex items-center space-x-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label={`${siteConfig.name} home`}
      >
        <Icons.logo />
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      {items?.length ? (
        <nav className="hidden gap-2 md:flex" aria-label="Main">
          {items?.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? "#" : item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={cn(
                "flex h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                isActive(pathname, item.href)
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                item.disabled && "cursor-not-allowed opacity-60 hover:bg-transparent"
              )}
            >
              {item.title}
            </Link>
          ))}
        </nav>
      ) : null}

      <button
        type="button"
        className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background md:hidden"
        aria-expanded={showMobileMenu}
        aria-controls="mobile-nav"
        aria-label={showMobileMenu ? "Close menu" : "Open menu"}
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        {showMobileMenu ? <Icons.close /> : <Icons.menu />}
      </button>

      {showMobileMenu && items && (
        <MobileNav
          items={items}
          onClose={() => setShowMobileMenu(false)}
        >
          {children}
        </MobileNav>
      )}
    </div>
  );
}
