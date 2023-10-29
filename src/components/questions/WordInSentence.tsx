"use client";

import { trpc } from "~/lib/trpc/client";
import { cn } from "~/lib/utils";
import { useQuerySsr } from "~/hooks/useQuerySsr";

import { type WordToRender } from "./SentenceQuestionPractice";

export function WordInSentence(props: {
  wordToRender: WordToRender;
  onUpdateScore: (score: number) => void;
}) {
  const { wordToRender, onUpdateScore } = props;

  const { data: focusedWords } = useQuerySsr(
    trpc.questionRouter.getFocusedWords
  );

  // color map
  // score = undefined = blue; black  = 100; red = 0
  const color = wordToRender.score > 50 ? "text-black" : "text-red-700";

  // check focus by matching ID
  const isFocused = focusedWords?.some((c) => c.id === wordToRender.word?.id);

  const toggleScoreGoodBad = () => {
    if (wordToRender.score > 50) {
      onUpdateScore(0);
    } else {
      onUpdateScore(100);
    }
  };
  return (
    <>
      <div className={cn("cursor-pointer", color)} onClick={toggleScoreGoodBad}>
        <div
          className={cn({
            "border-b-2 border-yellow-500": isFocused,
          })}
        >
          {wordToRender.displayWord}
        </div>
        <div className={cn("text-sm text-gray-700")}>
          {wordToRender.word?.summaries[0]?.interval ?? 1}
        </div>
      </div>
    </>
  );
}
