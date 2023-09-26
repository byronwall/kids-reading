"use client";
import { trpc } from "~/app/_trpc/client";

export function useSentenceAdder() {
  const utils = trpc.useContext();
  const addSentencesMutation =
    trpc.sentencesRouter.addSentencesAndWords.useMutation();

  const handleAddSentences = async (sentences: string[]) => {
    await addSentencesMutation.mutateAsync({
      sentences,
    });

    // invalidate the query so that it will refetch
    await utils.sentencesRouter.getAllSentences.invalidate();
    await utils.planRouter.getSingleLearningPlan.invalidate();
  };

  return {
    handleAddSentences,
    isAddingSentences: addSentencesMutation.isLoading,
  };
}
