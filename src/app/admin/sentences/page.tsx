"use client";

import { useMemo, useState } from "react";

import { Button } from "~/components/ui/button";
import { Icons } from "~/components/common/icons";
import { VirtualizedList } from "~/components/common/VirtualizedList";
import { trpc } from "~/lib/trpc/client";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { AddSentenceForm } from "~/components/sentences/AddSentenceForm";
import { EditSentenceForm } from "~/components/sentences/EditSentenceForm";
import { useSentenceAdder } from "~/hooks/useSentenceAdder";
import { ButtonLoading } from "~/components/common/ButtonLoading";

const iconButtonClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700";

export default function AdminSentences() {
  const [sentenceSearch, setSentenceSearch] = useState("");
  const utils = trpc.useContext();

  const {
    data: allSentences,
    isInitialLoading: isLoadingAllSentences,
    isError: isAllSentencesError,
  } = trpc.sentencesRouter.getAllSentences.useQuery();

  const filteredSentences = useMemo(() => {
    if (!allSentences) {
      return [];
    }

    const normalizedSearch = sentenceSearch.trim().toLocaleLowerCase();

    if (!normalizedSearch) {
      return allSentences;
    }

    return allSentences.filter((sentence) => {
      const words = sentence.words.map((word) => word.word).join(" ");

      return `${sentence.fullSentence} ${words}`
        .toLocaleLowerCase()
        .includes(normalizedSearch);
    });
  }, [allSentences, sentenceSearch]);

  const {
    data: newSentences,
    refetch,
    isInitialLoading: isLoadingSentences,
  } = trpc.sentencesRouter.getNewSentencesForWords.useQuery([], {
    enabled: false,
  });

  const { handleAddSentences } = useSentenceAdder();

  const deleteSentenceMutation =
    trpc.sentencesRouter.deleteSentence.useMutation();

  const handleDeleteSentence = async (sentenceId: string) => {
    // do a confirm check
    const confirm = window.confirm(
      "Are you sure you want to delete this sentence?"
    );

    if (!confirm) {
      return;
    }

    await deleteSentenceMutation.mutateAsync({
      sentenceId,
    });

    // invalidate the query so that it will refetch
    await utils.sentencesRouter.getAllSentences.invalidate();
  };

  const updateWordCountMutation =
    trpc.sentencesRouter.updateWordCountForAllSentences.useMutation();

  const handleUpdateWordCount = async () => {
    await updateWordCountMutation.mutateAsync();

    // invalidate the query so that it will refetch
    await utils.sentencesRouter.getAllSentences.invalidate();
  };

  return (
    <div className="text-left">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          Sentences
        </h1>
        <p className="mt-2 max-w-prose text-base text-stone-600">
          Add practice sentences by hand, generate them with GPT, or manage the
          existing list.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="border-b pb-2 text-xl font-semibold tracking-tight text-stone-900">
          Add sentences
        </h2>
        <div className="mt-4">
          <AddSentenceForm />
        </div>
        <div className="mt-4">
          <ButtonLoading
            onClick={() => handleUpdateWordCount()}
            isLoading={updateWordCountMutation.isLoading}
            variant="outline"
          >
            Add word count to all sentences
          </ButtonLoading>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="border-b pb-2 text-xl font-semibold tracking-tight text-stone-900">
          Generate with GPT
        </h2>
        <p className="mt-3 max-w-prose rounded-md bg-stone-100 px-3 py-2 font-mono text-xs leading-5 text-stone-600">
          &quot;Please give me 10 very simple sentences using long vowels,
          short vowels, and rhyming. First grade level.&quot;
        </p>
        <div className="mt-4 flex items-center gap-3">
          <Button
            onClick={() => refetch()}
            disabled={isLoadingSentences}
            className="bg-green-700 text-white hover:bg-green-800 focus-visible:ring-green-700"
          >
            Generate sentences for words
          </Button>
          {isLoadingSentences && (
            <span className="flex items-center gap-2 text-sm text-stone-500" role="status">
              Loading…
              <Icons.spinner className="h-4 w-4 animate-spin" />
            </span>
          )}
        </div>
        {!isLoadingSentences && newSentences?.length ? (
          <div className="mt-5 rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-stone-700">
                {newSentences.length} generated sentences
              </p>
              <Button
                onClick={() => handleAddSentences(newSentences)}
                size="sm"
                variant="outline"
              >
                Add all
              </Button>
            </div>
            <ul className="mt-3 divide-y divide-stone-100">
              {newSentences?.map((sentence) => (
                <li
                  key={sentence}
                  className="flex items-center justify-between gap-3 py-2"
                >
                  <span className="text-base text-stone-800">{sentence}</span>
                  <button
                    type="button"
                    onClick={() => handleAddSentences([sentence])}
                    aria-label={`Add sentence: ${sentence}`}
                    title="Add this sentence"
                    className={`${iconButtonClass} text-green-700 hover:bg-green-50`}
                  >
                    <Icons.add className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section>
        <h2 className="border-b pb-2 text-xl font-semibold tracking-tight text-stone-900">
          All sentences
        </h2>
        {isLoadingAllSentences ? (
          <p className="mt-4 flex items-center gap-2 text-sm text-stone-500" role="status">
            <Icons.spinner className="h-4 w-4 animate-spin" />
            Loading…
          </p>
        ) : isAllSentencesError ? (
          <p
            className="mt-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-6 text-center text-sm text-rose-800"
            role="alert"
          >
            We could not load the sentences. Please try again.
          </p>
        ) : (allSentences?.length ?? 0) === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-stone-300 px-4 py-6 text-center text-sm text-stone-500">
            No sentences yet. Add some above.
          </p>
        ) : (
          <div className="mt-4">
            <label
              htmlFor="sentence-search"
              className="sr-only"
            >
              Search sentences
            </label>
            <input
              id="sentence-search"
              type="search"
              value={sentenceSearch}
              onChange={(event) => setSentenceSearch(event.target.value)}
              placeholder="Search sentences or words"
              className="h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-base text-stone-900 shadow-sm outline-none transition focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
            />
            <p
              className="mt-2 text-sm text-stone-500"
              aria-live="polite"
            >
              Showing {filteredSentences.length} of {allSentences?.length ?? 0}{" "}
              sentences
            </p>
            {filteredSentences.length === 0 ? (
              <p className="mt-3 rounded-lg border border-dashed border-stone-300 px-4 py-6 text-center text-sm text-stone-500">
                No sentences match your search.
              </p>
            ) : (
              <VirtualizedList
                items={filteredSentences}
                getItemKey={(sentence) => sentence.id}
                resetKey={sentenceSearch}
                className="mt-3"
                itemClassName="border-b border-stone-100 last:border-b-0"
                renderItem={(sentence) => (
                  <div className="flex items-center justify-between gap-3 px-4 py-3 transition-colors hover:bg-stone-50">
                    <div className="min-w-0">
                      <span className="block text-base text-stone-800">
                        {sentence.fullSentence}
                      </span>
                      <span className="block truncate text-sm text-stone-500">
                        {sentence.words.map((word) => word.word).join(", ")}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleDeleteSentence(sentence.id)}
                        aria-label={`Delete sentence: ${sentence.fullSentence}`}
                        title="Delete this sentence"
                        className={`${iconButtonClass} text-stone-400 hover:bg-rose-50 hover:text-rose-700`}
                      >
                        <Icons.trash className="h-5 w-5" />
                      </button>

                      <Dialog>
                        <DialogTrigger asChild>
                          <button
                            type="button"
                            aria-label={`Edit sentence: ${sentence.fullSentence}`}
                            title="Edit this sentence"
                            className={`${iconButtonClass} text-stone-400 hover:bg-amber-50 hover:text-amber-950`}
                          >
                            <Icons.pencil className="h-5 w-5" />
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <EditSentenceForm
                            sentenceId={sentence.id}
                            originalFullSentence={sentence.fullSentence}
                          />
                        </DialogContent>
                      </Dialog>
                    </div>
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
