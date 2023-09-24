import { v4 as uuidv4 } from "uuid";
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

  getAllAwardImages: protectedProcedure.query(async () => {
    return prisma.awardImages.findMany();
  }),

  addImageIdToAward: protectedProcedure
    .input(
      z.object({
        awardId: z.string(),
        imageId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await prisma.profileAward.update({
        where: {
          id: input.awardId,
        },
        data: {
          imageId: input.imageId,
        },
      });
    }),

  __TEMP__updateGroupIds: protectedProcedure.mutation(
    async ({ ctx, input }) => {
      if (1 + 1 === 2) {
        throw new Error("This is a temporary endpoint that should not be used");
      }

      // get all results that have ""  as the groupId
      const results = await prisma.profileQuestionResult.findMany({});

      // process those results:
      // group based on the minute of createdAt
      // then assign a UUID to each group
      // then update the groupId of each result in that group to be the UUID
      // then return the updated results

      const groupedResults = results.reduce((acc, result) => {
        const createdAtMinute = result.createdAt.getTime() / 1000;

        // search for an entry within 10 seconds of timestamp
        // if found, add to that group
        // if not found, create a new group

        const existingGroup = Object.keys(acc).find((key) => {
          const keyAsNumber = Number(key);
          return (
            keyAsNumber >= createdAtMinute - 10 &&
            keyAsNumber <= createdAtMinute + 10
          );
        });

        if (existingGroup) {
          acc[Number(existingGroup)]!.push(result);
          return acc;
        }

        if (!acc[createdAtMinute]) {
          acc[createdAtMinute] = [];
        }
        acc[createdAtMinute]!.push(result);
        return acc;
      }, {} as Record<number, typeof results>);

      const updatedResults = await Promise.all(
        Object.values(groupedResults).map(async (group) => {
          const groupId = uuidv4();

          return await Promise.all(
            group.map((result) =>
              prisma.profileQuestionResult.update({
                where: {
                  id: result.id,
                },
                data: {
                  groupId,
                },
              })
            )
          );
        })
      );

      return updatedResults;
    }
  ),
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
