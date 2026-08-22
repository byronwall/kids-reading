"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useQuerySsr } from "~/hooks/useQuerySsr";
import { trpc } from "~/lib/trpc/client";
import { useActiveProfile } from "~/hooks/useActiveProfile";

import { LearningPlanInputForm } from "./LearningPlanInputForm";
import { LearningPlanCard } from "./LearningPlanCard";

export function PlanPageComp() {
  const { activeProfile } = useActiveProfile();

  const { data: learningPlans } = useQuerySsr(
    trpc.planRouter.getAllLearningPlans,
    undefined
  );

  return (
    <div className="w-full min-w-0">
      <h1>Plan</h1>

      <h2>All Learning Plans</h2>
      {!activeProfile && (
        <p className="mx-auto mt-3 max-w-prose px-4 text-sm text-slate-600">
          Browse the curriculum now. Select a learner when you are ready to track progress.
        </p>
      )}
      <div className="flex w-full min-w-0 flex-wrap justify-center gap-4 p-4 sm:justify-start">
        {learningPlans?.map((learningPlan) => (
          <LearningPlanCard
            key={learningPlan.id}
            learningPlan={learningPlan}
            showProgress={Boolean(activeProfile?.id)}
          />
        ))}
      </div>

      <Card className="mx-auto w-full max-w-sm text-left">
        <CardHeader>
          <CardTitle>Add Learning Plan</CardTitle>
          <CardDescription>
            Use this section to create a new learning plan. You can add lessons
            and linked words later.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LearningPlanInputForm />
        </CardContent>
      </Card>
    </div>
  );
}
