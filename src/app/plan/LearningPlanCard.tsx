"use client";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { slugify } from "~/utils";
import { type LearningPlan } from "~/types/models";

import { LessonCard } from "./LessonCard";

export function LearningPlanCard({
  learningPlan,
}: {
  learningPlan: LearningPlan;
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
    <Card className="w-96">
      <CardHeader>
        <CardTitle>
          <Link href={url} className="hover:underline">
            {learningPlan.name}[+{totalGood}/-{totalBad}]
          </Link>
        </CardTitle>
        <CardDescription>{learningPlan.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 p-1">
          {learningPlan.lessons.slice(0, 5).map((lesson) => (
            <LessonCard lesson={lesson} key={lesson.id} />
          ))}
          {learningPlan.lessons.length > 5 && (
            <div className="flex flex-col items-center justify-center">
              <Link href={url}>See all</Link>
            </div>
          )}
        </div>

        {/* <Dialog>
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
        </Collapsible> */}
      </CardContent>
    </Card>
  );
}
