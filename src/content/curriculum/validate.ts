import type { CurriculumChunk, CurriculumLesson } from "./schema";

export class CurriculumValidationError extends Error {
  constructor(readonly errors: string[]) {
    super(errors.join("\n"));
    this.name = "CurriculumValidationError";
  }
}

function tokenize(sentence: string) {
  return sentence
    .replace(/[.!?,;:]$/g, "")
    .split(/\s+/)
    .map((token) => token.replace(/[^A-Za-z']/g, "").toLowerCase())
    .filter(Boolean);
}

function validateLesson(
  lesson: CurriculumLesson,
  chunk: CurriculumChunk,
  lessonIndex: number,
  priorLessons: CurriculumLesson[],
  errors: string[]
) {
  const lessonId = lesson.metadata.lesson_id;
  const expectedOrder = lessonIndex + 1;
  if (lesson.metadata.lesson_order !== expectedOrder) {
    errors.push(
      `${chunk.sourcePath}: ${lessonId} must have lesson_order ${expectedOrder}`
    );
  }

  const priorIds = new Set(
    priorLessons.map((priorLesson) => priorLesson.metadata.lesson_id)
  );
  for (const prerequisite of lesson.metadata.prerequisites) {
    if (!priorIds.has(prerequisite)) {
      errors.push(
        `${chunk.sourcePath}: ${lessonId} prerequisite ${prerequisite} must reference an earlier lesson`
      );
    }
  }
  for (const reviewLessonId of lesson.metadata.review_lesson_ids) {
    if (!priorIds.has(reviewLessonId)) {
      errors.push(
        `${chunk.sourcePath}: ${lessonId} review lesson ${reviewLessonId} must reference an earlier lesson`
      );
    }
  }

  const targetWords = new Set(lesson.targetWords);
  if (targetWords.size !== lesson.targetWords.length) {
    errors.push(`${chunk.sourcePath}: ${lessonId} has duplicate target words`);
  }
  const reviewWords = new Set(lesson.reviewWords);
  if (reviewWords.size !== lesson.reviewWords.length) {
    errors.push(`${chunk.sourcePath}: ${lessonId} has duplicate review words`);
  }
  for (const targetWord of targetWords) {
    if (reviewWords.has(targetWord)) {
      errors.push(
        `${chunk.sourcePath}: ${lessonId} word '${targetWord}' cannot be both TARGET and REVIEW`
      );
    }
  }

  const priorVocabulary = new Set(
    priorLessons.flatMap((priorLesson) => [
      ...priorLesson.targetWords,
      ...priorLesson.reviewWords,
    ])
  );
  const baselineVocabulary = new Set(
    lesson.validation.allowed_sight_words.map((sightWord) =>
      sightWord.toLowerCase()
    )
  );
  for (const reviewWord of reviewWords) {
    if (
      !priorVocabulary.has(reviewWord) &&
      !baselineVocabulary.has(reviewWord.toLowerCase())
    ) {
      errors.push(
        `${chunk.sourcePath}: ${lessonId} review word '${reviewWord}' is not in an earlier lesson`
      );
    }
  }

  const sentenceIds = lesson.sentences.map((sentence) => sentence.sentence_id);
  const sentenceIdSet = new Set(sentenceIds);
  if (sentenceIdSet.size !== sentenceIds.length) {
    errors.push(`${chunk.sourcePath}: ${lessonId} has duplicate sentence IDs`);
  }
  lesson.sentences.forEach((sentence, sentenceIndex) => {
    const expectedId = `${lessonId}-sentence-${String(
      sentenceIndex + 1
    ).padStart(2, "0")}`;
    if (sentence.sentence_id !== expectedId) {
      errors.push(
        `${chunk.sourcePath}: ${lessonId} sentence ${
          sentenceIndex + 1
        } must have ID ${expectedId}`
      );
    }
  });

  const allowedWords = new Set([
    ...lesson.targetWords,
    ...lesson.reviewWords,
    ...priorVocabulary,
    ...baselineVocabulary,
  ]);
  for (const sentence of lesson.sentences) {
    for (const token of tokenize(sentence.text)) {
      if (!allowedWords.has(token)) {
        errors.push(
          `${chunk.sourcePath}: ${sentence.sentence_id} uses unlisted word '${token}'`
        );
      }
    }
  }

  if (
    lesson.validation.expected_target_word_count !== lesson.targetWords.length
  ) {
    errors.push(
      `${chunk.sourcePath}: ${lessonId} target word count does not match Validation`
    );
  }
  if (lesson.validation.expected_sentence_count !== lesson.sentences.length) {
    errors.push(
      `${chunk.sourcePath}: ${lessonId} sentence count does not match Validation`
    );
  }
  if (lesson.targetWords.length < 20 || lesson.targetWords.length > 40) {
    errors.push(
      `${chunk.sourcePath}: ${lessonId} must have 20 to 40 target words`
    );
  }
  if (lesson.reviewWords.length < 5 || lesson.reviewWords.length > 10) {
    errors.push(
      `${chunk.sourcePath}: ${lessonId} must have 5 to 10 review words`
    );
  }
  if (lesson.sentences.length < 10 || lesson.sentences.length > 20) {
    errors.push(
      `${chunk.sourcePath}: ${lessonId} must have 10 to 20 practice sentences`
    );
  }
}

export function validateCurriculum(chunks: CurriculumChunk[]) {
  const errors: string[] = [];
  const planMetadata = new Map<string, string>();

  const chunksByPlan = new Map<string, CurriculumChunk[]>();
  for (const chunk of chunks) {
    const planId = chunk.frontMatter.plan_id;
    const planChunks = chunksByPlan.get(planId) ?? [];
    planChunks.push(chunk);
    chunksByPlan.set(planId, planChunks);
  }

  const sortedPlans = [...chunksByPlan.entries()].sort(
    ([planIdA, chunksA], [planIdB, chunksB]) =>
      chunksA[0]!.frontMatter.plan_order - chunksB[0]!.frontMatter.plan_order ||
      planIdA.localeCompare(planIdB)
  );
  const sortedChunks: CurriculumChunk[] = [];

  for (const [planId, planChunks] of sortedPlans) {
    const sortedPlanChunks = [...planChunks].sort(
      (a, b) => a.frontMatter.chunk_order - b.frontMatter.chunk_order
    );
    const chunkIds = new Set<string>();
    const lessonIds = new Set<string>();
    const sentenceIds = new Set<string>();
    const sentenceTexts = new Set<string>();

    for (const [chunkIndex, chunk] of sortedPlanChunks.entries()) {
      const expectedOrder = chunkIndex + 1;
      const { frontMatter, fileSummary } = chunk;
      if (frontMatter.chunk_order !== expectedOrder) {
        errors.push(
          `${chunk.sourcePath}: chunk_order must be ${expectedOrder}, got ${frontMatter.chunk_order}`
        );
      }
      if (chunkIds.has(frontMatter.chunk_id)) {
        errors.push(
          `${chunk.sourcePath}: duplicate chunk_id ${frontMatter.chunk_id} in plan ${planId}`
        );
      }
      chunkIds.add(frontMatter.chunk_id);

      const planSignature = `${frontMatter.plan_title}|${frontMatter.plan_description}|${frontMatter.age_range}|${frontMatter.plan_order}`;
      const existingPlanSignature = planMetadata.get(planId);
      if (existingPlanSignature && existingPlanSignature !== planSignature) {
        errors.push(`${chunk.sourcePath}: plan metadata differs across chunks`);
      }
      planMetadata.set(planId, planSignature);

      if (fileSummary.chunk_id !== frontMatter.chunk_id) {
        errors.push(
          `${chunk.sourcePath}: File Summary chunk_id does not match front matter`
        );
      }
      if (fileSummary.lesson_count !== chunk.lessons.length) {
        errors.push(
          `${chunk.sourcePath}: File Summary lesson_count is incorrect`
        );
      }
      if (
        fileSummary.word_count !==
        chunk.lessons.reduce(
          (count, lesson) => count + lesson.targetWords.length,
          0
        )
      ) {
        errors.push(
          `${chunk.sourcePath}: File Summary word_count is incorrect`
        );
      }
      if (
        fileSummary.sentence_count !==
        chunk.lessons.reduce(
          (count, lesson) => count + lesson.sentences.length,
          0
        )
      ) {
        errors.push(
          `${chunk.sourcePath}: File Summary sentence_count is incorrect`
        );
      }

      const priorLessons = sortedPlanChunks
        .slice(0, chunkIndex)
        .flatMap((priorChunk) => priorChunk.lessons);
      chunk.lessons.forEach((lesson, lessonIndex) => {
        const id = lesson.metadata.lesson_id;
        if (lessonIds.has(id))
          errors.push(
            `${chunk.sourcePath}: duplicate lesson_id ${id} in plan ${planId}`
          );
        lessonIds.add(id);
        lesson.sentences.forEach((sentence) => {
          if (sentenceIds.has(sentence.sentence_id)) {
            errors.push(
              `${chunk.sourcePath}: duplicate sentence_id ${sentence.sentence_id} in plan ${planId}`
            );
          }
          sentenceIds.add(sentence.sentence_id);
          const normalizedText = sentence.text.toLowerCase();
          if (sentenceTexts.has(normalizedText)) {
            errors.push(
              `${chunk.sourcePath}: duplicate sentence text '${sentence.text}'`
            );
          }
          sentenceTexts.add(normalizedText);
        });
        validateLesson(
          lesson,
          chunk,
          lessonIndex,
          [...priorLessons, ...chunk.lessons.slice(0, lessonIndex)],
          errors
        );
      });
    }
    sortedChunks.push(...sortedPlanChunks);
  }

  if (errors.length > 0) throw new CurriculumValidationError(errors);
  return sortedChunks;
}
