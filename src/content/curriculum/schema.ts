import { z } from "zod";

const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const lessonId = z.string().regex(/^lesson-\d{2}-\d{2}$/);
const sentenceId = z.string().regex(/^lesson-\d{2}-\d{2}-sentence-\d{2}$/);
const word = z.string().regex(/^(?:[a-z]+(?:'[a-z]+)?|I)$/);
const vocabularyWord = z.string().regex(/^[A-Za-z]+(?:'[A-Za-z]+)?$/);

export const CurriculumFrontMatterSchema = z
  .object({
    schema_version: z.literal(1),
    chunk_id: id,
    chunk_order: z.number().int().positive(),
    plan_id: id,
    plan_title: z.string().min(1),
    plan_description: z.string().min(1),
    age_range: z.string().regex(/^\d+-\d+$/),
    difficulty: z.number().int().min(1).max(5),
  })
  .strict();

export const LessonMetadataSchema = z
  .object({
    lesson_id: lessonId,
    lesson_order: z.number().int().positive(),
    title: z.string().min(1),
    focus: z.string().regex(/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/),
    difficulty: z.number().int().min(1).max(5),
    prerequisites: z.array(lessonId),
    target_patterns: z.array(z.string().min(1)),
    review_lesson_ids: z.array(lessonId),
  })
  .strict();

export const LessonValidationSchema = z
  .object({
    expected_target_word_count: z.number().int().positive(),
    expected_sentence_count: z.number().int().positive(),
    allowed_sight_words: z.array(vocabularyWord),
  })
  .strict();

export const FileSummarySchema = z
  .object({
    chunk_id: id,
    lesson_count: z.number().int().positive(),
    word_count: z.number().int().positive(),
    sentence_count: z.number().int().positive(),
  })
  .strict();

export const CurriculumSentenceSchema = z
  .object({
    sentence_id: sentenceId,
    text: z
      .string()
      .min(1)
      .refine(
        (value) => /^[A-Z][A-Za-z',.!? ]*[.!?]$/.test(value),
        "must start with a capital letter and end with sentence punctuation"
      ),
  })
  .strict();

export const CurriculumLessonSchema = z
  .object({
    metadata: LessonMetadataSchema,
    targetWords: z.array(word),
    reviewWords: z.array(word),
    sentences: z.array(CurriculumSentenceSchema),
    teacherNote: z.string().min(1),
    validation: LessonValidationSchema,
  })
  .strict();

export const CurriculumChunkSchema = z
  .object({
    sourcePath: z.string().min(1),
    title: z.string().min(1),
    goals: z.array(z.string().min(1)).min(1),
    frontMatter: CurriculumFrontMatterSchema,
    lessons: z.array(CurriculumLessonSchema).min(1),
    fileSummary: FileSummarySchema,
  })
  .strict();

export type CurriculumFrontMatter = z.infer<typeof CurriculumFrontMatterSchema>;
export type LessonMetadata = z.infer<typeof LessonMetadataSchema>;
export type LessonValidation = z.infer<typeof LessonValidationSchema>;
export type FileSummary = z.infer<typeof FileSummarySchema>;
export type CurriculumSentence = z.infer<typeof CurriculumSentenceSchema>;
export type CurriculumLesson = z.infer<typeof CurriculumLessonSchema>;
export type CurriculumChunk = z.infer<typeof CurriculumChunkSchema>;
