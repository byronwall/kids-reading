"use client";

import Image from "next/image";

import { cn } from "~/lib/utils";
import { type Award } from "~/app/awards/page";
import { Button } from "~/components/ui/button";
import { Icons } from "~/components/common/icons";
import { trpc } from "~/lib/trpc/client";

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

  const utils = trpc.useContext();

  const removeAwardMutation =
    trpc.awardRouter.removeImageFromAward.useMutation();

  const handleRemoveImage = async () => {
    await removeAwardMutation.mutateAsync({ awardId: award.id });
    await utils.awardRouter.getAllAwardsForProfile.invalidate();
  };
  return (
    <div className="flex flex-col items-center bg-gray-200">
      <span>{award.word ? masteryAward : numberAward}</span>
      <div className="group relative">
        {award.image !== null && (
          <div className="absolute right-0 top-0 hidden group-hover:block">
            <Button variant="ghost" size="sm" onClick={handleRemoveImage}>
              <Icons.close />
            </Button>
          </div>
        )}

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
    </div>
  );
}
