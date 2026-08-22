"use client";

import { useLocalStorage } from "usehooks-ts";

import { trpc } from "~/lib/trpc/client";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Icons } from "~/components/common/icons";
import { useActiveProfile } from "~/hooks/useActiveProfile";

import {
  clampFontSize,
  PracticeEmpty,
  PracticeError,
  PracticeLoading,
} from "./PracticeStates";

const FONT_SIZE_MIN = 2;
const FONT_SIZE_MAX = 8;
const FONT_SIZE_DEFAULT = 5;

export function WordQuestionPractice() {
  const { activeProfile } = useActiveProfile();
  const hasActiveProfile = Boolean(activeProfile?.id);
  const utils = trpc.useContext();

  const {
    data: scheduledQuestions,
    isLoading,
    isError,
    refetch,
  } = trpc.questionRouter.getScheduledQuestions.useQuery(undefined, {
    enabled: hasActiveProfile,
  });

  const firstQuestion = scheduledQuestions?.[0];

  // summary item for that word

  const interval = firstQuestion?.interval ?? 1;

  // store the font size in local storage - useLocalstorage

  const [fontSize, setFontSize] = useLocalStorage("fontSize", FONT_SIZE_DEFAULT);
  const safeFontSize = clampFontSize(
    fontSize,
    FONT_SIZE_MIN,
    FONT_SIZE_MAX,
    FONT_SIZE_DEFAULT
  );
  const changeFontSize = (delta: number) => {
    setFontSize(clampFontSize(fontSize + delta, FONT_SIZE_MIN, FONT_SIZE_MAX, FONT_SIZE_DEFAULT));
  };

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
    trpc.questionRouter.getMinTimeForNextQuestion.useQuery(undefined, { enabled: hasActiveProfile });

  if (!hasActiveProfile) {
    return <p className="p-4 text-sm text-slate-600">Select a learner to practice words.</p>;
  }

  if (isLoading) {
    return <PracticeLoading label="Loading practice words…" />;
  }

  if (isError) {
    return (
      <PracticeError
        label="Practice words couldn't be loaded."
        onRetry={() => void refetch()}
      />
    );
  }

  if (!firstQuestion || !scheduledQuestions) {
    return (
      <PracticeEmpty title="No questions available">
        <p>
          Next question available on {minTimeForNextQuestion?.toDateString()}.
          You can also go to the admin page to schedule more words.
        </p>
      </PracticeEmpty>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col items-center gap-6 p-4 sm:gap-8 sm:p-8">
        <p className="text-sm tabular-nums text-slate-600">
          {scheduledQuestions.length === 1
            ? "1 word"
            : `${scheduledQuestions.length} words`}{" "}
          due for practice
        </p>

        <div
          className="max-w-full break-words text-center font-serif leading-tight text-slate-900"
          style={{ fontSize: `${safeFontSize}rem` }}
          aria-live="polite"
        >
          {firstQuestion.word?.word}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            aria-label="Smaller text"
            disabled={safeFontSize <= FONT_SIZE_MIN}
            onClick={() => changeFontSize(-1)}
          >
            <Icons.zoomOut />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Larger text"
            disabled={safeFontSize >= FONT_SIZE_MAX}
            onClick={() => changeFontSize(1)}
          >
            <Icons.zoomIn />
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-500">
          <span>
            {interval === 1 ? "Interval: 1 day" : `Interval: ${interval} days`}
          </span>
          <span aria-hidden="true">·</span>
          <span>
            Scheduled review: {firstQuestion.nextReviewDate.toDateString()}
          </span>
        </div>

        <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Button
            variant="outline"
            className="h-12 px-10 text-base"
            onClick={() => handleResult(0)}
          >
            <Icons.thumbsDown className="mr-2 h-5 w-5" /> Hard
          </Button>
          <Button
            className="h-12 px-10 text-base"
            onClick={() => handleResult(100)}
          >
            <Icons.thumbsUp className="mr-2 h-5 w-5" /> Good
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
