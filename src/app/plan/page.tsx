"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { type RouterOutputs } from "~/utils/api";

import { LearningPlanInputForm } from "./LearningPlanInputForm";
import { LearningPlanCard } from "./LearningPlanCard";

import { trpc } from "../_trpc/client";

export type LearningPlan =
  RouterOutputs["planRouter"]["getAllLearningPlans"][0];

export default function PlanPage() {
  const { data: learningPlans } =
    trpc.planRouter.getAllLearningPlans.useQuery();

  return (
    <div>
      <h1>Plan</h1>

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

      <h2>All Learning Plans</h2>
      <div className="flex flex-wrap">
        {learningPlans?.map((learningPlan) => (
          <LearningPlanCard key={learningPlan.id} learningPlan={learningPlan} />
        ))}
      </div>
    </div>
  );
}
