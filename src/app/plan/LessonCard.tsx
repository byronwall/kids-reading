"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Icons } from "~/components/icons";

import { LessonEditWordsForm } from "./LessonEditWordsForm";
import { type LearningPlan } from "./page";

export type Lesson = LearningPlan["lessons"][0];

export function LessonCard({ lesson }: { lesson: Lesson }) {
  const wordList = lesson.words.map((c) => c.word).join(", ");

  return (
    <li className="relative pl-8">
      <div className="absolute left-0 top-1/2 h-6 w-6 -translate-y-1/2 transform rounded-full bg-blue-500"></div>

      <div className="rounded-lg bg-white p-4 pl-2 shadow-lg">
        <p>{lesson.name}</p>
        <p className="text-xs text-gray-500">{lesson.description}</p>
        <p>Words: {wordList}</p>

        <Dialog>
          <DialogTrigger>
            <Icons.pencil />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit words in this lesson.</DialogTitle>
              <DialogDescription>
                <LessonEditWordsForm
                  lessonId={lesson.id}
                  defaultWords={wordList}
                />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </li>
  );
}
