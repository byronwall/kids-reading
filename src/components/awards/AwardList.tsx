"use client";

import { type Award } from "~/app/awards/page";

import { AwardCard } from "./AwardCard";

export function AwardList({ awards = [] }: { awards?: Award[] }) {
  if (awards.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-stone-300 px-4 py-6 text-center text-sm text-stone-500">
        No awards here yet. They appear after practice.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
      {awards.map((award) => (
        <AwardCard key={award.id} award={award} />
      ))}
    </div>
  );
}
