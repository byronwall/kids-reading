"use client";

import Image from "next/image";

import { cn } from "~/lib/utils";
import { type Award } from "~/app/awards/page";
import { Button } from "~/components/ui/button";
import { Icons } from "~/components/common/icons";
import { trpc } from "~/lib/trpc/client";

export function AwardCard({ award }: { award: Award }) {
  const label =
    award.awardType === "WORD_COUNT" ? (
      <Icons.badgeCent />
    ) : (
      <Icons.badgeDollarSign />
    );

  const numberAward = (
    <p className="flex items-center gap-1 text-2xl">
      <span>{award.awardValue ?? 0}</span>
      {label}
    </p>
  );

  const masteryAward = (
    <p className="text-2xl">{award.word && <span>{award.word?.word}</span>}</p>
  );

  const utils = trpc.useContext();

  const removeAwardMutation =
    trpc.awardRouter.removeImageFromAward.useMutation();

  const handleRemoveImage = async () => {
    const shouldRemove = confirm(
      "Are you sure you want to remove this picture (you can pick a new one)?"
    );

    if (!shouldRemove) return;

    await removeAwardMutation.mutateAsync({ awardId: award.id });
    await utils.awardRouter.getAllAwardsForProfile.invalidate();
  };
  return (
    <div className="flex flex-col items-center bg-gray-200">
      <span>{award.word ? masteryAward : numberAward}</span>
      <div className="group relative ">
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
          width={512}
          height={512}
          className={cn("rounded-md", {
            "border-4 border-yellow-400": !award.imageId,
          })}
        />
      </div>
    </div>
  );
}
