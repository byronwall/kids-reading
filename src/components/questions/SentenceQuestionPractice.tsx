"use client";

import { useLocalStorage } from "usehooks-ts";
import { useEffect, useMemo, useState } from "react";

import { trpc } from "~/lib/trpc/client";
import { type RouterOutputs } from "~/utils/api";
import { useQuerySsr } from "~/hooks/useQuerySsr";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Icons } from "~/components/common/icons";
import { ButtonLoading } from "~/components/common/ButtonLoading";
import { useActiveProfile } from "~/hooks/useActiveProfile";

import { WordInSentence } from "./WordInSentence";
import {
  clampFontSize,
  PracticeEmpty,
  PracticeError,
  PracticeLoading,
} from "./PracticeStates";

type WordWithSentence =
  RouterOutputs["questionRouter"]["getPossibleSentences"][0];

export type WordToRender = {
  displayWord: string;
  word: WordWithSentence["words"][0] | undefined;
  score: number;
};

const FONT_SIZE_MIN = 2;
const FONT_SIZE_MAX = 6;
const FONT_SIZE_DEFAULT = 3.5;

export function SentenceQuestionPractice() {
  const { activeProfile } = useActiveProfile();
  const hasActiveProfile = Boolean(activeProfile?.id);
  const utils = trpc.useContext();

  const {
    data: sentencesToUse,
    isLoading: isLoadingSentences,
    isError: sentencesError,
    refetch: refetchSentences,
  } = useQuerySsr(trpc.questionRouter.getPossibleSentences);

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  // The list can shrink after a save; wrap so a stale index still resolves to
  // a real sentence instead of falling into the empty state.
  const totalSentences = sentencesToUse?.length ?? 0;
  const displayIndex =
    totalSentences > 0 ? activeQuestionIndex % totalSentences : 0;
  const firstSentence = sentencesToUse?.[displayIndex];

  const handleNextQuestion = () => {
    setActiveQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handlePreviousQuestion = () => {
    setActiveQuestionIndex((prevIndex) => prevIndex - 1);
  };

  const [fontSize, setFontSize] = useLocalStorage(
    "sentenceFontSize",
    FONT_SIZE_DEFAULT
  );
  const safeFontSize = clampFontSize(
    fontSize,
    FONT_SIZE_MIN,
    FONT_SIZE_MAX,
    FONT_SIZE_DEFAULT
  );
  const changeFontSize = (delta: number) => {
    setFontSize(clampFontSize(fontSize + delta, FONT_SIZE_MIN, FONT_SIZE_MAX, FONT_SIZE_DEFAULT));
  };

  const { data: minTimeForNextQuestion } =
    trpc.questionRouter.getMinTimeForNextQuestion.useQuery(undefined, { enabled: hasActiveProfile });

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
          score: 0,
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

  // Score by position in the sentence: matching by word text marked every
  // instance of a repeated word instead of just the tapped one.
  const handleScore = (index: number, score: number) => {
    setWordsToRender((prev) =>
      prev.map((wordToRender, i) =>
        i === index ? { ...wordToRender, score } : wordToRender
      )
    );
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

    // this is needed to update the award banner
    await utils.awardRouter.getAllAwardsForProfile.invalidate();
  };

  if (!hasActiveProfile) {
    return <p className="p-4 text-sm text-slate-600">Select a learner to practice sentences.</p>;
  }

  if (isLoadingSentences) {
    return <PracticeLoading label="Loading practice sentences…" />;
  }

  if (sentencesError) {
    return (
      <PracticeError
        label="Practice sentences couldn't be loaded."
        onRetry={() => void refetchSentences()}
      />
    );
  }

  if (!firstSentence) {
    return (
      <PracticeEmpty title="No sentences available">
        <p>
          Next question available on {minTimeForNextQuestion?.toDateString()}.
          You can also go to the admin page to schedule more words.
        </p>
      </PracticeEmpty>
    );
  }

  return (
    <Card className="w-full">
      <CardContent className="flex flex-col gap-6 p-4 sm:gap-8 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              aria-label="Previous sentence"
              onClick={handlePreviousQuestion}
              disabled={displayIndex === 0}
            >
              <Icons.chevronLeft />
            </Button>
            <p
              className="min-w-[7.5rem] text-center text-sm tabular-nums text-slate-600"
              aria-live="polite"
            >
              Sentence{" "}
              <span className="font-semibold text-slate-900">
                {displayIndex + 1} of {totalSentences}
              </span>
            </p>
            <Button
              variant="outline"
              size="icon"
              aria-label="Next sentence"
              onClick={handleNextQuestion}
              disabled={displayIndex >= totalSentences - 1}
            >
              <Icons.chevronRight />
            </Button>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              aria-label="Smaller text"
              onClick={() => changeFontSize(-0.5)}
            >
              <Icons.zoomOut />
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label="Larger text"
              onClick={() => changeFontSize(0.5)}
            >
              <Icons.zoomIn />
            </Button>
          </div>
        </div>

        <div
          className="flex flex-wrap items-start justify-center gap-y-4 py-4 sm:py-8"
          style={{
            fontSize: `${safeFontSize}rem`,
            lineHeight: 1.25,
            columnGap: `${Math.max(0.5, safeFontSize * 0.25)}rem`,
          }}
        >
          {wordsToRender.map((wordToRender, idx) => (
            <WordInSentence
              key={idx}
              wordToRender={wordToRender}
              onUpdateScore={(score) => {
                handleScore(idx, score);
              }}
            />
          ))}
        </div>

        <div className="flex flex-col items-center gap-3">
          <ButtonLoading
            onClick={handleSubmitSentence}
            isLoading={submitSentenceMutation.isLoading}
            className="h-12 px-10 text-base"
          >
            Save
          </ButtonLoading>
          <p className="text-xs text-slate-500">
            Tap a word to switch it between known and practice.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
