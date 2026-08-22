"use client";

import { useEffect, useState } from "react";

import { Icons } from "~/components/common/icons";
import { trpc } from "~/lib/trpc/client";
import { type RouterOutputs } from "~/utils/api";
import { useQuerySsr } from "~/hooks/useQuerySsr";
import { AwardImageChoice } from "~/components/awards/AwardImageChoice";
import { Button } from "~/components/ui/button";

import { AwardsForProfile } from "./AwardsForProfile";

export type Award =
  RouterOutputs["awardRouter"]["getAllAwardsForProfile"][number];

export type AwardImage =
  RouterOutputs["awardRouter"]["getAllAwardImages"][number];

export default function AwardsPage() {
  const { data: awards } = useQuerySsr(trpc.awardRouter.getAllAwardsForProfile);

  const { data: allAwardImages = [] } = useQuerySsr(
    trpc.awardRouter.getAllAwardImages,
    {
      shouldLimitToProfile: true,
    }
  );

  const hasUnclaimedAwards = awards?.some((award) => !award.imageId) ?? false;

  const [awardImagesShuffled, setAwardImagesShuffled] = useState<AwardImage[]>(
    allAwardImages.slice(0, 50)
  );

  useEffect(() => {
    setAwardImagesShuffled(allAwardImages.slice(0, 50));
  }, [allAwardImages]);

  const unclaimedAwards = awards?.filter((award) => !award.imageId) ?? [];

  return (
    <div className="w-full max-w-4xl text-left">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          Awards
        </h1>
        <p className="mt-2 max-w-prose text-base text-stone-600">
          Earned by practicing words and sentences.
        </p>
      </header>

      {hasUnclaimedAwards && (
        <section className="rounded-xl border border-amber-200 bg-amber-50/60 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-stone-900">
                Pick new awards
              </h2>
              <p className="mt-1 text-sm text-stone-600">
                Click an image to add to your awards.
              </p>
            </div>
            <Button
              onClick={() => {
                setAwardImagesShuffled(
                  allAwardImages?.sort(() => Math.random() - 0.5).slice(0, 50)
                );
              }}
              variant="outline"
              aria-label="Show different award images"
            >
              <Icons.shuffle className="mr-2 h-4 w-4" />
              Shuffle images
            </Button>
          </div>

          <div className="sticky top-0 z-10 mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/95 px-3 py-2 backdrop-blur-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-amber-800">
              Waiting for a picture
            </span>
            {unclaimedAwards.map((award) => (
              <span
                key={award.id}
                className="rounded-full border border-amber-300 bg-white px-2.5 py-0.5 text-sm font-medium text-stone-800"
              >
                {getSimpleTextForAward(award)}
              </span>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {(awardImagesShuffled ?? []).map((image) => (
              <AwardImageChoice
                key={image.id}
                image={image}
                shouldClickToClaim={hasUnclaimedAwards}
              />
            ))}
          </div>
        </section>
      )}

      {!hasUnclaimedAwards && <AwardsForProfile />}
    </div>
  );
}

function getSimpleTextForAward(award: Award) {
  switch (award.awardType) {
    case "WORD_COUNT":
      return `${award.awardValue} words`;
    case "SENTENCE_COUNT":
      return `${award.awardValue} sentences`;
    case "WORD_MASTERY":
      return `${award.word?.word}`;
  }
}
