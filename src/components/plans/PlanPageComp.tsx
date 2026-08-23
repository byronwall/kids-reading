"use client";

import { useSession } from "next-auth/react";

import { useQuerySsr } from "~/hooks/useQuerySsr";
import { trpc } from "~/lib/trpc/client";
import { useActiveProfile } from "~/hooks/useActiveProfile";

import { LearningPlanInputForm } from "./LearningPlanInputForm";
import { LearningPlanCard } from "./LearningPlanCard";

export function PlanPageComp() {
  const { data: session } = useSession();
  const { activeProfile } = useActiveProfile();
  const hasSessionUser = Boolean(session?.user);

  const { data: learningPlans } = useQuerySsr(
    trpc.planRouter.getAllLearningPlans,
    undefined
  );

  const hasPlans = (learningPlans?.length ?? 0) > 0;

  return (
    <div className="w-full max-w-5xl text-left">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          Plan
        </h1>
        <p className="mt-2 max-w-prose text-base text-stone-600">
          Browse learning plans and lessons. Practice happens on the home page
          once a learner is selected.
        </p>
      </header>

      {!hasSessionUser ? (
        <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Browse the curriculum without signing in. Sign in to create plans and
          track learner progress.
        </p>
      ) : !activeProfile ? (
        <p className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Browse the curriculum now. Select a learner when you are ready to
          track progress.
        </p>
      ) : null}

      {hasPlans ? (
        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {learningPlans?.map((learningPlan) => (
            <LearningPlanCard
              key={learningPlan.id}
              learningPlan={learningPlan}
              showProgress={Boolean(activeProfile?.id)}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50/50 px-6 py-10 text-center">
          <p className="text-sm font-medium text-stone-700">
            No learning plans yet.
          </p>
          {hasSessionUser ? (
            <p className="mt-1 text-sm text-stone-500">
              Create your first plan below to start adding lessons.
            </p>
          ) : (
            <p className="mt-1 text-sm text-stone-500">
              Sign in to create a plan and add lessons.
            </p>
          )}
        </div>
      )}

      {hasSessionUser && (
        <section className="mt-10 rounded-xl border border-amber-200/80 bg-amber-50/60 p-5 sm:p-6">
          <h2 className="text-xl font-semibold tracking-tight text-stone-900">
            Add a learning plan
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            Create an empty plan now. You can add lessons and linked words
            later.
          </p>
          <div className="mt-4 max-w-md">
            <LearningPlanInputForm />
          </div>
        </section>
      )}
    </div>
  );
}
