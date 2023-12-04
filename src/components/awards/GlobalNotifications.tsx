"use client";

import Link from "next/link";
import { useWindowSize } from "usehooks-ts";
import Confetti from "react-confetti";

import { trpc } from "~/lib/trpc/client";
import { useQuerySsr } from "~/hooks/useQuerySsr";
import { useActiveProfile } from "~/hooks/useActiveProfile";

export function GlobalNotifications() {
  const { data: awards = [] } = useQuerySsr(
    trpc.awardRouter.getAllAwardsForProfile
  );

  const { activeProfile } = useActiveProfile();

  const hasUnclaimedAwards = awards?.some((award) => !award.imageId) ?? false;

  const { width, height } = useWindowSize();

  if (!hasUnclaimedAwards) return null;

  const confettiWordTarget = activeProfile?.confettiWordTarget;
  const showConfetti = awards.some(
    (award) =>
      award.awardType === "WORD_COUNT" &&
      award.awardValue === confettiWordTarget
  );

  return (
    <div className="my-2 bg-yellow-300 p-2 text-yellow-800">
      <p className="text-center">
        <Link href="/awards">
          <strong>You have unclaimed awards!</strong> Go to the awards page to
          claim them.
        </Link>
      </p>

      {showConfetti && <Confetti width={width} height={height} />}
    </div>
  );
}
