"use client";

import { useMemo, useState } from "react";

import { trpc } from "~/app/_trpc/client";

import { Button } from "./ui/button";

export function WordQuestionPractice() {
  // get all words
  const { data: words } = trpc.wordRouter.getAllWords.useQuery();

  const [randomIdx, setRandomIdx] = useState(0);

  // pick a random word to show
  const randomWord = useMemo(() => {
    return words ? words[Math.floor(Math.random() * words.length)] : null;
  }, [randomIdx, words]);

  // give a button to change the word
  function handleButtonClick() {
    setRandomIdx((idx) => idx + 1);
  }

  // TODO: allow changing text size - save to local storage (phone needs bigger)

  return (
    <div>
      <h1>practice a word</h1>
      {randomWord && (
        <div>
          <h2>{randomWord.word}</h2>
          <Button onClick={handleButtonClick}>Change Word</Button>
        </div>
      )}
    </div>
  );
}
