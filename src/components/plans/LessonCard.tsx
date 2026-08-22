"use client";

import { cn } from "~/lib/utils";
import { type LearningPlan } from "~/types/models";

export type Lesson = LearningPlan["lessons"][0];

export function LessonCard({
  lesson,
  showProgress = true,
}: {
  lesson: Lesson;
  showProgress?: boolean;
}) {
  const lessonTotalGood = lesson.words.reduce((acc, c) => acc + c.goodCount, 0);
  const lessonTotalBad = lesson.words.reduce((acc, c) => acc + c.badCount, 0);

  const isFocused = lesson.ProfileLessonFocus[0]?.isFocused ?? false;
  const hasLinkedProfile = lesson.ProfileLessonFocus[0]?.profileId != null;
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-3 rounded-lg border px-3 py-2",
        isFocused
          ? "border-amber-300 bg-amber-50"
          : hasLinkedProfile
            ? "border-green-200 bg-green-50/70"
            : "border-stone-100 bg-stone-50"
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-stone-900">
          {lesson.name}
        </p>
        {lesson.description && (
          <p className="truncate text-xs text-stone-500">{lesson.description}</p>
        )}
      </div>
      {showProgress && (
        <div className="flex shrink-0 items-center gap-2 text-xs font-medium tabular-nums text-stone-600">
          <span className={lessonTotalGood > 0 ? "text-green-700" : undefined}>
            +{lessonTotalGood}
          </span>
          <span
            className={cn(
              lessonTotalBad > 0 ? "text-rose-700" : "text-stone-400"
            )}
          >
            −{lessonTotalBad}
          </span>
        </div>
      )}
    </div>
  );
}
