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
  const url = slugify(`/plan/${learningPlan.name}`);

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
            <span className="text-stone-500">
              {learningPlan.lessons.length}{" "}
              {learningPlan.lessons.length === 1 ? "lesson" : "lessons"}
            </span>
          </div>
        )}
      </div>

      {learningPlan.lessons.length > 0 && (
        <div className="flex min-w-0 flex-col gap-1 border-t border-stone-100 px-4 py-3">
          {learningPlan.lessons.slice(0, 5).map((lesson) => (
            <LessonCard
              lesson={lesson}
              key={lesson.id}
              showProgress={showProgress}
            />
          ))}
        </div>
      )}

      {learningPlan.lessons.length > 5 && (
        <div className="border-t border-stone-100 px-5 py-3">
          <Link
            href={url}
            className="text-sm font-medium text-green-800 hover:text-green-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2"
          >
            See all {learningPlan.lessons.length} lessons →
          </Link>
        </div>
      )}
    </div>
  );
}
