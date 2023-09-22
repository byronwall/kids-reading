"use client";

import { ButtonLoading } from "~/components/ButtonLoading";
import { Icons } from "~/components/icons";
import { cn } from "~/utils";
import { useLessonActions } from "~/hooks/useLessonActions";
import { type DetailedLesson } from "~/types/models";

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

  return (
    <div
      key={lesson.id}
      className={cn("flex gap-2 rounded bg-gray-100 p-1", {
        "bg-gray-200": hasLinkedProfile,
      })}
    >
      <h3 className="text-xl font-semibold">{lesson.name}</h3>
      <p className="text-base">{lesson.description}</p>
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
