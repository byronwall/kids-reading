import { z } from "zod";
import AWS from "aws-sdk";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { env } from "~/env.mjs";

export const s3 = new AWS.S3({
  accessKeyId: env.S3_ACCESS_KEY_ID,
  secretAccessKey: env.S3_SECRET_ACCESS_KEY,
  endpoint: env.S3_ENDPOINT,
  s3ForcePathStyle: true,
  signatureVersion: "v4",
});

export const awardRouter = createTRPCRouter({
  getAllAwardsForProfile: protectedProcedure.query(({ ctx }) => {
    const profileId = ctx.session.user.activeProfile.id;

    return prisma.profileAward.findMany({
      where: {
        profileId,
      },
      include: {
        image: true,
        word: true,
      },
    });
  }),

  getProfileWordCount: protectedProcedure.query(({ ctx }) => {
    const profileId = ctx.session.user.activeProfile.id;

    return getProfileWordCount(profileId);
  }),

  getProfileSentenceCount: protectedProcedure.query(async ({ ctx }) => {
    const profileId = ctx.session.user.activeProfile.id;

    return await getProfileSentenceCount(profileId);
  }),

  addImageUrlsToDb: protectedProcedure
    .input(
      z.object({
        imageUrls: z.array(z.string()),
      })
    )

    .mutation(async ({ input }) => {
      await prisma.awardImages.createMany({
        data: input.imageUrls.map((url) => ({
          imageUrl: url,
          metaInfo: {},
        })),
        skipDuplicates: true,
      });
    }),

  deleteImage: protectedProcedure
    .input(
      z.object({
        imageId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // find any awards using that id and set to blank
      await prisma.profileAward.updateMany({
        where: {
          imageId: input.imageId,
        },
        data: {
          imageId: null,
        },
      });

      await prisma.awardImages.delete({
        where: {
          id: input.imageId,
        },
      });
    }),

  removeImageFromAward: protectedProcedure
    .input(
      z.object({
        awardId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // find any awards using that id and set to blank
      await prisma.profileAward.update({
        where: {
          id: input.awardId,
        },
        data: {
          imageId: null,
        },
      });
    }),

  getAllAwardImages: protectedProcedure
    .input(
      z.object({
        shouldLimitToProfile: z.boolean().optional().default(true),
      })
    )
    .query(async ({ ctx, input }) => {
      const profileId = ctx.session.user.activeProfile.id;
      const shouldLimitToProfile = input.shouldLimitToProfile;

      const allAwardImages = await prisma.awardImages.findMany();

      const profileAwardImages = await prisma.profileAward.findMany({
        where: {
          profileId: shouldLimitToProfile ? profileId : undefined,
        },
        select: {
          imageId: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      // filter out any images that are already assigned to the profile
      const filteredAwardImages = allAwardImages.filter(
        (awardImage) =>
          !profileAwardImages.find(
            (profileAwardImage) => profileAwardImage.imageId === awardImage.id
          )
      );

      // flip so new ones are first
      filteredAwardImages.reverse();

      return filteredAwardImages;
    }),

  addImageIdToAward: protectedProcedure
    .input(
      z.object({
        awardId: z.string().optional(),
        imageId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      let awardId = input.awardId;

      // find first null award and assign imageId to it
      if (!input.awardId) {
        const award = await prisma.profileAward.findFirst({
          where: {
            imageId: null,
          },
        });

        if (!award) {
          throw new Error("No awards left to assign");
        }

        awardId = award.id;
      }

      await prisma.profileAward.update({
        where: {
          id: awardId,
        },
        data: {
          imageId: input.imageId,
        },
      });
    }),

  uploadImageToS3: protectedProcedure
    .input(
      z.object({
        filename: z.string(),
        fileDataBase64: z.string(),
        fileMimeType: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      // Use the function
      await uploadToMinio(input);

      // use that URL to create an award image
      await prisma.awardImages.create({
        data: {
          imageUrl: "/api/images/" + input.filename,
          metaInfo: {},
        },
      });

      return true;
    }),
});

async function uploadToMinio({
  filename,
  fileDataBase64,
  fileMimeType,
}: {
  filename: string;
  fileDataBase64: string;
  fileMimeType: string;
}) {
  const fileContent = Buffer.from(fileDataBase64, "base64");

  // Set up S3 upload parameters

  try {
    // Upload the image to the MinIO bucket
    const data = await s3
      .upload({
        Bucket: env.S3_BUCKET_NAME,
        Key: filename,
        Body: fileContent,
        ContentType: fileMimeType,
      })
      .promise();
    console.log(`File uploaded successfully. ${data.Location}`);
  } catch (error) {
    console.log("Error uploading the file: ", error);
  }
}
export async function getProfileSentenceCount(profileId: any) {
  // TODO: this query is very inefficient -- do better
  const groupedResults = await prisma.profileQuestionResult.groupBy({
    by: ["groupId"],
    where: {
      profileId,
      sentenceId: {
        not: {
          equals: null,
        },
      },
      score: {
        gt: 50,
      },
    },
  });

  // filter to score > 50, then group by groupId, then count
  return groupedResults.length;
}

export function getProfileWordCount(profileId: string) {
  return prisma.profileQuestionResult.count({
    where: {
      profileId,
      wordId: {
        not: null,
      },
      score: {
        gt: 50,
      },
    },
  });
}
