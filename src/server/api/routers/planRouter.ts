import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

import {
  LearningPlanCreateSchema,
  LessonCreateSchema,
  LessonEditWordsSchema,
} from "./inputSchemas";
import { getWordsForSentence } from "./getWordsForSentence";

export const planRouter = createTRPCRouter({
  getAllLearningPlans: protectedProcedure.query(async () => {
    const plans = await prisma.learningPlan.findMany({
      include: {
        lessons: {
          orderBy: {
            order: "asc",
          },
          include: {
            words: true,
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    return plans;
  }),

  createLearningPlan: protectedProcedure
    .input(LearningPlanCreateSchema)
    .mutation(async ({ input: { name, description } }) => {
      const maxOrder = await prisma.learningPlan.findFirst({
        orderBy: { order: "desc" },
      });

      const plan = await prisma.learningPlan.create({
        data: {
          name,
          description,
          order: (maxOrder?.order ?? 0) + 10,
        },
      });

      return plan;
    }),

  createLesson: protectedProcedure
    .input(LessonCreateSchema)
    .mutation(async ({ input: { name, description, learningPlanId } }) => {
      const maxOrder = await prisma.lesson.findFirst({
        where: {
          learningPlanId,
        },
        orderBy: { order: "desc" },
      });

      const lesson = await prisma.lesson.create({
        data: {
          name,
          description,
          order: (maxOrder?.order ?? 0) + 10,
          LearningPlan: {
            connect: {
              id: learningPlanId,
            },
          },
        },
      });

      return lesson;
    }),

  editLessonWords: protectedProcedure
    .input(LessonEditWordsSchema)
    .mutation(async ({ input: { lessonId, words } }) => {
      const allWords = getWordsForSentence(words);

      const lesson = await prisma.lesson.update({
        where: {
          id: lessonId,
        },
        data: {
          words: {
            connectOrCreate: allWords.map((word) => ({
              where: {
                word,
              },
              create: {
                word,
                metaInfo: {},
              },
            })),
          },
        },
      });

      return lesson;
    }),
});
