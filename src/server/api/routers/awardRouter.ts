import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

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

  getAllAwardImages: protectedProcedure.query(async ({ ctx }) => {
    const profileId = ctx.session.user.activeProfile.id;

    const allAwardImages = await prisma.awardImages.findMany();

    const profileAwardImages = await prisma.profileAward.findMany({
      where: {
        profileId,
      },
      select: {
        imageId: true,
      },
    });

    // filter out any images that are already assigned to the profile
    const filteredAwardImages = allAwardImages.filter(
      (awardImage) =>
        !profileAwardImages.find(
          (profileAwardImage) => profileAwardImage.imageId === awardImage.id
        )
    );

    // shuffle those
    filteredAwardImages.sort(() => Math.random() - 0.5);

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
});
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
