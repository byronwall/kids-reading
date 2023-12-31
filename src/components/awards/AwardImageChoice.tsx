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
    await utils.awardRouter.getAllAwardImages.invalidate();
  };

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Icons.spinner className="h-16 w-16 animate-spin rounded-full bg-white" />
        </div>
      )}
      <Image
        key={image.id}
        src={image.imageUrl}
        alt={"Award image"}
        width={512}
        height={512}
        onClick={() =>
          !isLoading && shouldClickToClaim && handleAddImageIdToAward(image.id)
        }
      />
      {shouldShowDelete && (
        <ButtonLoading
          onClick={() => handleDeleteImage(image.id)}
          isLoading={deleteImage.isLoading}
        >
          Delete
        </ButtonLoading>
      )}
    </div>
  );
}
