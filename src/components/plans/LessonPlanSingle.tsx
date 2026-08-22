"use client";

import Link from "next/link";

import { trpc } from "~/lib/trpc/client";
import {
  useQuerySsr,
} from "~/hooks/useQuerySsr";
import { findWordsNotInSentences } from "~/lib/findWordsNotInSentences";

import { LessonDetail } from "./LessonDetail";
import { LessonBulkImportWordsForm } from "./LessonBulkImportForm";
import { LessonInputForm } from "./LessonInputForm";
import { ManagedCurriculum } from "./ManagedCurriculum";

export function LearningPlanSingle({ planName }: { planName: string }) {
  const { data: learningPlan } = useQuerySsr(
    trpc.planRouter.getSingleLearningPlan,
    {
      learningPlanName: planName,
    }
  );

  if (!learningPlan) {
    return (
      <div
        role="status"
        className="mx-auto w-full max-w-4xl px-4 py-10 text-left text-sm text-stone-500"
      >
        <span className="inline-block animate-pulse rounded-md bg-stone-200 px-4 py-2">
          Loading plan…
        </span>
      </div>
    );
  }

  const wordsNotInSentences = findWordsNotInSentences(learningPlan);
  const isManagedCurriculum =
    learningPlan.isManaged || learningPlan.chunks.length > 0;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 text-left">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            {learningPlan.name}
          </h1>
          {learningPlan.description && (
            <p className="mt-2 max-w-prose text-lg text-stone-600">
              {learningPlan.description}
            </p>
          )}
          {learningPlan.ageRange && (
            <p className="mt-1 text-sm text-stone-500">
              Age range: {learningPlan.ageRange}
            </p>
          )}
        </div>
        <Link
          href="/"
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-green-700 px-4 text-sm font-medium text-white transition-colors hover:bg-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2"
          onKeyDown={(event) => {
            if (event.key !== "Enter") return;

            event.preventDefault();
            event.currentTarget.click();
          }}
        >
          Continue to Practice
        </Link>
      </header>

      {isManagedCurriculum && <ManagedCurriculum plan={learningPlan} />}

      {!isManagedCurriculum && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold tracking-tight text-stone-900">
            Lessons
          </h2>
          <div className="mt-3 flex flex-col gap-3">
            {learningPlan.lessons.map((lesson) => (
              <LessonDetail
                key={lesson.id}
                lesson={lesson}
                wordsNotInSentences={wordsNotInSentences}
              />
            ))}
          </div>
        </section>
      )}

      {!isManagedCurriculum && learningPlan.sentences.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold tracking-tight text-stone-900">
            Sentences
          </h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {learningPlan.sentences.map((sentence) => (
              <li
                key={sentence.id}
                className="rounded-lg border border-amber-100 bg-amber-50/70 px-4 py-2.5 text-base leading-relaxed text-amber-950"
              >
                {sentence.fullSentence}
              </li>
            ))}
          </ul>
        </section>
      )}

      {!isManagedCurriculum && (
        <section className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight text-stone-900">
            Plan admin
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            Import a full lesson plan at once, or add an empty lesson by hand.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-amber-200/80 bg-amber-50/60 p-5">
              <h3 className="text-base font-semibold text-amber-950">
                Bulk import
              </h3>
              <p className="mt-1 text-sm text-amber-900">
                Paste the lesson plan.
              </p>
              <div className="mt-4">
                <LessonBulkImportWordsForm learningPlanId={learningPlan.id} />
              </div>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-semibold text-stone-900">
                Add new lesson
              </h3>
              <p className="mt-1 text-sm text-stone-600">
                Add an empty lesson to this plan.
              </p>
              <div className="mt-4">
                <LessonInputForm learningPlanId={learningPlan.id} />
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
