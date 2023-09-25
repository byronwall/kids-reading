"use client";

import { useState } from "react";
import Image from "next/image";

import { trpc } from "~/app/_trpc/client";
import { ButtonLoading } from "~/components/ButtonLoading";
import { Textarea } from "~/components/ui/textarea";
import { type RouterOutputs } from "~/utils/api";

type Award = RouterOutputs["awardRouter"]["getAllAwardsForProfile"][number];

type AwardImage = RouterOutputs["awardRouter"]["getAllAwardImages"][number];

export default function AwardsPage() {
  const { data: awards } = trpc.awardRouter.getAllAwardsForProfile.useQuery();

  const { data: currentWordCount } =
    trpc.awardRouter.getProfileWordCount.useQuery();

  const { data: currentSentenceCount } =
    trpc.awardRouter.getProfileSentenceCount.useQuery();

  const { data: allAwardImages } =
    trpc.awardRouter.getAllAwardImages.useQuery();

  const [imageUrls, setImageUrls] = useState<string>("");

  const addAwardImages = trpc.awardRouter.addImageUrlsToDb.useMutation();

  const utils = trpc.useContext();
  const handleAddAwardImages = async () => {
    const urls = imageUrls.split("\n").filter((url) => url.length > 0);

    await addAwardImages.mutateAsync({
      imageUrls: urls,
    });

    await utils.awardRouter.getAllAwardImages.invalidate();
  };

  const wordCountAwards = awards?.filter(
    (award) => award.awardType === "WORD_COUNT"
  );

  const sentenceCountAwards = awards?.filter(
    (award) => award.awardType === "SENTENCE_COUNT"
  );

  const wordMasteryAwards = awards?.filter(
    (award) => award.awardType === "WORD_MASTERY"
  );

  const hasUnclaimedAwards = awards?.some((award) => !award.imageId) ?? false;

  // next word award is multiple of 100
  const nextWordAward = Math.ceil(((currentWordCount ?? 0) + 1) / 100) * 100;

  // next sentence award is multiple of 10
  const nextSentenceAward =
    Math.ceil(((currentSentenceCount ?? 0) + 1) / 10) * 10;

  return (
    <div>
      <h1>Awards</h1>

      <h2>Word count awards</h2>

      <p>Current word count: {currentWordCount}</p>
      <p>Next award at: {nextWordAward}</p>

      <AwardList awards={wordCountAwards} />

      <h2>Sentence count awards</h2>

      <p>Current sentence count: {currentSentenceCount}</p>
      <p>Next award at: {nextSentenceAward}</p>

      <AwardList awards={sentenceCountAwards} />

      <h2>Word mastery awards</h2>

      <AwardList awards={wordMasteryAwards} />

      {hasUnclaimedAwards && (
        <>
          <h2>Award images</h2>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {(allAwardImages ?? []).map((image) => (
              <AwardImageChoice
                key={image.id}
                image={image}
                shouldClickToClaim={hasUnclaimedAwards}
              />
            ))}
          </div>
        </>
      )}

      <Textarea
        value={imageUrls}
        onChange={(e) => setImageUrls(e.target.value)}
      />
      <ButtonLoading
        onClick={handleAddAwardImages}
        isLoading={addAwardImages.isLoading}
      >
        Add URLs
      </ButtonLoading>
    </div>
  );
}

function AwardCard({ award }: { award: Award }) {
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

function AwardImageChoice({
  image,
  shouldClickToClaim,
}: {
  image: AwardImage;
  shouldClickToClaim: boolean;
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
      <ButtonLoading
        onClick={() => handleDeleteImage(image.id)}
        isLoading={deleteImage.isLoading}
      >
        Delete
      </ButtonLoading>
    </div>
  );
}

function AwardList({ awards = [] }: { awards?: Award[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {awards.map((award) => (
        <AwardCard key={award.id} award={award} />
      ))}
    </div>
  );
}
