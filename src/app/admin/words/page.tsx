"use client";

import { useMemo, useState } from "react";

import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import { Icons } from "~/components/common/icons";
import { VirtualizedList } from "~/components/common/VirtualizedList";
import { trpc } from "~/lib/trpc/client";

const deleteButtonClass =
  "inline-flex h-11 w-11 items-center justify-center rounded-md text-stone-400 transition-colors hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700";

export default function AdminWords() {
  const [words, setWords] = useState("");
  const [wordSearch, setWordSearch] = useState("");

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

  const {
    data: allWords,
    isError: isAllWordsError,
    isInitialLoading: isLoadingAllWords,
  } = trpc.wordRouter.getAllWords.useQuery();

  const filteredWords = useMemo(() => {
    if (!allWords) {
      return [];
    }

    const normalizedSearch = wordSearch.trim().toLocaleLowerCase();

    if (!normalizedSearch) {
      return allWords;
    }

    return allWords.filter((word) =>
      word.word.toLocaleLowerCase().includes(normalizedSearch)
    );
  }, [allWords, wordSearch]);

  const handleSave = async () => {
    await addWordMutation.mutateAsync(words);
    setWords("");
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
    <div className="text-left">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          Words
        </h1>
        <p className="mt-2 max-w-prose text-base text-stone-600">
          Manage the words available for practice and sentence creation.
        </p>
      </header>

      <section className="mb-10 rounded-xl border border-amber-200/80 bg-amber-50/60 p-5 sm:p-6">
        <h2 className="text-lg font-semibold tracking-tight text-amber-950">
          Add words
        </h2>
        <div className="mt-4 grid w-full gap-1.5">
          <Label htmlFor="message">Enter words with commas to separate.</Label>
          <Textarea
            placeholder={"cat, dog, hat"}
            id="message"
            value={words}
            onChange={handleWordsChange}
            className="bg-white"
          />
          <div className="mt-2">
            <Button
              onClick={handleSave}
              disabled={!words.trim() || addWordMutation.isLoading}
              className="bg-green-700 text-white hover:bg-green-800 focus-visible:ring-green-700"
            >
              Save
            </Button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="border-b pb-2 text-xl font-semibold tracking-tight text-stone-900">
          All words
        </h2>
        {isLoadingAllWords ? (
          <p
            className="mt-4 flex items-center gap-2 text-sm text-stone-500"
            role="status"
          >
            <Icons.spinner className="h-4 w-4 animate-spin" />
            Loading…
          </p>
        ) : isAllWordsError ? (
          <p
            className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-6 text-center text-sm text-rose-800"
            role="alert"
          >
            We could not load the words. Please try again.
          </p>
        ) : (allWords?.length ?? 0) === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-stone-300 px-4 py-6 text-center text-sm text-stone-500">
            No words yet. Add some above.
          </p>
        ) : (
          <div className="mt-4">
            <label htmlFor="word-search" className="sr-only">
              Search words
            </label>
            <input
              id="word-search"
              type="search"
              value={wordSearch}
              onChange={(event) => setWordSearch(event.target.value)}
              placeholder="Search words"
              className="h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-base text-stone-900 shadow-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
            />
            <p className="mt-2 text-sm text-stone-500" aria-live="polite">
              Showing {filteredWords.length} of {allWords?.length ?? 0}{" "}
              {allWords?.length === 1 ? "word" : "words"}
            </p>
            {filteredWords.length === 0 ? (
              <p className="mt-3 rounded-lg border border-dashed border-stone-300 px-4 py-6 text-center text-sm text-stone-500">
                No words match your search.
              </p>
            ) : (
              <VirtualizedList
                items={filteredWords}
                getItemKey={(word) => word.id}
                resetKey={wordSearch}
                className="mt-3"
                itemClassName="border-b border-stone-100"
                renderItem={(word) => (
                  <div className="flex min-h-16 items-center justify-between gap-3 px-4 py-2 transition-colors hover:bg-stone-50">
                    <span className="text-base text-stone-800">
                      {word.word}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDelete(word.id)}
                      aria-label={`Delete word: ${word.word}`}
                      title="Delete this word"
                      className={deleteButtonClass}
                    >
                      <Icons.trash className="h-5 w-5" />
                    </button>
                  </div>
                )}
              />
            )}
          </div>
        )}
      </section>
    </div>
  );
}
