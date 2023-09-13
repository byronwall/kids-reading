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
              <li key={lesson.id} className="relative pl-8">
                {/* Timeline dot */}
                <div className="absolute left-0 top-1/2 h-6 w-6 -translate-y-1/2 transform rounded-full bg-blue-500"></div>

                {/* Timeline content with card style */}
                <div className="rounded-lg bg-white p-4 pl-2 shadow-lg">
                  {lesson.name}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <h2>Add lesson to learning plan</h2>
        <LessonInputForm learningPlanId={learningPlan.id} />
      </CardContent>
    </Card>
  );
}
