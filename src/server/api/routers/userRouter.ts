import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const userRouter = createTRPCRouter({
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
});
