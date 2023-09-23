"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { trpc } from "~/app/_trpc/client";
import { Icons } from "~/components/icons";
import { cn, slugify } from "~/utils";

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
  const { data: learningPlans } =
    trpc.planRouter.getAllLearningPlans.useQuery();

  const links: DashLink[] =
    learningPlans?.map((learningPlan) => ({
      href: slugify(`/plan/${learningPlan.name}`),
      label: learningPlan.name,
      icon: "circle",
    })) ?? [];

  return (
    <div className="grid-sidebar w-full">
      <div
        className="sticky top-0 flex flex-col gap-2 overflow-y-auto text-left"
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
      <div className="flex-1">{children}</div>
    </div>
  );
}
