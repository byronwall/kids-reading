"use client";

import { trpc } from "~/app/_trpc/client";

export default function AwardsPage() {
  const { data: awards } = trpc.awardRouter.getAllAwardsForProfile.useQuery();

  const { data: currentWordCount } =
    trpc.awardRouter.getProfileWordCount.useQuery();

  const { data: currentSentenceCount } =
    trpc.awardRouter.getProfileSentenceCount.useQuery();

  const oneTimeUpdate = trpc.awardRouter.__TEMP__updateGroupIds.useMutation();

  return (
    <div>
      <h1>Awards</h1>
      <pre>{JSON.stringify(awards, null, 2)}</pre>

      <button
        onClick={() => {
          void oneTimeUpdate.mutateAsync();
        }}
      >
        one time update
      </button>

      <h2>Word count awards</h2>

      <p>Current word count: {currentWordCount}</p>
      <p>Next award at: {12}</p>

      <h2>Sentence count awards</h2>

      <p>Current sentence count: {currentSentenceCount}</p>
      <p>Next award at: {12}</p>

      <h2>Word mastery awards</h2>
      <h2>Lesson master awards</h2>
    </div>
  );
}
