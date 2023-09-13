"use client";

import { useState } from "react";

import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Icons } from "~/components/icons";

import { trpc } from "../_trpc/client";

export default function Home() {
  const [words, setWords] = useState("");

  const utils = trpc.useContext();

  const onSuccess = async () => {
    // invalidate the query so that it will refetch
    await utils.wordRouter.getAllWords.invalidate();
  };
  const addWordMutation = trpc.wordRouter.addWords.useMutation({
    onSuccess,
  });
  const deleteWordMutation = trpc.wordRouter.deleteWord.useMutation({
    onSuccess,
  });

  const { data: allWords } = trpc.wordRouter.getAllWords.useQuery();

  const handleSave = async () => {
    await addWordMutation.mutateAsync(words);
  };

  const handleDelete = async (id: string) => {
    await deleteWordMutation.mutateAsync(id);

    // invalidate the query so that it will refetch
    await utils.wordRouter.getAllWords.invalidate();
  };

  const handleWordsChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setWords(event.target.value);
  };

  const scheduleMutation =
    trpc.questionRouter.scheduleRandomQuestions.useMutation();

  const handleSchedule = async () => {
    await scheduleMutation.mutateAsync();
  };

  const {
    data: newSentences,
    refetch,
    isInitialLoading: isLoadingSentences,
  } = trpc.sentencesRouter.getNewSentencesForWords.useQuery([], {
    enabled: false,
  });

  const addSentencesMutation =
    trpc.sentencesRouter.addSentencesAndWords.useMutation();

  const handleAddSentences = async (sentences: string[]) => {
    await addSentencesMutation.mutateAsync({
      sentences,
    });

    // invalidate the query so that it will refetch
    await utils.sentencesRouter.getAllSentences.invalidate();
  };

  const { data: allSentences } =
    trpc.sentencesRouter.getAllSentences.useQuery();

  return (
    <section className="">
      <h1>admin</h1>
      <div className="flex flex-col  gap-2 text-left">
        <p>This page will let you manage words and other information.</p>
        <div className="grid w-full gap-1.5">
          <Label htmlFor="message">Enter words with commas to separate.</Label>
          <Textarea
            placeholder="Type your message here."
            id="message"
            value={words}
            onChange={handleWordsChange}
          />
          <Button onClick={handleSave}>Save</Button>
        </div>
      </div>
      <div>
        <h2>questions</h2>

        <Button onClick={handleSchedule}>
          Schedule 20 random words for profile
          <Icons.add className="ml-2 h-5 w-5" />
        </Button>
      </div>
      <div>
        <h2>sentences</h2>
        <Button onClick={() => refetch()} disabled={isLoadingSentences}>
          Generate sentences for words
          <Icons.add className="ml-2 h-5 w-5" />
        </Button>
        {isLoadingSentences && (
          <p>
            loading... <Icons.spinner className="ml-2 h-5 w-5 animate-spin" />
          </p>
        )}
        {!isLoadingSentences && newSentences?.length && (
          <div>
            <div>
              <Button onClick={() => handleAddSentences(newSentences)}>
                Add all sentences
                <Icons.add className="ml-2 h-5 w-5" />
              </Button>
            </div>
            <div>
              {newSentences?.map((sentence) => (
                <div
                  key={sentence}
                  className="flex items-center justify-between"
                >
                  <span>{sentence}</span>
                  <button
                    onClick={() => handleAddSentences([sentence])}
                    className="text-green-500 hover:text-green-700"
                  >
                    <Icons.add className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div>
          <h3>all sentences</h3>
          <ul className="space-y-2">
            {allSentences?.map((sentence) => (
              <li
                key={sentence.id}
                className="flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <span>{sentence.fullSentence}</span>
                  <span className="text-sm text-gray-500">
                    {sentence.words.map((word) => word.word).join(", ")}
                  </span>
                </div>
                <div>
                  <Button
                    onClick={() => alert("delete not implemented")}
                    className="text-red-500 hover:text-red-700"
                    variant={"ghost"}
                  >
                    <Icons.trash className="h-5 w-5" />
                  </Button>
                  <Button
                    onClick={() => alert("edit not implemented")}
                    className="text-blue-500 hover:text-blue-700"
                    variant={"ghost"}
                  >
                    <Icons.pencil className="h-5 w-5" />
                  </Button>
                </div>
              </li>
            ))}
            {allSentences?.length === 0 && <p>no sentences</p>}
          </ul>
        </div>
      </div>
      <div>
        <h2>all words</h2>
        <ul>
          {allWords?.map((word) => (
            <li key={word.id} className="flex items-center justify-between">
              <span>{word.word}</span>
              <button
                onClick={() => handleDelete(word.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Icons.trash className="h-5 w-5" />
              </button>
            </li>
          ))}
          {allWords?.length === 0 && <p>no words</p>}
        </ul>
      </div>
    </section>
  );
}
