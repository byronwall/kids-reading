"use client";

import { trpc } from "~/lib/trpc/client";
import { cn } from "~/lib/utils";
import { useQuerySsr } from "~/hooks/useQuerySsr";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { Icons } from "~/components/common/icons";

import { type WordToRender } from "./SentenceQuestionPractice";

export function WordInSentence(props: {
  wordToRender: WordToRender;
  onUpdateScore: (score: number | undefined) => void;
}) {
  const { wordToRender, onUpdateScore } = props;

  const { data: focusedWords } = useQuerySsr(
    trpc.questionRouter.getFocusedWords
  );

  // color map
  // score = undefined = blue; black  = 100; red = 0
  const color =
    wordToRender.score === undefined
      ? "text-blue-700"
      : wordToRender.score > 50
      ? "text-black"
      : "text-red-700";

  const showGoodButton =
    wordToRender.score === undefined || wordToRender.score < 100;
  const showBadButton =
    wordToRender.score === undefined || wordToRender.score > 0;
  const showSkipButton = wordToRender.score !== undefined;

  // check focus by matching ID
  const isFocused = focusedWords?.some((c) => c.id === wordToRender.word?.id);

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <div className={cn("cursor-pointer", color)}>
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
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col gap-2">
            {showGoodButton && (
              <Button
                variant="outline"
                onClick={() => {
                  onUpdateScore(100);
                }}
              >
                <div className="flex gap-2">
                  <Icons.thumbsUp />
                  <span>Good</span>
                </div>
              </Button>
            )}
            {showBadButton && (
              <Button
                variant="outline"
                onClick={() => {
                  onUpdateScore(0);
                }}
              >
                <div className="flex gap-2">
                  <Icons.thumbsDown />
                  <span>Bad</span>
                </div>
              </Button>
            )}
            {showSkipButton && (
              <Button
                variant="outline"
                onClick={() => {
                  onUpdateScore(undefined);
                }}
              >
                <div className="flex gap-2">
                  <Icons.ellipsis />
                  <span>Skip</span>
                </div>
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
