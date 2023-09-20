import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

import {
  LearningPlanCreateSchema,
  LessonBulkImportWordsSchema,
  LessonCreateSchema,
  LessonEditWordsSchema,
} from "./inputSchemas";
import { getWordsForSentence } from "./getWordsForSentence";

export const planRouter = createTRPCRouter({
  linkProfileToLesson: protectedProcedure
    .input(
      z.object({
        lessonId: z.string(),
      })
    )
    .mutation(async ({ input: { lessonId }, ctx }) => {
      const profileId = ctx.session.user.activeProfile.id;

      await prisma.profileLessonFocus.create({
        data: {
          lessonId,
          profileId,
        },
      });

      return true;
    }),

  setProfileLessonFocus: protectedProcedure
    .input(
      z.object({
        lessonId: z.string(),
        isFocused: z.boolean(),
      })
    )
    .mutation(async ({ input: { lessonId, isFocused }, ctx }) => {
      const profileId = ctx.session.user.activeProfile.id;

      // if delinking - do an update only to ensure it exists - do not want to create a new one if it was not there before

      if (isFocused) {
        await prisma.profileLessonFocus.upsert({
          where: {
            profileId_lessonId: {
              lessonId,
              profileId,
            },
          },
          update: {
            isFocused,
          },
          create: {
            lessonId,
            profileId,
            isFocused,
          },
        });
      } else {
        await prisma.profileLessonFocus.update({
          where: {
            profileId_lessonId: {
              lessonId,
              profileId,
            },
          },
          data: {
            isFocused,
          },
        });
      }

      return true;
    }),

  getAllLearningPlans: protectedProcedure.query(async ({ ctx }) => {
    const profileId = ctx.session.user.activeProfile.id;

    const plans = await prisma.learningPlan.findMany({
      include: {
        lessons: {
          orderBy: {
            order: "asc",
          },
          include: {
            words: {
              // include the count of good and bad from results
              include: {
                results: {
                  select: {
                    score: true,
                  },
                  where: {
                    profileId,
                  },
                },
              },
            },

            // return only 1 instead of array
            ProfileLessonFocus: {
              take: 1,
              where: {
                profileId,
              },
            },
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });

    // process the results to create a good count and bad count for each word
    const plansWithAugmentedResults = plans.map((plan) => {
      const lessonsWithAugmentedResults = plan.lessons.map((lesson) => {
        const wordsWithAugmentedResults = lesson.words.map((word) => {
          const goodCount = word.results.filter((r) => r.score > 50).length;
          const badCount = word.results.filter((r) => r.score <= 50).length;

          return {
            ...word,
            goodCount,
            badCount,
          };
        });

        return {
          ...lesson,
          words: wordsWithAugmentedResults,
        };
      });

      return {
        ...plan,
        lessons: lessonsWithAugmentedResults,
      };
    });

    return plansWithAugmentedResults;
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

  bulkImportLesson: protectedProcedure
    .input(LessonBulkImportWordsSchema)
    .mutation(async ({ input: { contents, learningPlanId } }) => {
      // contents should be split into lines
      const lines = contents.split("\n").filter((line) => line.length > 0);

      // contents are encoded: | topic | sub topic | words

      // combine the topic and sub topic into a single string
      // also get the words
      const data = lines.map((line) => {
        const [topic, subTopic, words] = line
          .split("|")
          .map((s) => s.trim())
          .filter((c) => c.length > 0);

        if (!topic || !subTopic || !words)
          throw new Error(`Invalid line: ${line}`);

        return {
          topic: `${topic} - ${subTopic}`,
          words,
        };
      });

      // turn those topics into lessons
      await Promise.all(
        data.map(({ topic, words }) =>
          prisma.lesson.create({
            data: {
              name: topic,
              description: "",
              order: 0,
              LearningPlan: {
                connect: {
                  id: learningPlanId,
                },
              },
              words: {
                connectOrCreate: getWordsForSentence(words).map((word) => ({
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
          })
        )
      );
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
