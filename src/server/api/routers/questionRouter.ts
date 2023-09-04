import { z } from "zod";
import { addDays } from "date-fns";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const questionRouter = createTRPCRouter({
  createQuestionsForWords: protectedProcedure.mutation(async () => {
    // find all words that do not have associated questions
    const wordsWithoutQuestions = await prisma.word.findMany({
      where: {
        questions: {
          none: {},
        },
      },
    });

    // add those questions to the database and return the count
    const createdQuestions = await prisma.question.createMany({
      data: wordsWithoutQuestions.map((word) => ({
        type: "WORD",
        metaInfo: {},
        sentenceId: null,
        wordId: word.id,
      })),
    });

    return {
      message: `${createdQuestions.count} questions created successfully!`,
    };
  }),

  getAllQuestions: publicProcedure.query(async () => {
    const questions = await prisma.question.findMany({});

    return questions;
  }),

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

    // find the questions that are relevant for those words
    const questions = await prisma.question.findMany({
      where: {
        wordId: {
          in: wordsToSchedule.map((word) => word.wordId),
        },
      },
      include: {
        word: {
          include: {
            summaries: {
              where: {
                profileId,
              },
            },
          },
        },
      },
    });

    // send back the list of questions
    return questions;
  }),

  scheduleRandomQuestions: protectedProcedure.mutation(async ({ ctx }) => {
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

  createResultAndUpdateSummary: protectedProcedure
    .input(
      z.object({
        questionId: z.string(),
        score: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { questionId, score } = input;

      const profileId = ctx.session.user.activeProfile.id;

      // find the question
      const question = await prisma.question.findUnique({
        where: {
          id: questionId,
        },
      });

      // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
      if (!question || question.wordId === null) {
        throw new Error(`Question with ID ${questionId} not found`);
      }

      // create the result
      await prisma.profileQuestionResult.create({
        data: {
          questionId,
          score,
          profileId,
          metaInfo: {},
        },
      });

      // find the summary
      const summary = await prisma.profileWordSummary.findFirst({
        where: {
          profileId,
          wordId: question.wordId,
        },
      });

      if (!summary) {
        throw new Error(
          `Summary for profile ${profileId} and word ${question.wordId} not found`
        );
      }

      // update the summary
      const nextReviewDate = summary.nextReviewDate ?? new Date();

      const factor = score > 50 ? 2 : 0.5;
      const interval = summary.interval ?? 1;
      const newInterval = Math.round(interval * factor);

      // add interval in days to review data using date-fns
      const nextReviewDateWithInterval = addDays(nextReviewDate, newInterval);

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
