"use client";

import { useLocalStorage } from "usehooks-ts";

import { trpc } from "~/lib/trpc/client";

import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Icons } from "./icons";

export function WordQuestionPractice() {
  const utils = trpc.useContext();

  const { data: scheduledQuestions } =
    trpc.questionRouter.getScheduledQuestions.useQuery();

  const firstQuestion = scheduledQuestions?.[0];

  // summary item for that word

  const wordSummary = firstQuestion;

  const interval = wordSummary?.interval ?? 1;

  // store the font size in local storage - useLocalstorage

  const [fontSize, setFontSize] = useLocalStorage("fontSize", 5);

  const recordResultMutation =
    trpc.questionRouter.createResultAndUpdateSummaryForWord.useMutation();

  const handleResult = async (result: number) => {
    if (!firstQuestion) {
      return;
    }

    await recordResultMutation.mutateAsync({
      wordId: firstQuestion.wordId,
      score: result,
    });

    await utils.questionRouter.getScheduledQuestions.invalidate();
  };

  const { data: minTimeForNextQuestion } =
    trpc.questionRouter.getMinTimeForNextQuestion.useQuery();

  return (
    <div>
      {scheduledQuestions && scheduledQuestions.length === 0 && (
        <div>
          <h2>no questions available</h2>
          <div>
            next question available on {minTimeForNextQuestion?.toDateString()}.
            You can also go to the admin page to schedule more words.
          </div>
        </div>
      )}
      {scheduledQuestions && scheduledQuestions?.length > 0 && (
        <div>
          <h2>Question count {scheduledQuestions.length}</h2>

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
                <div>
                  scheduled review:{" "}
                  {firstQuestion?.nextReviewDate.toDateString()}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant={"destructive"}
                    onClick={() => handleResult(0)}
                  >
                    hard
                  </Button>
                  <Button variant={"default"} onClick={() => handleResult(100)}>
                    good
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
