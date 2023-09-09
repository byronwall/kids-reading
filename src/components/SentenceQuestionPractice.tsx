"use client";

import { useLocalStorage } from "usehooks-ts";

import { trpc } from "~/app/_trpc/client";

import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Icons } from "./icons";

export function SentenceQuestionPractice() {
  const utils = trpc.useContext();

  const { data: scheduledQuestions } =
    trpc.questionRouter.getScheduledQuestions.useQuery();

  const firstQuestion = scheduledQuestions?.[0];

  const { data: sentencesToUse } =
    trpc.questionRouter.getPossibleSentences.useQuery();

  // summary item for that word

  const firstSentence = sentencesToUse?.[0];

  // store the font size in local storage - useLocalStorage

  const [fontSize, setFontSize] = useLocalStorage("sentenceFontSize", 5);

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
          <Card>
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
                  {firstSentence?.fullSentence}
                </div>
                <pre>
                  {JSON.stringify(
                    {
                      firstSentence,
                    },
                    null,
                    2
                  )}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
