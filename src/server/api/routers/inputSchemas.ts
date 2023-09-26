import { z } from "zod";

// these are stored in their own file so they can be imported client side

export const LearningPlanCreateSchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
});

export const LessonCreateSchema = z.object({
  name: z.string().nonempty(),
  description: z.string(),
  learningPlanId: z.string(),
});

export const LessonEditWordsSchema = z.object({
  lessonId: z.string(),
  words: z.string(),
});

export const LessonBulkImportWordsSchema = z.object({
  contents: z.string(),
  learningPlanId: z.string(),
});

export const AddSentenceSchema = z.object({
  rawInput: z.string(),
});

export const EditSentenceSchema = z.object({
  id: z.string(),
  newFullSentence: z.string(),
});

// build schema from these goals
// Goals:

//  Attempt to generate sentences that contain multiple desired words at the same time. Goal is to make it easier for a user to knock out their next words.
//  Allow user to aim for a desired reading level or range of levels.
//  Provide a toggle to control whether proper names are included
//  Provide a toggle to control whether rhyming is desired
//  Provide a toggle for alliteration
//  Allow user to give a desired number of sentences - or provide a template based on the words desired
export const GptSentenceSchema = z.object({
  // this will prompt to create sentences with multiple words
  __rawWordGroups: z.string().optional(),
  wordGroups: z.array(z.array(z.string())).optional(),

  // expect a Fauntis reading level
  readingLevel: z.string().length(1),
  includeProperNames: z.boolean(),
  includeRhyming: z.boolean(),
  includeAlliteration: z.boolean(),
  numberOfSentences: z.number().optional(),
});
