"use client";

import { type Award } from "~/app/awards/page";

import { AwardCard } from "./AwardCard";

export function AwardList({ awards = [] }: { awards?: Award[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {awards.map((award) => (
        <AwardCard key={award.id} award={award} />
      ))}
    </div>
  );
}
