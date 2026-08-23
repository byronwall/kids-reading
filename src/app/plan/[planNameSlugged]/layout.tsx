"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { trpc } from "~/lib/trpc/client";
import { Icons } from "~/components/common/icons";
import { useQuerySsr } from "~/hooks/useQuerySsr";
import { cn } from "~/lib/utils";
import { slugify } from "~/lib/utils";

type DashLink = {
  href: string;
  label: string;
  icon?: keyof typeof Icons;
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // this includes the leading slash
  const path = usePathname();

  // get all learning plans to build side bar
  const { data: learningPlans } = useQuerySsr(
    trpc.planRouter.getAllLearningPlans
  );

  const links: DashLink[] =
    learningPlans?.map((learningPlan) => ({
      href: slugify(`/plan/${learningPlan.canonicalId ?? learningPlan.name}`),
      label: learningPlan.name,
      icon: "circle",
    })) ?? [];

  return (
    <div className="grid-sidebar w-full text-left">
      <div
        className="top-0 flex flex-col gap-1 overflow-y-auto sm:sticky"
        style={{
          maxHeight: "calc(100vh - 4rem)",
        }}
      >
        <Link
          href={"/plan"}
          className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700"
        >
          <span className="group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-amber-950 transition-colors hover:bg-amber-50 hover:text-amber-950">
            <Icons.arrowLeft className="mr-2 h-4 w-4" />
            <span>Back to all plans</span>
          </span>
        </Link>

        <nav aria-label="Learning plans">
          {links.length > 0 && (
            <p className="mt-3 px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-stone-400">
              Plans
            </p>
          )}
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
                      : "text-amber-950 hover:bg-amber-50 hover:text-amber-950"
                  )}
                >
                  <Icon
                    className={cn(
                      "mr-2 h-3.5 w-3.5 shrink-0",
                      path === href
                        ? "text-amber-600"
                        : "text-stone-400 group-hover:text-amber-700"
                    )}
                  />
                  <span>{label}</span>
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
