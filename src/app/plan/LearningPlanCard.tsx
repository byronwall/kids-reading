"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";

import { LessonInputForm } from "./LessonInputForm";
import { type LearningPlan } from "./page";
import { LessonCard } from "./LessonCard";
import { LessonBulkImportWordsForm } from "./LessonBulkImportForm";

export function LearningPlanCard({
  learningPlan,
}: {
  learningPlan: LearningPlan;
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{learningPlan.name}</CardTitle>
        <CardDescription>{learningPlan.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="p-4">
          <h3 className="mb-4 text-xl font-semibold">Lessons</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {learningPlan.lessons.map((lesson) => (
              <LessonCard lesson={lesson} key={lesson.id} />
            ))}
          </div>
        </div>

        <Dialog>
          <DialogTrigger>Bulk import</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Paste the lesson plan</DialogTitle>
              <DialogDescription>
                <LessonBulkImportWordsForm learningPlanId={learningPlan.id} />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <Collapsible>
          <CollapsibleTrigger>
            <h2>Add lesson to learning plan...</h2>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <LessonInputForm learningPlanId={learningPlan.id} />
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
