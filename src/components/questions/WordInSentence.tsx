"use client";

import { cn } from "~/lib/utils";
import { useQuerySsr } from "~/hooks/useQuerySsr";
import { trpc } from "~/lib/trpc/client";

import { type WordToRender } from "./SentenceQuestionPractice";

export function WordInSentence(props: {
  wordToRender: WordToRender;
  onUpdateScore: (score: number) => void;
}) {
  const { wordToRender, onUpdateScore } = props;

  const { data: focusedWords } = useQuerySsr(
    trpc.questionRouter.getFocusedWords
  );

  // Words that are not part of the tracked curriculum cannot be scored; they
  // are filtered out before results are submitted.
  const isTracked = wordToRender.word !== undefined;
  const isKnown = wordToRender.score > 50;
  const isFocused =
    isTracked &&
    (focusedWords?.some((c) => c.id === wordToRender.word?.id) ?? false);

  // color map, plus non-color status: dotted underline = needs practice
  // score > 50 = known (dark); score <= 50 = needs practice (red)
  const toggleScoreGoodBad = () => {
    if (!isTracked) {
      return;
    }

    onUpdateScore(isKnown ? 0 : 100);
  };

  return (
    <span className="inline-flex flex-col items-center">
      <button
        type="button"
        onClick={toggleScoreGoodBad}
        disabled={!isTracked}
        aria-pressed={isTracked ? isKnown : undefined}
        aria-label={
          isTracked
            ? `${wordToRender.displayWord} (${isKnown ? "known" : "needs practice"})`
            : `${wordToRender.displayWord} (not tracked)`
        }
        className={cn(
          "-mx-1 cursor-pointer rounded-sm px-1 py-0.5 font-serif leading-tight transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2",
          !isTracked && "cursor-default text-slate-400",
          isTracked &&
            isKnown &&
            "text-slate-900 hover:text-slate-600",
          isTracked &&
            !isKnown &&
            "text-red-700 underline decoration-dotted decoration-from-font underline-offset-[0.15em]",
          isFocused && "underline decoration-yellow-500 decoration-2 underline-offset-[0.15em]"
        )}
      >
        {wordToRender.displayWord}
      </button>
      {isTracked && (
        <span
          className="tabular-nums text-xs text-slate-400"
          aria-hidden="true"
        >
          {wordToRender.word?.summaries[0]?.interval ?? 1}
        </span>
      )}
    </span>
  );
}
