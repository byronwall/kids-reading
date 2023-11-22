"use client";

import { type Award } from "~/app/awards/page";

import { AwardCard } from "./AwardCard";

export function AwardList({ awards = [] }: { awards?: Award[] }) {
  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 ">
      {awards.map((award) => (
        <AwardCard key={award.id} award={award} />
      ))}
    </div>
  );
}
