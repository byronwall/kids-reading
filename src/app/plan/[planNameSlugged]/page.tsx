"use client";

import { trpc } from "~/app/_trpc/client";
import { ButtonLoading } from "~/components/ButtonLoading";
import { Icons } from "~/components/icons";
import { cn, deslugify } from "~/utils";
import { useLessonActions } from "~/hooks/useLessonActions";
import { type DetailedLearningPlan } from "~/types/models";

type PageProps = {
  params: {
    planNameSlugged: string;
  };
};

export default function Page({ params }: PageProps) {
  const { planNameSlugged } = params;

  const planName = deslugify(planNameSlugged);

  const { data: learningPlan } = trpc.planRouter.getSingleLearningPlan.useQuery(
    {
      learningPlanName: planName,
    }
  );

  if (!learningPlan) {
    return <div>Loading...</div>;
  }

  const wordsNotInSentences = findWordsNotInSentences(learningPlan);

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-4xl font-bold">{learningPlan.name}</h1>
      <p className="mb-4 text-lg">{learningPlan.description}</p>

      <div className="flex-wrap-container mb-4">
        <h2 className="mb-2 text-2xl font-semibold">Lessons</h2>
        <div className="flex flex-col gap-2">
          {learningPlan.lessons.map((lesson) => (
            <LessonDetail
              key={lesson.id}
              lesson={lesson}
              wordsNotInSentences={wordsNotInSentences}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        <h2 className="mb-2 text-2xl font-semibold">Sentences</h2>
        <div className="flex flex-wrap gap-2">
          {learningPlan.sentences.map((sentence) => (
            <div
              key={sentence.id}
              className="mb-2 w-64 rounded bg-gray-100 p-1"
            >
              <p className="text-base">{sentence.fullSentence}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LessonDetail({
  lesson,
  wordsNotInSentences,
}: {
  lesson: DetailedLearningPlan["lessons"][0];
  wordsNotInSentences: DetailedLearningPlan["lessons"][0]["words"];
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

function findWordsNotInSentences(root: DetailedLearningPlan) {
  // Create a set of all word IDs in sentences for quick lookup
  const sentenceWordIds = new Set<string>();
  root.sentences.forEach((sentence) => {
    sentence.words.forEach((word) => {
      sentenceWordIds.add(word.id);
    });
  });

  // Filter out words that are not present in any sentence
  const wordsNotInSentences: DetailedLearningPlan["lessons"][0]["words"] = [];

  root.lessons.forEach((lesson) => {
    lesson.words.forEach((word) => {
      if (!sentenceWordIds.has(word.id)) {
        wordsNotInSentences.push(word);
      }
    });
  });

  return wordsNotInSentences;
}
