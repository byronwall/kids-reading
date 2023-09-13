"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { LessonInputForm } from "./LessonInputForm";
import { type LearningPlan } from "./page";
import { LessonCard } from "./LessonCard";

export function LearningPlanCard({
  learningPlan,
}: {
  learningPlan: LearningPlan;
}) {
  return (
    <Card className="w-96">
      <CardHeader>
        <CardTitle>{learningPlan.name}</CardTitle>
        <CardDescription>{learningPlan.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4">
          <h3 className="mb-4 text-xl font-semibold">Lessons</h3>
          <ul className="space-y-4">
            {learningPlan.lessons.map((lesson) => (
              <LessonCard lesson={lesson} key={lesson.id} />
            ))}
          </ul>
        </div>

        <h2>Add lesson to learning plan</h2>
        <LessonInputForm learningPlanId={learningPlan.id} />
      </CardContent>
    </Card>
  );
}
