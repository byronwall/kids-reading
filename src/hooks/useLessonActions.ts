"use client";

import { trpc } from "~/app/_trpc/client";
import { type DetailedLesson } from "~/types/models";

export function useLessonActions(lessonId: string) {
  const utils = trpc.useContext();

  const linkProfileToLessonMutation =
    trpc.planRouter.linkProfileToLesson.useMutation();

  const toggleFocusMutation =
    trpc.planRouter.setProfileLessonFocus.useMutation();

  const handleToggleFocus = async (isFocused: boolean) => {
    await toggleFocusMutation.mutateAsync({
      lessonId,
      isFocused,
    });

    // invalidate the query so that it will refetch
    await utils.planRouter.getSingleLearningPlan.invalidate();
  };

  const handleLinkProfileToLesson = async () => {
    await linkProfileToLessonMutation.mutateAsync({
      lessonId,
    });

    // invalidate the query so that it will refetch
    await utils.planRouter.getSingleLearningPlan.invalidate();
  };

  const createSentencesMutation =
    trpc.sentencesRouter.generateAndAddNewSentencesForWords.useMutation();

  const handleCreateSentences = async (words: DetailedLesson["words"]) => {
    await createSentencesMutation.mutateAsync(words.map((c) => c.word));

    // invalidate the query so that it will refetch
    await Promise.all([
      utils.planRouter.getAllLearningPlans.invalidate(),
      utils.planRouter.getSingleLearningPlan.invalidate(),
      utils.sentencesRouter.getAllSentences.invalidate(),
    ]);
  };

  const isLoadingLinkProfileToLesson = linkProfileToLessonMutation.isLoading;
  const isLoadingToggleFocus = toggleFocusMutation.isLoading;
  const isLoadingCreateSentences = createSentencesMutation.isLoading;

  return {
    handleToggleFocus,
    isLoadingLinkProfileToLesson,
    handleLinkProfileToLesson,
    isLoadingToggleFocus,
    handleCreateSentences,
    isLoadingCreateSentences,
  };
}
