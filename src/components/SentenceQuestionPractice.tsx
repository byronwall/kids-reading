"use client";

import { useLocalStorage } from "usehooks-ts";
import { useEffect, useMemo, useState } from "react";

import { trpc } from "~/app/_trpc/client";
import { type RouterOutputs } from "~/utils/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { WordInSentence } from "./WordInSentence";
import { ButtonLoading } from "./ButtonLoading";

type WordWithSentence =
  RouterOutputs["questionRouter"]["getPossibleSentences"][0];

export type WordToRender = {
  displayWord: string;
  word: WordWithSentence["words"][0] | undefined;
  score: number | undefined;
};

export function SentenceQuestionPractice() {
  const utils = trpc.useContext();

  const { data: sentencesToUse, isLoading: isLoadingSentences } =
    trpc.questionRouter.getPossibleSentences.useQuery();

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  const firstSentence =
    sentencesToUse?.[activeQuestionIndex % (sentencesToUse?.length || 1)];

  const handleNextQuestion = () => {
    setActiveQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setActiveQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const [fontSize, setFontSize] = useLocalStorage("sentenceFontSize", 5);

  const { data: minTimeForNextQuestion } =
    trpc.questionRouter.getMinTimeForNextQuestion.useQuery();

  // split the sentence into words

  const initialWords: WordToRender[] = useMemo(() => {
    const words = firstSentence?.fullSentence.split(" ") ?? [];

    return words.map((_word) => {
      let word = _word.toLowerCase();

      // remove punctuation at the end
      word = word.replace(/[.,?!]$/, "");

      const wordToRender = firstSentence?.words.find(
        (wordToCheck) => wordToCheck.word === word
      );

      if (!wordToRender) {
        return {
          displayWord: _word,
          word: undefined,
          score: undefined,
        };
      }

      // check if summary exists -- if so, score = 100, else score = undefined

      return {
        displayWord: _word,
        word: wordToRender,
        score: 100,
      };
    });
  }, [firstSentence?.fullSentence, firstSentence?.words]);

  const [wordsToRender, setWordsToRender] = useState(initialWords);

  useEffect(() => {
    setWordsToRender(initialWords);
  }, [initialWords]);

  // link the word to the words in the sentence

  const handleScore = (word: WordToRender, score: number | undefined) => {
    // update the score
    const newWordsToRender = wordsToRender.map((wordToRender) => {
      if (wordToRender.word?.word === word.word?.word) {
        return {
          ...wordToRender,
          score,
        };
      }

      return wordToRender;
    });

    setWordsToRender(newWordsToRender);
  };

  // render all words with their own comp

  const submitSentenceMutation =
    trpc.questionRouter.createResultForSentence.useMutation();

  const handleSubmitSentence = async () => {
    // send the score to the server

    if (!firstSentence) {
      return;
    }

    await submitSentenceMutation.mutateAsync({
      sentenceId: firstSentence?.id,
      results: wordsToRender
        // throw out words that don't have a word
        .filter((c) => c.word !== undefined)
        .map((c) => ({
          wordId: c.word!.id,
          score: c.score,
        })),
    });

    // get the next sentence by invalidating query
    await utils.questionRouter.getPossibleSentences.invalidate();
  };

  if (isLoadingSentences) {
    return <div>loading...</div>;
  }

  if (!firstSentence) {
    return (
      <div>
        <h2>no sentences available</h2>
        <div>
          next question available on {minTimeForNextQuestion?.toDateString()}.
          You can also go to the admin page to schedule more words.
        </div>
      </div>
    );
  }

  return (
    <div>
      {firstSentence && (
        <div>
          <Card>
            <CardContent>
              <div className="flex flex-col items-center gap-1">
                <div className="flex flex-wrap items-center gap-1">
                  <div className="flex gap-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Icons.baseline />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Font Settings</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setFontSize(fontSize + 1);
                          }}
                          onSelect={(evt) => evt.preventDefault()}
                        >
                          <Icons.zoomIn /> <span>Larger font</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setFontSize(fontSize - 1);
                          }}
                          onSelect={(evt) => evt.preventDefault()}
                        >
                          <Icons.zoomOut /> <span>Smaller font</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center justify-center">
                    <Button
                      onClick={handlePreviousQuestion}
                      disabled={activeQuestionIndex === 0}
                      variant={"outline"}
                      size="sm"
                    >
                      <Icons.chevronLeft />
                    </Button>

                    <div className="flex flex-col items-center px-2">
                      <div>{activeQuestionIndex + 1}</div>
                      <div>{sentencesToUse?.length ?? 0}</div>
                    </div>

                    <Button
                      onClick={handleNextQuestion}
                      disabled={
                        activeQuestionIndex === sentencesToUse?.length - 1
                      }
                      variant={"outline"}
                      size="sm"
                    >
                      <Icons.chevronRight />
                    </Button>
                  </div>
                  <div className="flex">
                    <ButtonLoading
                      onClick={handleSubmitSentence}
                      isLoading={submitSentenceMutation.isLoading}
                    >
                      Save
                    </ButtonLoading>
                  </div>
                </div>

                <div
                  style={{
                    fontSize: `${fontSize}rem`,
                    gap: `${fontSize / 4}rem`,
                    rowGap: 0,
                    lineHeight: `${fontSize}rem`,
                  }}
                  className="flex flex-wrap py-2"
                >
                  {wordsToRender.map((wordToRender, idx) => (
                    <WordInSentence
                      key={idx}
                      wordToRender={wordToRender}
                      onUpdateScore={(score) => {
                        handleScore(wordToRender, score);
                      }}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
