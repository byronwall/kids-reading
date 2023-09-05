import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

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
    const _words = input.split(/,|\n/).map((word) => word.trim());

    // only unique words
    const wordsSet = new Set(_words);

    const words = Array.from(wordsSet);

    // check if word already exists
    const existingWords = await prisma.word.findMany({
      where: {
        word: {
          in: words,
        },
      },
    });

    const existingWordsSet = new Set(existingWords.map((word) => word.word));

    const newWords = words.filter((word) => !existingWordsSet.has(word));

    // create words
    await prisma.word.createMany({
      data: newWords.map((word) => ({
        word,
        metaInfo: {}, // add metaInfo property
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
