"use client";

import Image from "next/image";

import { cn } from "~/lib/utils";
import { type Award } from "~/app/awards/page";
import { Button } from "~/components/ui/button";
import { Icons } from "~/components/common/icons";
import { trpc } from "~/lib/trpc/client";

export function AwardCard({ award }: { award: Award }) {
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

  const caption = award.word
    ? award.word.word
    : `${award.awardValue ?? 0} ${
        award.awardType === "WORD_COUNT" ? "words" : "sentences"
      }`;

  return (
    <figure className="flex flex-col items-center gap-2">
      <div className="group relative">
        {award.image !== null && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveImage}
            aria-label="Remove this picture so a new one can be picked"
            className="absolute right-1 top-1 z-10 h-9 w-9 rounded-full bg-white/90 p-0 opacity-0 shadow-sm transition-opacity focus-visible:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100"
          >
            <Icons.close className="h-4 w-4" />
          </Button>
        )}

        <Image
          key={award.id}
          src={award.image?.imageUrl ?? "/placeholder.jpeg"}
          alt={award.image ? `Award picture for ${caption}` : `Award placeholder for ${caption}`}
          width={512}
          height={512}
          className={cn("h-40 w-40 rounded-xl object-cover", {
            "border-4 border-dashed border-amber-400": !award.imageId,
          })}
        />
      </div>
      <figcaption className="text-sm font-medium text-stone-700">
        {caption}
      </figcaption>
    </figure>
  );
}
