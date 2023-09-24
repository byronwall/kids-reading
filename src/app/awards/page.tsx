"use client";

import { useState } from "react";
import Image from "next/image";
import { type Award } from "lucide-react";

import { trpc } from "~/app/_trpc/client";
import { ButtonLoading } from "~/components/ButtonLoading";
import { Textarea } from "~/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { type RouterOutputs } from "~/utils/api";

type Award = RouterOutputs["awardRouter"]["getAllAwardsForProfile"][number];

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

  const unclaimedAwards = awards?.filter((award) => !award.imageId);

  const addImageIdToAward = trpc.awardRouter.addImageIdToAward.useMutation();

  const handleAddImageIdToAward = async (awardId: string, imageId: string) => {
    await addImageIdToAward.mutateAsync({
      awardId,
      imageId,
    });

    await utils.awardRouter.getAllAwardsForProfile.invalidate();
  };

  const wordCountAwards = awards?.filter(
    (award) => award.awardType === "WORD_COUNT"
  );

  const sentenceCountAwards = awards?.filter(
    (award) => award.awardType === "SENTENCE_COUNT"
  );

  return (
    <div>
      <h1>Awards</h1>

      <h2>Unclaimed awards</h2>

      <div className="flex flex-wrap">
        {(unclaimedAwards ?? []).map((award) => (
          <Popover key={award.id}>
            <PopoverTrigger>
              {" "}
              <div
                key={award.id}
                className="flex h-64 w-64 flex-col items-center bg-gray-200 "
              >
                <p>{award.awardType}</p>
                <p>{award.awardValue ?? 0}</p>
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <div>
                <p>Pick your award!</p>
                <div className="flex max-w-full flex-wrap">
                  {/* pick 5 random images */}
                  {(allAwardImages ?? [])
                    .sort(() => Math.random() - 0.5)
                    .slice(0, 5)
                    .map((image) => (
                      <Image
                        key={image.id}
                        src={image.imageUrl}
                        alt={"Award image"}
                        width={256}
                        height={256}
                        onClick={() =>
                          handleAddImageIdToAward(award.id, image.id)
                        }
                      />
                    ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </div>

      <h2>Word count awards</h2>

      <p>Current word count: {currentWordCount}</p>
      <p>Next award at: {12}</p>

      <div className="flex flex-wrap">
        {wordCountAwards?.map((award) => (
          <AwardCard key={award.id} award={award} />
        ))}
      </div>

      <h2>Sentence count awards</h2>

      <p>Current sentence count: {currentSentenceCount}</p>
      <p>Next award at: {12}</p>

      <div className="flex flex-wrap">
        {sentenceCountAwards?.map((award) => (
          <AwardCard key={award.id} award={award} />
        ))}
      </div>

      <h2>Word mastery awards</h2>
      <h2>Lesson master awards</h2>

      <h2>Award images</h2>

      <div className="flex flex-wrap">
        {(allAwardImages ?? []).map((image) => (
          <Image
            key={image.id}
            src={image.imageUrl}
            alt={"Award image"}
            width={256}
            height={256}
          />
        ))}
      </div>

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
