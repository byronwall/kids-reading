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
