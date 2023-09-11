"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import { Button } from "./ui/button";
import { Icons } from "./icons";
import { type WordToRender } from "./SentenceQuestionPractice";

export function WordInSentence(props: {
  wordToRender: WordToRender;
  onUpdateScore: (score: number | undefined) => void;
}) {
  const { wordToRender, onUpdateScore } = props;

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

  return (
    <>
      <Popover>
        <PopoverTrigger>
          <div className={"cursor-pointer " + color}>
            {wordToRender.displayWord}
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
