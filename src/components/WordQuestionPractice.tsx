"use client";

import { useLocalStorage } from "usehooks-ts";

import { trpc } from "~/app/_trpc/client";

import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Icons } from "./icons";

export function WordQuestionPractice() {
  const { data: scheduledQuestions } =
    trpc.questionRouter.getScheduledQuestions.useQuery();

  const firstQuestion = scheduledQuestions?.questions[0];

  // summary item for that word

  const wordSummary = scheduledQuestions?.wordsToSchedule.find(
    (word) => word.wordId === firstQuestion?.wordId
  );

  console.log("word summary", { wordSummary, scheduledQuestions });

  const interval = wordSummary?.interval ?? 1;

  // store the font size in local storage - useLocalstorage

  const [fontSize, setFontSize] = useLocalStorage("fontSize", 5);

  return (
    <div>
      {scheduledQuestions && (
        <div>
          <h2>Question count {scheduledQuestions.questions.length}</h2>

          <Card>
            <CardHeader>
              <CardTitle>practice a word</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center gap-1">
                <div className="flex gap-1">
                  <Button
                    onClick={() => {
                      setFontSize(fontSize + 1);
                    }}
                    variant={"outline"}
                  >
                    <Icons.zoomIn />
                  </Button>
                  <Button
                    onClick={() => {
                      setFontSize(Math.max(fontSize - 1, 1));
                    }}
                    variant={"outline"}
                  >
                    <Icons.zoomOut />
                  </Button>
                </div>

                <div
                  style={{
                    fontSize: `${fontSize}rem`,
                  }}
                >
                  {firstQuestion?.word?.word}
                </div>
                <div>interval: {interval} days</div>
                <div className="flex gap-1">
                  <Button variant={"destructive"}>hard {"6"}</Button>
                  <Button variant={"default"}>good</Button>
                  <Button variant={"outline"}>skip</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
