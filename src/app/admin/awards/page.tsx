"use client";

import { useState } from "react";

import { trpc } from "~/lib/trpc/client";
import { AwardImageChoice } from "~/components/awards/AwardImageChoice";
import { ButtonLoading } from "~/components/common/ButtonLoading";
import { Textarea } from "~/components/ui/textarea";
import { useQuerySsr } from "~/hooks/useQuerySsr";
import { ImageDropzone } from "~/components/dropzone/ImageDropzone";

export default function AdminAwardPage() {
  return <AdminAwards />;
}

function AdminAwards() {
  const { data: allAwardImages } = useQuerySsr(
    trpc.awardRouter.getAllAwardImages,
    {
      shouldLimitToProfile: false,
    }
  );

  const utils = trpc.useContext();

  const [imageUrls, setImageUrls] = useState<string>("");

  const addAwardImages = trpc.awardRouter.addImageUrlsToDb.useMutation();

  const handleAddAwardImages = async () => {
    const urls = imageUrls.split("\n").filter((url) => url.length > 0);

    await addAwardImages.mutateAsync({
      imageUrls: urls,
    });

    await utils.awardRouter.getAllAwardImages.invalidate();
    setImageUrls("");
  };

  return (
    <section className="text-left">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          Awards
        </h1>
        <p className="mt-2 max-w-prose text-base text-stone-600">
          Manage the pool of images learners can pick for their awards.
        </p>
      </header>

      <section className="mb-10">
        <h2 className="border-b pb-2 text-xl font-semibold tracking-tight text-stone-900">
          Add images
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          Drag an image file onto this area, or paste image URLs below.
        </p>
        <div className="mt-4">
          <ImageDropzone>
            <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50/50 p-5">
              <label
                htmlFor="award-image-urls"
                className="text-sm font-medium text-stone-700"
              >
                Image URLs, one per line
              </label>
              <Textarea
                id="award-image-urls"
                value={imageUrls}
                onChange={(e) => setImageUrls(e.target.value)}
                placeholder={"https://example.com/trophy.png"}
                className="mt-2 bg-white"
              />
              <div className="mt-3">
                <ButtonLoading
                  onClick={handleAddAwardImages}
                  isLoading={addAwardImages.isLoading}
                  disabled={imageUrls.trim().length === 0}
                  className="bg-green-700 text-white hover:bg-green-800 focus-visible:ring-green-700"
                >
                  Add URLs
                </ButtonLoading>
              </div>
            </div>
          </ImageDropzone>
        </div>
      </section>

      <section>
        <h2 className="border-b pb-2 text-xl font-semibold tracking-tight text-stone-900">
          Manage award images
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          Use this section to add URLs or delete images. Deleting an image
          will prompt the user to choose a new image.
        </p>
        {(allAwardImages?.length ?? 0) === 0 ? (
          <p className="mt-4 rounded-lg border border-dashed border-stone-300 px-4 py-6 text-center text-sm text-stone-500">
            No award images yet.
          </p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {(allAwardImages ?? []).map((image) => (
              <AwardImageChoice
                key={image.id}
                image={image}
                shouldClickToClaim={false}
                shouldShowDelete={true}
              />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
