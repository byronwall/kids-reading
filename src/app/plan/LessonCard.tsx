"use client";

import { Icons } from "~/components/icons";
import { ButtonLoading } from "~/components/ButtonLoading";
import { cn } from "~/utils";

import { type LearningPlan } from "./page";

import { trpc } from "../_trpc/client";

export type Lesson = LearningPlan["lessons"][0];

export function LessonCard({ lesson }: { lesson: Lesson }) {
  const utils = trpc.useContext();

  const wordList = lesson.words
    .map((c) => c.word + "(" + c.goodCount + "/" + c.badCount + ")")
    .join(", ");

  const lessonTotalGood = lesson.words.reduce((acc, c) => acc + c.goodCount, 0);
  const lessonTotalBad = lesson.words.reduce((acc, c) => acc + c.badCount, 0);

  const createSentencesMutation =
    trpc.sentencesRouter.generateAndAddNewSentencesForWords.useMutation();

  const handleCreateSentences = async () => {
    await createSentencesMutation.mutateAsync(lesson.words.map((c) => c.word));

    // invalidate the query so that it will refetch
    await utils.planRouter.getAllLearningPlans.invalidate();
  };

  const isFocused = lesson.ProfileLessonFocus[0]?.isFocused ?? false;
  const hasLinkedProfile = lesson.ProfileLessonFocus[0]?.profileId != null;

  const toggleFocusMutation =
    trpc.planRouter.setProfileLessonFocus.useMutation();

  const handleToggleFocus = async () => {
    await toggleFocusMutation.mutateAsync({
      lessonId: lesson.id,
      isFocused: !isFocused,
    });

    // invalidate the query so that it will refetch
    await utils.planRouter.getAllLearningPlans.invalidate();
  };

  const linkProfileToLessonMutation =
    trpc.planRouter.linkProfileToLesson.useMutation();

  const handleLinkProfileToLesson = async () => {
    await linkProfileToLessonMutation.mutateAsync({
      lessonId: lesson.id,
    });

    // invalidate the query so that it will refetch
    await utils.planRouter.getAllLearningPlans.invalidate();
  };

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

        {!hasLinkedProfile && (
          <ButtonLoading
            variant={"outline"}
            onClick={handleLinkProfileToLesson}
            isLoading={linkProfileToLessonMutation.isLoading}
          >
            <Icons.userPlus className="h-4 w-4" />
          </ButtonLoading>
        )}
        {hasLinkedProfile && (
          <ButtonLoading
            variant={"outline"}
            onClick={handleToggleFocus}
            isLoading={toggleFocusMutation.isLoading}
          >
            {isFocused ? "unfocus" : "focus"}
          </ButtonLoading>
        )}

        <ButtonLoading
          variant={"outline"}
          onClick={handleCreateSentences}
          isLoading={createSentencesMutation.isLoading}
          title="Create sentences for all words in this lesson"
        >
          <Icons.listPlus className="h-4 w-4" />
        </ButtonLoading>
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
