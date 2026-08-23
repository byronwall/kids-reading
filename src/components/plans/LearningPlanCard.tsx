"use client";

import Link from "next/link";

import { slugify } from "~/lib/utils";
import { type LearningPlan } from "~/types/models";

import { LessonCard } from "./LessonCard";

export function LearningPlanCard({
  learningPlan,
  showProgress = true,
}: {
  learningPlan: LearningPlan;
  showProgress?: boolean;
}) {
  const url = slugify(`/plan/${learningPlan.canonicalId ?? learningPlan.name}`);

  // compute total good and bad for all lesson in learning plan
  const totalGood = learningPlan.lessons.reduce(
    (acc, lesson) =>
      acc + lesson.words.reduce((acc, c) => acc + c.goodCount, 0),
    0
  );

  const totalBad = learningPlan.lessons.reduce(
    (acc, lesson) => acc + lesson.words.reduce((acc, c) => acc + c.badCount, 0),
    0
  );
  const chunkCount = learningPlan.chunks.length;
  const lessonCount = learningPlan.lessons.length;
  const hasChunks = chunkCount > 0;

  return (
    <div className="flex w-full min-w-0 flex-col rounded-xl border border-stone-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-1 p-5 pb-3">
        <Link
          href={url}
          className="text-lg font-semibold leading-snug text-stone-900 hover:text-green-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2"
        >
          {learningPlan.name}
        </Link>
        {learningPlan.description && (
          <p className="line-clamp-2 text-sm text-stone-600">
            {learningPlan.description}
          </p>
        )}
        {showProgress && (
          <div className="mt-1 flex items-center gap-2 text-xs font-medium tabular-nums">
            <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-800">
              +{totalGood}
            </span>
            <span
              className={`rounded-full px-2 py-0.5 ${
                totalBad > 0
                  ? "bg-rose-100 text-rose-800"
                  : "bg-stone-100 text-stone-500"
              }`}
            >
              −{totalBad}
            </span>
          </div>
        )}
        <p className="text-xs font-medium text-stone-500">
          {hasChunks &&
            `${chunkCount} ${chunkCount === 1 ? "chunk" : "chunks"} · `}
          {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
        </p>
      </div>

      {hasChunks ? (
        <div className="flex min-w-0 flex-col gap-1 border-t border-stone-100 px-4 py-3">
          {learningPlan.chunks.slice(0, 3).map((chunk) => (
            <div
              key={chunk.id}
              className="flex min-w-0 items-center justify-between gap-3 rounded-lg border border-stone-100 bg-stone-50 px-3 py-2"
            >
              <span className="min-w-0 truncate text-sm font-medium text-stone-800">
                {chunk.order}. {chunk.title}
              </span>
              <span className="shrink-0 text-xs tabular-nums text-stone-500">
                {chunk.lessons.length}{" "}
                {chunk.lessons.length === 1 ? "lesson" : "lessons"}
              </span>
            </div>
          ))}
          {chunkCount > 3 && (
            <p className="px-3 pt-1 text-xs text-stone-500">
              +{chunkCount - 3} more {chunkCount - 3 === 1 ? "chunk" : "chunks"}
            </p>
          )}
        </div>
      ) : learningPlan.lessons.length > 0 ? (
        <div className="flex min-w-0 flex-col gap-1 border-t border-stone-100 px-4 py-3">
          {learningPlan.lessons.slice(0, 5).map((lesson) => (
            <LessonCard
              lesson={lesson}
              key={lesson.id}
              showProgress={showProgress}
            />
          ))}
        </div>
      ) : null}

      <div className="border-t border-stone-100 px-5 py-3">
        <Link
          href={url}
          className="text-sm font-medium text-green-800 hover:text-green-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2"
        >
          Open plan <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
