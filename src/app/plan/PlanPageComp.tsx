"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useQuerySsr } from "~/hooks/useQuerySsr";

import { LearningPlanInputForm } from "./LearningPlanInputForm";
import { LearningPlanCard } from "./LearningPlanCard";

import { trpc } from "../_trpc/client";

export function PlanPageComp() {
  const { data: learningPlans } = useQuerySsr(
    trpc.planRouter.getAllLearningPlans
  );

  return (
    <div>
      <h1>Plan</h1>

      <h2>All Learning Plans</h2>
      <div className="flex flex-wrap p-4">
        {learningPlans?.map((learningPlan) => (
          <LearningPlanCard key={learningPlan.id} learningPlan={learningPlan} />
        ))}
      </div>

      <Card className="w-96">
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
