"use client";

import { trpc } from "~/app/_trpc/client";
import { deslugify } from "~/utils";
import { type RouterOutputs } from "~/utils/api";

type PageProps = {
  params: {
    planNameSlugged: string;
  };
};

type DetailedLearningPlan =
  RouterOutputs["planRouter"]["getSingleLearningPlan"];

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

  const root = learningPlan;

  const wordsNotInSentences = findWordsNotInSentences(root);

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-4xl font-bold">{root.name}</h1>
      <p className="mb-4 text-lg">{root.description}</p>

      <div className="flex-wrap-container mb-4">
        <h2 className="mb-2 text-2xl font-semibold">Lessons</h2>
        <div className="flex flex-wrap gap-2">
          {root.lessons.map((lesson) => (
            <div key={lesson.id} className=" mb-2 w-64 rounded bg-gray-100 p-4">
              <h3 className="text-xl font-semibold">{lesson.name}</h3>
              <p className="text-base">{lesson.description}</p>
              <div className="flex flex-wrap">
                {lesson.words.map((word) => (
                  <div key={word.id} className="  rounded bg-gray-100 p-1">
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
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        <h2 className="mb-2 text-2xl font-semibold">Sentences</h2>
        <div className="flex flex-wrap gap-2">
          {root.sentences.map((sentence) => (
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
