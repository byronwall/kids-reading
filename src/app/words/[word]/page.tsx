"use client";

import { useParams } from "next/navigation";

import { getSyllables } from "~/lib/splitArpabet";

export default function WordPage() {
  const params = useParams();

  const word = params?.word ?? "";

  if (typeof word !== "string") {
    throw new Error("Word is not a string");
  }

  const { syllables, stressLevels, arpabet } = getSyllables(word);

  return (
    <div className="w-full max-w-xl text-left">
      <div className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900">
          {word}
        </h1>

        <dl className="mt-5 flex flex-col gap-4 text-sm">
          <div>
            <dt className="font-medium text-stone-500">Syllables</dt>
            <dd className="mt-1 text-lg leading-relaxed text-stone-800">
              {syllables.length > 0 ? syllables.join(" · ") : "—"}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-stone-500">Stress levels</dt>
            <dd className="mt-1 tabular-nums text-stone-800">
              {stressLevels.length > 0 ? stressLevels.join(" · ") : "—"}
            </dd>
          </div>
          <div>
            <dt className="font-medium text-stone-500">Arpabet</dt>
            <dd className="mt-1 rounded-md bg-stone-100 px-2 py-1 font-mono text-sm text-stone-700">
              {arpabet}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
