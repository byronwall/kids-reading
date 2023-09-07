import { z } from "zod";
import { addDays } from "date-fns";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const questionRouter = createTRPCRouter({
  getScheduledQuestions: protectedProcedure.query(async ({ ctx }) => {
    const profileId = ctx.session.user.activeProfile.id;

    // get words from ProfileWordSummary
    const wordsToSchedule = await prisma.profileWordSummary.findMany({
      where: {
        nextReviewDate: {
          lte: new Date(),
        },

        profileId,
      },
      include: {
        word: true,
      },
    });

    return wordsToSchedule;
  }),

  scheduleRandomQuestions: protectedProcedure.mutation(async ({ ctx }) => {
    // TODO: long term this is replaced by "plans"
    const profileId = ctx.session.user.activeProfile.id;

    // pick 20 random words that do not exist in the summary table for the current profile
    const wordsToSchedule = await prisma.word.findMany({
      where: {
        summaries: {
          none: {
            profileId,
          },
        },
      },
      take: 20,
    });

    console.log("wordsToSchedule random assignment", wordsToSchedule);

    // create a summary for each of those words
    await prisma.profileWordSummary.createMany({
      data: wordsToSchedule.map((word) => ({
        profileId,
        wordId: word.id,
        metaInfo: {},
      })),
    });

    return {
      message: `${wordsToSchedule.length} words scheduled successfully!`,
    };
  }),

  createResultAndUpdateSummaryForWord: protectedProcedure
    .input(
      z.object({
        wordId: z.string(),
        score: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { wordId, score } = input;

      if (!wordId) {
        throw new Error("wordId must be provided");
      }

      const profileId = ctx.session.user.activeProfile.id;

      // create the result
      await prisma.profileQuestionResult.create({
        data: {
          wordId,
          sentenceId: null,
          score,
          profileId,
          metaInfo: {},
        },
      });

      if (wordId) {
      }

      // find the summary
      const summary = await prisma.profileWordSummary.findFirst({
        where: {
          profileId,
          wordId,
        },
      });

      if (!summary) {
        throw new Error(
          `Summary for profile ${profileId} and word ${wordId} not found`
        );
      }

      // update the summary

      const factor = score > 50 ? 2 : 0.5;
      const interval = summary.interval ?? 1;
      const newInterval = Math.round(interval * factor);

      // add interval in days to review data using date-fns
      // new date is today plus interval
      const nextReviewDateWithInterval = addDays(new Date(), newInterval);

      await prisma.profileWordSummary.update({
        where: {
          id: summary.id,
        },
        data: {
          nextReviewDate: nextReviewDateWithInterval,
          interval: newInterval,
        },
      });

      return {
        message: `Result created successfully!`,
      };
    }),
});
