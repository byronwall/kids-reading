"use client";

import Image from "next/image";

import { type Award } from "./page";

export function AwardCard({ award }: { award: Award }) {
  return (
    <div className="flex  flex-col items-center bg-gray-200">
      <p>{award.awardType}</p>
      <p>{award.awardValue ?? 0}</p>
      {award.word && <p>{award.word.word}</p>}
      {award.image && (
        <Image
          key={award.id}
          src={award.image.imageUrl}
          alt={"Award image"}
          width={256}
          height={256}
        />
      )}
    </div>
  );
}
