"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Icons } from "~/components/icons";
import { ButtonLoading } from "~/components/ButtonLoading";

import { LessonEditWordsForm } from "./LessonEditWordsForm";
import { type LearningPlan } from "./page";

import { trpc } from "../_trpc/client";

export type Lesson = LearningPlan["lessons"][0];

export function LessonCard({ lesson }: { lesson: Lesson }) {
  const utils = trpc.useContext();

  const wordList = lesson.words.map((c) => c.word).join(", ");

  const scheduleNewWordsMutation =
    trpc.questionRouter.scheduleNewWords.useMutation();

  const handleScheduleNewWords = async () => {
    await scheduleNewWordsMutation.mutateAsync({
      words: lesson.words.map((c) => c.word),
    });

    // invalidate the query so that it will refetch
    await utils.planRouter.getAllLearningPlans.invalidate();
  };

  const createSentencesMutation =
    trpc.sentencesRouter.generateAndAddNewSentencesForWords.useMutation();

  const handleCreateSentences = async () => {
    await createSentencesMutation.mutateAsync(lesson.words.map((c) => c.word));

    // invalidate the query so that it will refetch
    await utils.planRouter.getAllLearningPlans.invalidate();
  };

  return (
    <div className="rounded-lg bg-white p-4 pl-2 shadow-lg">
      <p>{lesson.name}</p>
      <p className="text-xs text-gray-500">{lesson.description}</p>
      <ButtonLoading
        variant={"outline"}
        onClick={handleScheduleNewWords}
        isLoading={scheduleNewWordsMutation.isLoading}
      >
        <Icons.userPlus className="h-4 w-4" />
      </ButtonLoading>
      <ButtonLoading
        variant={"outline"}
        onClick={handleCreateSentences}
        isLoading={createSentencesMutation.isLoading}
      >
        <Icons.listPlus className="h-4 w-4" />
      </ButtonLoading>
      <p>Words: {wordList}</p>

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
      </Dialog>
    </div>
  );
}
