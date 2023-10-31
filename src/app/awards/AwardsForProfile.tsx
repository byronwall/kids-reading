"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { AwardList } from "~/components/awards/AwardList";
import { trpc } from "~/lib/trpc/client";
import { useQuerySsr } from "~/hooks/useQuerySsr";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export function AwardsForProfile() {
  const { data: awards } = useQuerySsr(trpc.awardRouter.getAllAwardsForProfile);

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

  // next word award is multiple of 100
  const nextWordAward = Math.ceil(((currentWordCount ?? 0) + 1) / 100) * 100;

  // next sentence award is multiple of 10
  const nextSentenceAward =
    Math.ceil(((currentSentenceCount ?? 0) + 1) / 10) * 10;

  const recentFiftyAwards = awards?.slice(0, 30);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Words</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">
            {currentWordCount}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sentences</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">
            {currentSentenceCount}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Mastered</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold">
            {wordMasteryAwards?.length}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="recent">
        <TabsList>
          <TabsTrigger value="recent">Recent First</TabsTrigger>
          <TabsTrigger value="grouped">Grouped</TabsTrigger>
        </TabsList>

        <TabsContent value="recent">
          <Card className="max-w-4xl">
            <CardHeader>
              <CardTitle>Recent Awards</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <AwardList awards={recentFiftyAwards} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="grouped">
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
