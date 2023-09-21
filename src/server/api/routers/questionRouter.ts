import { z } from "zod";
import { addDays } from "date-fns";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const questionRouter = createTRPCRouter({
  getUserStats: protectedProcedure.query(async ({ ctx }) => {
    const profileId = ctx.session.user.activeProfile.id;

    // query for all results sorted by newest first
    const results = await prisma.profileQuestionResult.findMany({
      where: {
        profileId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        word: true,
        sentence: true,
      },
      take: 100,
    });

    // also get all of the summaries, sorted by nextReviewDate
    const summaries = await prisma.profileWordSummary.findMany({
      where: {
        profileId,
      },
      orderBy: {
        nextReviewDate: "asc",
      },
      include: {
        word: {
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
      },
    });

    // group the results by sentence id
    const resultsBySentenceId = results.reduce((acc, result) => {
      const sentenceId = result.sentence?.id ?? result.wordId ?? "NONE";

      if (!acc[sentenceId]) {
        acc[sentenceId] = [];
      }

      acc[sentenceId]!.push(result);

      return acc;
    }, {} as Record<string, typeof results>);

    // augment the word summaries with the good and bad counts
    const summariesWithAugmentedResults = summaries.map((summary) => {
      const goodCount = summary.word.results.filter((r) => r.score > 50).length;
      const badCount = summary.word.results.filter((r) => r.score <= 50).length;

      return {
        ...summary,
        goodCount,
        badCount,
      };
    });

    return {
      results: Object.values(resultsBySentenceId),
      summaries: summariesWithAugmentedResults,
    };
  }),

  getFocusedWords: protectedProcedure.query(async ({ ctx }) => {
    const profileId = ctx.session.user.activeProfile.id;

    // go via the lesson
    const focusedLessons = await prisma.profileLessonFocus.findMany({
      where: {
        profileId: profileId,
        isFocused: true,
      },
      include: {
        lesson: {
          select: {
            words: true,
          },
        },
      },
    });

    const focusedWords = focusedLessons.flatMap(
      (lesson) => lesson.lesson.words
    );

    return focusedWords;
  }),

  getPossibleSentences: protectedProcedure.query(async ({ ctx }) => {
    const profileId = ctx.session.user.activeProfile.id;
    const wordsToFind = await getWordsForProfile(profileId);

    const focusedLessons = await prisma.profileLessonFocus.findMany({
      where: {
        profileId: profileId,
        isFocused: true,
      },
      include: {
        lesson: {
          select: {
            words: true,
          },
        },
      },
    });

    const focusedWords = focusedLessons.flatMap((lesson) =>
      lesson.lesson.words.map((word) => word.word)
    );

    // search for sentences that include those words
    const sentences = await prisma.sentence.findMany({
      where: {
        words: {
          some: {
            id: {
              in: wordsToFind.map((word) => word.wordId),
            },
          },
        },
        isDeleted: false,
      },
      include: {
        words: {
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

    const scoredSentences = sentences.map((sentence) => {
      const score = sentence.words.reduce((acc, word) => {
        const summary = word.summaries[0];

        // increase factor for focused words
        const focusedFactor = focusedWords.includes(word.word) ? 10 : 1;

        const wordScore = summary ? 1 / summary.interval : 1;

        const daysOverdue = summary
          ? Math.max(
              0,
              Math.round(
                (new Date().getTime() - summary.nextReviewDate.getTime()) /
                  (1000 * 60 * 60 * 24)
              )
            )
          : 0;

        // score is biased toward words that are overdue with a higher factor for focused words
        return acc + (wordScore + daysOverdue) * focusedFactor;
      }, 0);

      return {
        ...sentence,

        score: score / sentence.words.length,
      };
    });

    scoredSentences.sort((a, b) => b.score - a.score);

    return scoredSentences;
  }),

  getScheduledQuestions: protectedProcedure.query(async ({ ctx }) => {
    const profileId = ctx.session.user.activeProfile.id;
    return await getWordsForProfile(profileId);
  }),

  getMinTimeForNextQuestion: protectedProcedure.query(async ({ ctx }) => {
    const profileId = ctx.session.user.activeProfile.id;

    // get words from ProfileWordSummary

    const minNextReviewDate = await prisma.profileWordSummary.findFirst({
      where: {
        profileId,
      },
      select: {
        nextReviewDate: true,
      },
      orderBy: {
        nextReviewDate: "asc",
      },
    });

    return minNextReviewDate?.nextReviewDate;
  }),

  scheduleNewWords: protectedProcedure
    .input(z.object({ words: z.array(z.string()) }))
    .mutation(async ({ ctx, input }) => {
      const profileId = ctx.session.user.activeProfile.id;

      const words = input.words;

      // get all words that already have summaries
      const existingWords = await prisma.profileWordSummary.findMany({
        where: {
          profileId,
          word: {
            word: {
              in: words,
            },
          },
        },
        include: {
          word: true,
        },
      });

      // determine which input words are new
      const existingWordsSet = new Set(
        existingWords.map((word) => word.word.word)
      );

      const newWords = words.filter((word) => !existingWordsSet.has(word));

      // query to get the word ids for the new words
      const newWordIds = await prisma.word.findMany({
        where: {
          word: {
            in: newWords,
          },
        },
      });

      // create summaries for the new words
      await prisma.profileWordSummary.createMany({
        data: newWordIds.map((word) => ({
          profileId,
          wordId: word.id,
          metaInfo: {},
        })),
      });
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

  createResultForSentence: protectedProcedure
    .input(
      z.object({
        sentenceId: z.string(),
        results: z.array(
          z.object({
            wordId: z.string(),
            score: z.number().optional(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { sentenceId, results } = input;
      const profileId = ctx.session.user.activeProfile.id;

      for (const result of results) {
        await submitResultAndUpdateSchedule(
          result.wordId,
          result.score,
          profileId,
          sentenceId
        );
      }
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
      await submitResultAndUpdateSchedule(wordId, score, profileId, undefined);

      return {
        message: `Result created successfully!`,
      };
    }),
});

async function submitResultAndUpdateSchedule(
  wordId: string,
  score: number | undefined,
  profileId: string,
  sentenceId: string | undefined
) {
  await prisma.profileQuestionResult.create({
    data: {
      wordId,
      sentenceId,
      score: score ?? -1, // will use -1 to flag a skipped entry for now
      profileId,
      metaInfo: {},
    },
  });

  if (score === undefined) {
    // this is meant to be a skip - so do not proceed with the summary edit
    return;
  }

  // find the summary
  const summary = await prisma.profileWordSummary.findFirst({
    where: {
      profileId,
      wordId,
    },
  });

  // update the summary
  const factor = score > 50 ? 2 : 0.5;

  // max interval is 60 days
  const interval = summary?.interval ?? 1;
  const newInterval = Math.max(Math.min(Math.round(interval * factor), 60), 1);

  // add interval in days to review data using date-fns
  // new date is today plus interval
  const nextReviewDateWithInterval = addDays(new Date(), newInterval);

  await prisma.profileWordSummary.upsert({
    where: {
      id: summary?.id ?? "NONE",
    },
    update: {
      nextReviewDate: nextReviewDateWithInterval,
      interval: newInterval,
    },
    create: {
      nextReviewDate: nextReviewDateWithInterval,
      interval: newInterval,
      metaInfo: {},
      profileId,
      wordId,
    },
  });
}

async function getWordsForProfile(profileId: string) {
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
}
