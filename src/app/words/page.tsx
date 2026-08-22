"use client";

import Link from "next/link";

import { trpc } from "~/lib/trpc/client";

export default function Page() {
  const { data: allWords, isLoading } =
    trpc.wordRouter.getAllWords.useQuery();

  return (
    <div className="w-full max-w-3xl text-left">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          Words
        </h1>
        <p className="mt-2 max-w-prose text-base text-stone-600">
          {allWords
            ? `${allWords.length} words in the database. Select one to see how it breaks into syllables.`
            : "Every word in the database. Select one to see how it breaks into syllables."}
        </p>
      </header>

      {isLoading ? (
        <div className="flex flex-wrap gap-3" role="status" aria-label="Loading words">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-10 w-24 animate-pulse rounded-full bg-stone-100"
            />
          ))}
        </div>
      ) : (allWords?.length ?? 0) === 0 ? (
        <p className="rounded-xl border border-dashed border-amber-300 bg-amber-50/50 px-6 py-8 text-center text-sm text-amber-950">
          No words yet. Add words from the admin area.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2.5">
          {allWords?.map((word) => (
            <Link
              key={word.id}
              href={`/words/${word.word}`}
              className="rounded-full border border-amber-200 bg-amber-50/70 px-4 py-2 text-sm font-medium text-amber-950 transition-colors hover:border-amber-300 hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2"
            >
              {word.word}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
