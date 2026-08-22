import { TRPCError } from "@trpc/server";

type ManagedSentence = {
  id: string;
  isManaged: boolean;
  lessonSentences?: ReadonlyArray<unknown>;
};

export function isManagedSentence(sentence: ManagedSentence) {
  return sentence.isManaged || (sentence.lessonSentences?.length ?? 0) > 0;
}

export function assertSentenceCanBeMutated(
  sentence: ManagedSentence,
  action: "edited" | "deleted" | "updated"
) {
  if (isManagedSentence(sentence)) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `Managed curriculum sentence ${sentence.id} cannot be ${action}. Edit the Git-managed curriculum source instead.`,
    });
  }
}

export function assertWordCanBeMutated(
  wordId: string,
  isUsedByManagedLessonWord: boolean
) {
  if (isUsedByManagedLessonWord) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `Word ${wordId} is used by managed curriculum content and cannot be deleted. Edit the Git-managed curriculum source instead.`,
    });
  }
}
