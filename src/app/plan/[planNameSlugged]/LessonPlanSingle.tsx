"use client";
import { useContext } from "react";

import { trpc } from "~/app/_trpc/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { SsrContext } from "~/app/SsrContext";

import { LessonDetail } from "./LessonDetail";
import { findWordsNotInSentences } from "./findWordsNotInSentences";

import { LessonBulkImportWordsForm } from "../LessonBulkImportForm";
import { LessonInputForm } from "../LessonInputForm";

export function LearningPlanSingle({ planName }: { planName: string }) {
  const { getSingleLearningPlan } = useContext(SsrContext);

  const { data: learningPlan } = trpc.planRouter.getSingleLearningPlan.useQuery(
    {
      learningPlanName: planName,
    },
    {
      initialData: getSingleLearningPlan,
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

      <div className="flex flex-col">
        <h2 className="mb-2 text-2xl font-semibold">Plan Admin</h2>
        <div className="flex flex-wrap gap-2">
          <Card className="w-full max-w-[400px]">
            <CardHeader>
              <CardTitle>Bulk import</CardTitle>
              <CardDescription>Paste the lesson plan</CardDescription>
            </CardHeader>
            <CardContent>
              <LessonBulkImportWordsForm learningPlanId={learningPlan.id} />
            </CardContent>
          </Card>
          <Card className="w-full max-w-[400px]">
            <CardHeader>
              <CardTitle>Add new lesson</CardTitle>
              <CardDescription>Add an empty lesson to plan</CardDescription>
            </CardHeader>
            <CardContent>
              <LessonInputForm learningPlanId={learningPlan.id} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
