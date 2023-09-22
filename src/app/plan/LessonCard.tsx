"use client";

import { cn } from "~/utils";
import { type LearningPlan } from "~/types/models";

export type Lesson = LearningPlan["lessons"][0];

export function LessonCard({ lesson }: { lesson: Lesson }) {
  const lessonTotalGood = lesson.words.reduce((acc, c) => acc + c.goodCount, 0);
  const lessonTotalBad = lesson.words.reduce((acc, c) => acc + c.badCount, 0);

  const isFocused = lesson.ProfileLessonFocus[0]?.isFocused ?? false;
  const hasLinkedProfile = lesson.ProfileLessonFocus[0]?.profileId != null;

  return (
    <div
      className={cn("rounded-lg bg-white p-4 pl-2 shadow-lg", {
        "bg-green-300": hasLinkedProfile,
        "bg-blue-300": isFocused,
      })}
    >
      <div className="flex">
        <p className="text-xl font-semibold">{lesson.name}</p>
        <p className="text-xs text-gray-500">{lesson.description}</p>
        <div className="flex items-center justify-center gap-4">
          <p className="text-xl text-blue-800">+{lessonTotalGood}</p>
          <p className={cn("text-xl ", { "text-red-800": lessonTotalBad > 0 })}>
            -{lessonTotalBad}
          </p>
        </div>
      </div>
      {/* <p className="flex flex-wrap items-center gap-x-2">
        Words:
        {lesson.words.slice(0, 5).map((c) => (
          <span
            key={c.word}
            className={cn("text-sm", {
              "text-blue-800": c.goodCount > c.badCount,
              "text-red-800": c.badCount > c.goodCount,
              "font-semibold": c.goodCount + c.badCount > 0,
            })}
          >
            {c.word}
          </span>
        ))}
      </p>

      <Dialog>
        <DialogTrigger>
          <Icons.pencil />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit words in this lesson.</DialogTitle>
            <DialogDescription>
              <LessonEditWordsForm
                lessonId={lesson.id}
                defaultWords={wordList}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog> */}
    </div>
  );
}
