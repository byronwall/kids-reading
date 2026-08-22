import { z } from "zod";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { assertWordCanBeMutated } from "~/server/content/managedContentGuards";
import { prisma } from "~/server/db";

import { normalizeWords } from "./wordRouter.helpers";

export { normalizeWords } from "./wordRouter.helpers";

export const wordRouter = createTRPCRouter({
  getAllWords: publicProcedure.query(async () => {
    const words = await prisma.word.findMany({
      orderBy: {
        word: "asc",
      },
    });

    return words;
  }),

  addWords: protectedProcedure.input(z.string()).mutation(async ({ input }) => {
    const words = normalizeWords(input);
    const existingWords = await prisma.word.findMany({
      select: { word: true },
    });

    const existingWordsByNormalized = new Map<string, string[]>();
    for (const existingWord of existingWords) {
      const normalizedWord = existingWord.word.trim().toLowerCase();
      const variants = existingWordsByNormalized.get(normalizedWord) ?? [];
      variants.push(existingWord.word);
      existingWordsByNormalized.set(normalizedWord, variants);
    }

    const conflictingVariants = words.flatMap((word) => {
      const variants = existingWordsByNormalized.get(word) ?? [];
      return variants.length > 1 ? [`${word}: ${variants.join(", ")}`] : [];
    });

    if (conflictingVariants.length > 0) {
      throw new TRPCError({
        code: "CONFLICT",
        message: `Cannot add words because existing words differ only by case (${conflictingVariants.join(
          "; "
        )}). Resolve the duplicate words first.`,
      });
    }

    const newWords = words.filter((word) => !existingWordsByNormalized.has(word));

    // create words
    await prisma.word.createMany({
      data: newWords.map((word) => ({
        word,
        metaInfo: JSON.stringify({}), // add metaInfo property
      })),
    });

    return {
      message: `Words added successfully!`,
    };
  }),

  deleteWord: protectedProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const wordId = input;

      // check if word exists
      const word = await prisma.word.findUnique({
        where: {
          id: wordId,
        },
      });

      if (!word) {
        throw new Error(`Word with ID ${wordId} not found`);
      }

      const managedLessonWord = await prisma.lessonWord.findFirst({
        where: {
          wordId,
        },
        select: {
          id: true,
        },
      });

      assertWordCanBeMutated(wordId, managedLessonWord !== null);

      // delete word
      await prisma.word.delete({
        where: {
          id: wordId,
        },
      });

      return {
        message: `Word with ID ${wordId} deleted successfully!`,
      };
    }),
});
