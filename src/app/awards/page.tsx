"use client";

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
import { AwardList } from "~/components/awards/AwardList";
import { AwardImageChoice } from "~/components/awards/AwardImageChoice";

export type Award =
  RouterOutputs["awardRouter"]["getAllAwardsForProfile"][number];

export type AwardImage =
  RouterOutputs["awardRouter"]["getAllAwardImages"][number];

export default function AwardsPage() {
  const { data: awards } = useQuerySsr(trpc.awardRouter.getAllAwardsForProfile);

  const { data: allAwardImages } = useQuerySsr(
    trpc.awardRouter.getAllAwardImages,
    {
      shouldLimitToProfile: true,
    }
  );

  const { data: currentWordCount } =
    trpc.awardRouter.getProfileWordCount.useQuery();

  const { data: currentSentenceCount } =
    trpc.awardRouter.getProfileSentenceCount.useQuery();

  const wordCountAwards = awards?.filter(
    (award) => award.awardType === "WORD_COUNT"
  );

  const sentenceCountAwards = awards?.filter(
    (award) => award.awardType === "SENTENCE_COUNT"
  );

  const wordMasteryAwards = awards?.filter(
    (award) => award.awardType === "WORD_MASTERY"
  );

  const hasUnclaimedAwards = awards?.some((award) => !award.imageId) ?? false;

  // next word award is multiple of 100
  const nextWordAward = Math.ceil(((currentWordCount ?? 0) + 1) / 100) * 100;

  // next sentence award is multiple of 10
  const nextSentenceAward =
    Math.ceil(((currentSentenceCount ?? 0) + 1) / 10) * 10;

  return (
    <div className="flex flex-col items-center gap-4">
      <h1>Awards</h1>
      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Word count awards</CardTitle>
          <CardDescription>
            Word count awards are given every 100 correct words.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Current word count: {currentWordCount}</p>
          <p>Next award at: {nextWordAward}</p>
          <AwardList awards={wordCountAwards} />
        </CardContent>
      </Card>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Sentence count awards</CardTitle>
          <CardDescription>
            Awards are given every 10 sentences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Current sentence count: {currentSentenceCount}</p>
          <p>Next award at: {nextSentenceAward}</p>
          <AwardList awards={sentenceCountAwards} />
        </CardContent>
      </Card>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Word mastery awards</CardTitle>
          <CardDescription>
            Given when the interval on a word reaches the max: 60d.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AwardList awards={wordMasteryAwards} />
        </CardContent>
      </Card>

      {hasUnclaimedAwards && (
        <Card className="max-w-4xl">
          <CardHeader>
            <CardTitle>Pick new awards</CardTitle>
            <CardDescription>
              Click an image to add to your awards.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {(allAwardImages ?? []).map((image) => (
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
    </div>
  );
}
