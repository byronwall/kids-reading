import { z } from "zod";
import { PrismaClient } from "@prisma/client";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { generateSentenceWithWords } from "~/server/openai/generations";

import { getWordsForSentence } from "./getWordsForSentence";

const prisma = new PrismaClient();

export const sentencesRouter = createTRPCRouter({
  getNewSentencesForWords: protectedProcedure
    // input array is string or undefined
    .input(z.array(z.string().optional()))
    .query(async ({ input }) => {
      const words = input.filter((word) => word !== undefined) as string[];

      const sentences = await generateSentenceWithWords(words);

      return sentences;
    }),

  addSentencesAndWords: protectedProcedure
    .input(
      z.object({
        sentences: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      const { sentences } = input;

      type SentenceAug = {
        sentence: string;
        words: string[];
      };

      const sentencesAug: SentenceAug[] = sentences.map((sentence) => {
        return {
          sentence,
          words: getWordsForSentence(sentence),
        };
      });

      // now process the sentences -- need to link up the word IDs with some sort of query
      // relevant example: https://www.prisma.io/docs/concepts/components/prisma-client/crud#create-a-deeply-nested-tree-of-records
      // notes: need the include section; could only do create, not createMany

      for (const sentence of sentencesAug) {
        await prisma.sentence.create({
          include: {
            words: true,
          },
          data: {
            fullSentence: sentence.sentence,
            metaInfo: {},
            words: {
              connectOrCreate: sentence.words.map((word) => ({
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
      }

      return {
        message: "Successfully added new words and sentences",
      };
    }),
});
