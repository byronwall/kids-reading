import { z } from "zod";
import { PrismaClient } from "@prisma/client";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
  generateSentenceWithWords,
  generateSentencesWithSettings,
} from "~/server/openai/generations";

import { getWordsForSentence } from "./getWordsForSentence";
import {
  AddSentenceSchema,
  EditSentenceSchema,
  GptSentenceSchema,
} from "./inputSchemas";

const prisma = new PrismaClient();

export const sentencesRouter = createTRPCRouter({
  updateWordCountForAllSentences: protectedProcedure.mutation(async () => {
    const sentences = await prisma.sentence.findMany({
      where: {
        wordCount: {
          lte: 0,
        },
      },
      include: {
        words: {
          select: {
            id: true,
          },
        },
      },
    });

    for (const sentence of sentences) {
      console.log("sentence", sentence);
      await prisma.sentence.update({
        where: {
          id: sentence.id,
        },
        data: {
          wordCount: sentence.words.length,
        },
      });
    }

    return {
      message: "Successfully updated word count for all sentences",
    };
  }),

  getAllSentences: protectedProcedure.query(async () => {
    const sentences = await prisma.sentence.findMany({
      include: {
        words: true,
      },
      where: {
        isDeleted: false,
      },
    });

    return sentences;
  }),

  getNewSentencesForWords: protectedProcedure
    // input array is string or undefined
    .input(z.array(z.string().optional()))
    .query(async ({ input }) => {
      const words = input.filter((word) => word !== undefined) as string[];

      const sentences = await generateSentenceWithWords(words);

      return sentences;
    }),

  getGptSentences: protectedProcedure
    .input(GptSentenceSchema)
    .mutation(async ({ input }) => {
      console.log("input", input);
      // TODO: connect real logic to GPT

      const sentences = await generateSentencesWithSettings(input);

      return sentences;
    }),

  generateAndAddNewSentencesForWords: protectedProcedure
    // input array is string or undefined
    .input(z.array(z.string()))
    .mutation(async ({ input }) => {
      const words = input;

      const sentences = await generateSentenceWithWords(words);

      await processSentencesIntoDb(sentences);

      return {
        message: "Successfully added new words and sentences",
      };
    }),

  addSentencesFromString: protectedProcedure
    .input(AddSentenceSchema)
    .mutation(async ({ input }) => {
      const sentences = input.rawInput.split("\n").filter(Boolean);

      await processSentencesIntoDb(sentences);

      return {
        message: "Successfully added new words and sentences",
      };
    }),

  editSentence: protectedProcedure
    .input(EditSentenceSchema)
    .mutation(async ({ input }) => {
      const { id, newFullSentence } = input;

      // set the isDeleted flag to true for current sentence
      await prisma.sentence.update({
        where: {
          id,
        },
        data: {
          isDeleted: true,
        },
      });

      // add the new sentence
      await processSentencesIntoDb([newFullSentence]);

      return {
        message: "Successfully edited sentence",
      };
    }),

  deleteSentence: protectedProcedure
    .input(
      z.object({
        sentenceId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { sentenceId } = input;

      // set the isDeleted flag to true

      await prisma.sentence.update({
        where: {
          id: sentenceId,
        },
        data: {
          isDeleted: true,
        },
      });

      return {
        message: "Successfully deleted sentence",
      };
    }),

  addSentencesAndWords: protectedProcedure
    .input(
      z.object({
        sentences: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      const { sentences } = input;

      await processSentencesIntoDb(sentences);

      return {
        message: "Successfully added new words and sentences",
      };
    }),
});

type SentenceAug = {
  sentence: string;
  words: string[];
};

async function processSentencesIntoDb(sentences: string[]) {
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
    // check if fullSentence already present... if so, skip
    const existingSentence = await prisma.sentence.findFirst({
      where: {
        fullSentence: sentence.sentence,
      },
    });

    if (existingSentence) {
      continue;
    }

    await prisma.sentence.create({
      include: {
        words: true,
      },
      data: {
        fullSentence: sentence.sentence,
        metaInfo: {},
        wordCount: sentence.words.length,
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
}
