import Image from "next/image";

import { cn } from "~/utils";

import { type Award } from "./page";

export function AwardCard({ award }: { award: Award }) {
  const label = award.awardType === "WORD_COUNT" ? "words" : "sentences";

  const numberAward = (
    <p className="text-2xl">
      {award.awardValue ?? 0} {label}
    </p>
  );

  const masteryAward = (
    <p className="text-2xl">{award.word && <span>{award.word?.word}</span>}</p>
  );

  return (
    <div className="flex flex-col items-center bg-gray-200">
      {award.word ? masteryAward : numberAward}

      <Image
        key={award.id}
        src={award.image?.imageUrl ?? "/placeholder.jpeg"}
        alt={"Award image"}
        width={256}
        height={256}
        className={cn("rounded-md", {
          "border-4 border-yellow-400": !award.imageId,
        })}
      />
    </div>
  );
}
