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
        word: true,
      },
    });

    // send back the list of questions
    return { questions, wordsToSchedule };
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
});
