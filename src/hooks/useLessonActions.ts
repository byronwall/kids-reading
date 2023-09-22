"use client";

import { trpc } from "~/app/_trpc/client";

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

  const isLoadingLinkProfileToLesson = linkProfileToLessonMutation.isLoading;
  const isLoadingToggleFocus = toggleFocusMutation.isLoading;

  return {
    handleToggleFocus,
    handleLinkProfileToLesson,
    isLoadingLinkProfileToLesson,
    isLoadingToggleFocus,
  };
}
