"use client";


import { type RouterInputs } from "~/utils/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { LearningPlanInputForm } from "./LearningPlanInputForm";

import { trpc } from "../_trpc/client";

type LearningPlanInput = RouterInputs["planRouter"]["createLearningPlan"];

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
      <pre>{JSON.stringify(learningPlans, null, 2)}</pre>
    </div>
  );
}
