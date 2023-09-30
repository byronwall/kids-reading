"use client";

import Image from "next/image";

import { trpc } from "~/app/_trpc/client";
import { type AwardImage } from "~/app/awards/page";
import { ButtonLoading } from "~/components/ButtonLoading";

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
  };

  const deleteImage = trpc.awardRouter.deleteImage.useMutation();

  const handleDeleteImage = async (imageId: string) => {
    await deleteImage.mutateAsync({
      imageId,
    });

    await utils.awardRouter.getAllAwardImages.invalidate();
  };

  return (
    <div>
      <Image
        key={image.id}
        src={image.imageUrl}
        alt={"Award image"}
        width={256}
        height={256}
        onClick={() => shouldClickToClaim && handleAddImageIdToAward(image.id)}
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
