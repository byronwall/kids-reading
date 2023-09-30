"use client";

import Link from "next/link";

import { trpc } from "~/lib/trpc/client";
import { useQuerySsr } from "~/hooks/useQuerySsr";

export function GlobalNotifications() {
  const { data: awards } = useQuerySsr(trpc.awardRouter.getAllAwardsForProfile);

  const hasUnclaimedAwards = awards?.some((award) => !award.imageId) ?? false;

  if (!hasUnclaimedAwards) return null;

  return (
    <div className="my-2 bg-yellow-300 p-2 text-yellow-800">
      <p className="text-center">
        <Link href="/awards">
          <strong>You have unclaimed awards!</strong> Go to the awards page to
          claim them.
        </Link>
      </p>
    </div>
  );
}
