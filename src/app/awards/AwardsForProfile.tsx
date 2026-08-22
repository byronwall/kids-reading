"use client";

import { AwardList } from "~/components/awards/AwardList";
import { trpc } from "~/lib/trpc/client";
import { useQuerySsr } from "~/hooks/useQuerySsr";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { useActiveProfile } from "~/hooks/useActiveProfile";

function StatBlock({ label, value }: { label: string; value: number | undefined }) {
  return (
    <div className="flex flex-col items-center gap-1 px-4 py-4">
      <span className="text-3xl font-semibold tabular-nums text-amber-950">
        {value ?? 0}
      </span>
      <span className="text-xs font-medium uppercase tracking-wide text-amber-900">
        {label}
      </span>
    </div>
  );
}

export function AwardsForProfile() {
  const { activeProfile } = useActiveProfile();
  const hasActiveProfile = Boolean(activeProfile?.id);
  const { data: awards } = useQuerySsr(trpc.awardRouter.getAllAwardsForProfile);

  const { data: currentWordCount } =
    trpc.awardRouter.getProfileWordCount.useQuery(undefined, { enabled: hasActiveProfile });

  const { data: currentSentenceCount } =
    trpc.awardRouter.getProfileSentenceCount.useQuery(undefined, { enabled: hasActiveProfile });

  if (!hasActiveProfile) {
    return (
      <p className="rounded-xl border border-dashed border-amber-300 bg-amber-50/50 px-6 py-8 text-center text-sm text-amber-950">
        Select a learner to view awards.
      </p>
    );
  }

  const wordCountAwards = awards?.filter(
    (award) => award.awardType === "WORD_COUNT"
  );

  const sentenceCountAwards = awards?.filter(
    (award) => award.awardType === "SENTENCE_COUNT"
  );

  const wordMasteryAwards = awards?.filter(
    (award) => award.awardType === "WORD_MASTERY"
  );

  // next word award is multiple of 100
  const nextWordAward = Math.ceil(((currentWordCount ?? 0) + 1) / 100) * 100;

  // next sentence award is multiple of 10
  const nextSentenceAward =
    Math.ceil(((currentSentenceCount ?? 0) + 1) / 10) * 10;

  const recentFiftyAwards = awards?.slice(0, 30);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="grid grid-cols-3 divide-x divide-amber-200 rounded-xl border border-amber-200 bg-amber-50/60">
        <StatBlock label="Words" value={currentWordCount} />
        <StatBlock label="Sentences" value={currentSentenceCount} />
        <StatBlock label="Mastered" value={wordMasteryAwards?.length} />
      </div>

      <Tabs defaultValue="recent">
        <TabsList>
          <TabsTrigger value="recent">Recent First</TabsTrigger>
          <TabsTrigger value="grouped">Grouped</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="mt-4">
          <section>
            <h2 className="text-xl font-semibold tracking-tight text-stone-900">
              Recent Awards
            </h2>
            <div className="mt-4">
              <AwardList awards={recentFiftyAwards} />
            </div>
          </section>
        </TabsContent>

        <TabsContent value="grouped" className="mt-4">
          <div className="flex flex-col gap-10">
            <section>
              <h2 className="border-b pb-2 text-xl font-semibold tracking-tight text-stone-900">
                Word count awards
              </h2>
              <p className="mt-2 text-sm text-stone-600">
                Word count awards are given every 100 correct words. Current
                word count: {currentWordCount}. Next award at: {nextWordAward}.
              </p>
              <div className="mt-4">
                <AwardList awards={wordCountAwards} />
              </div>
            </section>

            <section>
              <h2 className="border-b pb-2 text-xl font-semibold tracking-tight text-stone-900">
                Sentence count awards
              </h2>
              <p className="mt-2 text-sm text-stone-600">
                Awards are given every 10 sentences. Current sentence count:{" "}
                {currentSentenceCount}. Next award at: {nextSentenceAward}.
              </p>
              <div className="mt-4">
                <AwardList awards={sentenceCountAwards} />
              </div>
            </section>

            <section>
              <h2 className="border-b pb-2 text-xl font-semibold tracking-tight text-stone-900">
                Word mastery awards
              </h2>
              <p className="mt-2 text-sm text-stone-600">
                Given when the interval on a word reaches the max: 60d.
              </p>
              <div className="mt-4">
                <AwardList awards={wordMasteryAwards} />
              </div>
            </section>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
