import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const userRouter = createTRPCRouter({
  getActiveProfile: protectedProcedure.query(async ({ ctx }) => {
    const profileId = ctx.session.user.activeProfile.id;

    const activeProfile = await prisma.profile.findFirst({
      where: {
        id: profileId,
      },
    });

    return activeProfile;
  }),

  addProfile: protectedProcedure
    .input(
      z.object({
        profileName: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // create a new profile linked to that user id
      const { profileName } = input;

      const { user } = ctx.session;
      const userId = user?.id;

      const newProfile = await prisma.profile.create({
        data: {
          name: profileName,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
      return newProfile;
    }),

  getAllProfiles: protectedProcedure.query(async ({ ctx }) => {
    const { user } = ctx.session;

    const userId = user?.id;

    const profiles = await prisma.profile.findMany({
      where: {
        userId,
      },
    });

    return profiles;
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        profileId: z.string(),
        profileName: z.string().optional(),
        minimumWordCount: z.coerce.number().optional(),
        maximumWordCount: z.coerce.number().optional(),
        sentenceThresholdForAward: z.coerce.number().optional(),
        wordThresholdForAward: z.coerce.number().optional(),
        confettiWordTarget: z.coerce.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const {
        profileId,
        profileName,
        minimumWordCount,
        maximumWordCount,
        sentenceThresholdForAward,
        wordThresholdForAward,
        confettiWordTarget,
      } = input;

      const updatedProfile = await prisma.profile.update({
        where: {
          id: profileId,
        },
        data: {
          name: profileName,
          minimumWordCount,
          maximumWordCount,
          sentenceThresholdForAward,
          wordThresholdForAward,
          confettiWordTarget,
        },
      });

      return updatedProfile;
    }),
});
