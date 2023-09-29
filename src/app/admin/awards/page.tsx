"use client";

import { useState } from "react";

import { trpc } from "~/app/_trpc/client";
import { AwardImageChoice } from "~/app/awards/AwardImageChoice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ButtonLoading } from "~/components/ButtonLoading";
import { Textarea } from "~/components/ui/textarea";
import { useQuerySsr } from "~/hooks/useQuerySsr";

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
  };

  return (
    <section>
      <h1>awards</h1>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Add images to award choices</CardTitle>
          <CardDescription>
            Paste a set of image URLs here to add to DB
          </CardDescription>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Manage award images</CardTitle>
          <CardDescription>
            Use this section to add URLs or delete images. Deleting an image
            will prompt the user to choose a new image.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {(allAwardImages ?? []).map((image) => (
              <AwardImageChoice
                key={image.id}
                image={image}
                shouldClickToClaim={false}
                shouldShowDelete={true}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
