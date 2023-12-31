"use client";

import { ButtonLoading } from "~/components/common/ButtonLoading";
import { Icons } from "~/components/common/icons";
import { cn } from "~/lib/utils";
import { useLessonActions } from "~/hooks/useLessonActions";
import { type DetailedLesson } from "~/types/models";
import { useSentenceCreatorStore } from "~/stores/sentenceCreatorStore";
import { Button } from "~/components/ui/button";

export function LessonDetail({
  lesson,
  wordsNotInSentences,
}: {
  lesson: DetailedLesson;
  wordsNotInSentences: DetailedLesson["words"];
}) {
  const isFocused = lesson.ProfileLessonFocus[0]?.isFocused ?? false;
  const hasLinkedProfile = lesson.ProfileLessonFocus[0]?.profileId != null;

  const {
    handleToggleFocus,
    handleLinkProfileToLesson,
    isLoadingLinkProfileToLesson,
    isLoadingToggleFocus,
  } = useLessonActions(lesson.id);

  const openWithTargetWords = useSentenceCreatorStore(
    (s) => s.openWithTargetWords
  );

  const handleCreateSentences = (words: DetailedLesson["words"]) => {
    openWithTargetWords(words.map((w) => w.word));
  };

  const lessonTotalGood = lesson.words.reduce((acc, c) => acc + c.goodCount, 0);
  const lessonTotalBad = lesson.words.reduce((acc, c) => acc + c.badCount, 0);

  return (
    <div
      key={lesson.id}
      className={cn("flex gap-2 rounded bg-gray-100 p-1", {
        "bg-gray-200": hasLinkedProfile,
      })}
    >
      <h3 className="text-xl font-semibold">{lesson.name}</h3>
      <p className="text-base">{lesson.description}</p>
      <div className="flex items-center justify-center gap-4">
        <p className="text-xl text-blue-800">+{lessonTotalGood}</p>
        <p className={cn("text-xl ", { "text-red-800": lessonTotalBad > 0 })}>
          -{lessonTotalBad}
        </p>
      </div>
      <div>
        {!hasLinkedProfile && (
          <ButtonLoading
            variant={"outline"}
            onClick={handleLinkProfileToLesson}
            isLoading={isLoadingLinkProfileToLesson}
          >
            <Icons.userPlus className="h-4 w-4" />
          </ButtonLoading>
        )}
        {hasLinkedProfile && (
          <ButtonLoading
            variant={"outline"}
            onClick={() => handleToggleFocus(!isFocused)}
            isLoading={isLoadingToggleFocus}
            size="sm"
          >
            <Icons.star
              fill={isFocused ? "currentColor" : "none"}
              className="h-4 w-4 text-yellow-500"
            />
          </ButtonLoading>
        )}
        <Button
          variant={"outline"}
          onClick={() =>
            handleCreateSentences(
              // only create sentences for words that are not already in sentences
              lesson.words.filter((w) =>
                wordsNotInSentences.some((w2) => w2.id === w.id)
              )
            )
          }
          title="Create sentences for all words in this lesson"
        >
          <Icons.listPlus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-1">
        {lesson.words.map((word) => (
          <div key={word.id} className="rounded bg-gray-100 p-1">
            <div
              key={word.id}
              className={`rounded bg-gray-100 p-1 ${
                wordsNotInSentences.some((w) => w.id === word.id)
                  ? "border border-red-500"
                  : ""
              }`}
            >
              <p className="text-base">{word.word}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
