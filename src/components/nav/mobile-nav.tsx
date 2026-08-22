"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

import { Icons } from "~/components/common/icons";
import { siteConfig } from "~/config/site";
import { useLockBody } from "~/hooks/use-lock-body";
import { cn } from "~/lib/utils";
import { type MainNavItem } from "~/types";

interface MobileNavProps {
  items: MainNavItem[];
  children?: React.ReactNode;

  onClose?: () => void;
}

function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileNav({ items, children, onClose }: MobileNavProps) {
  useLockBody();

  const pathname = usePathname() ?? "";

  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const firstLink = panelRef.current?.querySelector<HTMLElement>("a, button");
    firstLink?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 top-16 z-50 md:hidden">
      <div
        className="fixed inset-0 top-16 bg-foreground/40"
        aria-hidden="true"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        id="mobile-nav"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        className="relative z-20 m-4 grid max-h-[calc(100vh-6rem)] auto-rows-max gap-1 overflow-auto rounded-2xl border border-border bg-popover p-4 text-popover-foreground shadow-lg animate-in slide-in-from-top-2"
      >
        <Link
          href="/"
          className={cn(
            "flex h-11 items-center space-x-2 rounded-lg px-3 font-medium",
            isActive(pathname, "/")
              ? "bg-secondary text-secondary-foreground"
              : "hover:bg-accent hover:text-accent-foreground"
          )}
          onClick={onClose}
        >
          <Icons.logo />
          <span>{siteConfig.name}</span>
        </Link>
        <nav
          className="grid grid-flow-row auto-rows-max"
          aria-label="Main"
        >
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.disabled ? "#" : item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
              className={cn(
                "flex h-11 w-full items-center rounded-lg px-3 text-base font-medium transition-colors",
                isActive(pathname, item.href)
                  ? "bg-secondary text-secondary-foreground"
                  : "text-foreground hover:bg-accent hover:text-accent-foreground",
                item.disabled && "cursor-not-allowed opacity-60 hover:bg-transparent"
              )}
              onClick={onClose}
            >
              {item.title}
            </Link>
          ))}
        </nav>
        {children}
      </div>
    </div>
  );
}
