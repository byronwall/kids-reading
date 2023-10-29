"use client";

import { useEffect, useState } from "react";

import { Icons } from "~/components/common/icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { trpc } from "~/lib/trpc/client";
import { type RouterOutputs } from "~/utils/api";
import { useQuerySsr } from "~/hooks/useQuerySsr";
import { AwardImageChoice } from "~/components/awards/AwardImageChoice";
import { Badge } from "~/components/ui/badge";
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

  return (
    <div className="flex flex-col items-center gap-4">
      <h1>Awards</h1>

      {hasUnclaimedAwards && (
        <Card className="max-w-4xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-4">
              Pick new awards
              <Button
                onClick={() => {
                  setAwardImagesShuffled(
                    allAwardImages?.sort(() => Math.random() - 0.5).slice(0, 50)
                  );
                }}
                variant={"outline"}
              >
                <Icons.shuffle className="h-6 w-6" />
              </Button>
            </CardTitle>
            <CardDescription>
              Click an image to add to your awards.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="sticky top-0 z-10 flex flex-wrap justify-center gap-2 bg-gray-100 p-2">
              {awards
                ?.filter((award) => !award.imageId)
                .map((award) => (
                  <Badge key={award.id} className="text-xl">
                    {getSimpleTextForAward(award)}
                  </Badge>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {(awardImagesShuffled ?? []).map((image) => (
                <AwardImageChoice
                  key={image.id}
                  image={image}
                  shouldClickToClaim={hasUnclaimedAwards}
                />
              ))}
            </div>
          </CardContent>
        </Card>
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
