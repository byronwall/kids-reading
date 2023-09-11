"use client";

import { useLocalStorage } from "usehooks-ts";
import { useEffect, useMemo, useState } from "react";

import { trpc } from "~/app/_trpc/client";
import { type RouterOutputs } from "~/utils/api";

import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import { WordInSentence } from "./WordInSentence";

type WordWithSentence =
  RouterOutputs["questionRouter"]["getPossibleSentences"][0];

export type WordToRender = {
  displayWord: string;
  word: WordWithSentence["words"][0];
  score: number | undefined;
};

export function SentenceQuestionPractice() {
  const utils = trpc.useContext();

  const { data: sentencesToUse, isLoading: isLoadingSentences } =
    trpc.questionRouter.getPossibleSentences.useQuery();

  const firstSentence = sentencesToUse?.[0];

  const [fontSize, setFontSize] = useLocalStorage("sentenceFontSize", 5);

  const { data: minTimeForNextQuestion } =
    trpc.questionRouter.getMinTimeForNextQuestion.useQuery();

  // split the sentence into words

  const initialWords: WordToRender[] = useMemo(() => {
    const words = firstSentence?.fullSentence.split(" ") ?? [];

    return words.map((_word) => {
      let word = _word.toLowerCase();
      if (word.endsWith(".") || word.endsWith(",")) {
        word = word.slice(0, -1);
      }
      const wordToRender = firstSentence?.words.find(
        (wordToCheck) => wordToCheck.word === word
      );

      if (!wordToRender) {
        throw new Error(`word not found: ${word}`);
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
      if (wordToRender.word.word === word.word.word) {
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
      results: wordsToRender.map((c) => ({
        wordId: c.word.id,
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
                    gap: `${fontSize / 4}rem`,
                  }}
                  className="flex flex-wrap "
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
                <div>
                  <Button onClick={handleSubmitSentence}>
                    <div className="flex gap-2">Submit</div>
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
