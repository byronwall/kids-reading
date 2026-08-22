"use client";

import Link from "next/link";
import { useWindowSize } from "usehooks-ts";
import Confetti from "react-confetti";

import { trpc } from "~/lib/trpc/client";
import { useQuerySsr } from "~/hooks/useQuerySsr";
import { useActiveProfile } from "~/hooks/useActiveProfile";

export function GlobalNotifications() {
  const { activeProfile } = useActiveProfile();

  const { data: awards = [] } = useQuerySsr(
    trpc.awardRouter.getAllAwardsForProfile,
    undefined,
    { enabled: Boolean(activeProfile?.id) }
  );

  const hasUnclaimedAwards = awards?.some((award) => !award.imageId) ?? false;

  const { width, height } = useWindowSize();

  if (!hasUnclaimedAwards) return null;

  const confettiWordTarget = activeProfile?.confettiWordTarget;
  const showConfetti = awards.some(
    (award) =>
      award.awardType === "WORD_COUNT" &&
      award.awardValue === confettiWordTarget &&
      !award.imageId
  );

  return (
    <div
      role="status"
      className="w-full border-b border-celebration-border bg-celebration-surface px-4 py-3 text-sm text-celebration"
    >
      <p className="text-center">
        <Link
          href="/awards"
          className="rounded-lg font-semibold underline decoration-celebration/40 underline-offset-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-celebration focus-visible:ring-offset-2 focus-visible:ring-offset-celebration-surface hover:decoration-celebration"
        >
          <strong>You have unclaimed awards!</strong> Go to the awards page to
          claim them.
        </Link>
      </p>

      {showConfetti && <Confetti width={width} height={height} />}
    </div>
  );
}
