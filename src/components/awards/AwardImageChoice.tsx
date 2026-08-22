"use client";

import Image from "next/image";

import { trpc } from "~/lib/trpc/client";
import { type AwardImage } from "~/app/awards/page";
import { ButtonLoading } from "~/components/common/ButtonLoading";
import { Icons } from "~/components/common/icons";

export function AwardImageChoice({
  image,
  shouldClickToClaim,
  shouldShowDelete = false,
}: {
  image: AwardImage;
  shouldClickToClaim: boolean;
  shouldShowDelete?: boolean;
}) {
  const utils = trpc.useContext();

  const addImageIdToAward = trpc.awardRouter.addImageIdToAward.useMutation();

  const isLoading = addImageIdToAward.isLoading;

  const handleAddImageIdToAward = async (imageId: string) => {
    // confirm add
    const shouldAdd = confirm(
      "Are you sure you want to add this image to the award?"
    );
    if (!shouldAdd) {
      return;
    }

    await addImageIdToAward.mutateAsync({
      imageId,
    });

    await utils.awardRouter.getAllAwardsForProfile.invalidate();
    await utils.awardRouter.getAllAwardImages.invalidate();
  };

  const deleteImage = trpc.awardRouter.deleteImage.useMutation();

  const handleDeleteImage = async (imageId: string) => {
    await deleteImage.mutateAsync({
      imageId,
    });

    await utils.awardRouter.getAllAwardImages.invalidate();
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/70">
            <Icons.spinner className="h-8 w-8 animate-spin text-green-700" />
          </div>
        )}
        <button
          type="button"
          disabled={!shouldClickToClaim || isLoading}
          onClick={() => handleAddImageIdToAward(image.id)}
          aria-label={
            shouldClickToClaim
              ? "Choose this image for the award"
              : undefined
          }
          className={`block overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-700 focus-visible:ring-offset-2 ${
            shouldClickToClaim && !isLoading
              ? "cursor-pointer transition-transform hover:scale-[1.03]"
              : "cursor-default"
          }`}
        >
          <Image
            key={image.id}
            src={image.imageUrl}
            alt="Award image choice"
            width={512}
            height={512}
            className="h-40 w-full rounded-xl object-cover"
          />
        </button>
      </div>
      {shouldShowDelete && (
        <ButtonLoading
          onClick={() => handleDeleteImage(image.id)}
          isLoading={deleteImage.isLoading}
          variant="outline"
          size="sm"
          className="text-stone-600 hover:text-rose-700"
        >
          Delete
        </ButtonLoading>
      )}
    </div>
  );
}
