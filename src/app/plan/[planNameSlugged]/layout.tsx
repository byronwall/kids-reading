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
      href: slugify(`/plan/${learningPlan.name}`),
      label: learningPlan.name,
      icon: "circle",
    })) ?? [];

  return (
    <div className="grid-sidebar w-full">
      <div
        className=" top-0 flex flex-col gap-2 overflow-y-auto text-left sm:sticky"
        style={{
          maxHeight: "calc(100vh - 4rem)",
        }}
      >
        <Link href={"/plan"}>
          <span
            className={cn(
              "hover:text-accent-foreground group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100"
            )}
          >
            <Icons.arrowLeft className="mr-2 h-4 w-4" />
            <span>Back to all plans</span>
          </span>
        </Link>

        <div className="hidden sm:block">
          {links.map(({ href, label, icon }) => {
            const Icon = Icons[icon ?? "arrowRight"];

            return (
              <Link href={href} key={href}>
                <span
                  className={cn(
                    path === href ? "bg-gray-200" : "transparent",
                    "hover:text-accent-foreground group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100"
                  )}
                >
                  <Icon className="mr-2 h-4 w-4 shrink-0" />
                  <span>{label}</span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
