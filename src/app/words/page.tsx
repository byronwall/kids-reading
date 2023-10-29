"use client";

import Link from "next/link";

import { trpc } from "~/lib/trpc/client";

export default function Page() {
  const { data: allWords } = trpc.wordRouter.getAllWords.useQuery();

  return (
    <div>
      <h1>Words</h1>
      <div className="flex max-w-3xl flex-wrap gap-3">
        {allWords?.map((word) => (
          <div
            key={word.id}
            className="cursor-pointer rounded-md bg-gray-100 p-2 shadow transition-colors duration-200 ease-in-out hover:bg-gray-200 hover:shadow-lg"
          >
            <Link href={`/words/${word.word}`}>{word.word}</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
