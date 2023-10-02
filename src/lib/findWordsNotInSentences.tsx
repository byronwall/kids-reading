import { type DetailedLearningPlan } from "~/types/models";

export function findWordsNotInSentences(plan: DetailedLearningPlan) {
  // Create a set of all word IDs in sentences for quick lookup
  const sentenceWordIds = new Set<string>();
  plan.sentences.forEach((sentence) => {
    sentence.words.forEach((word) => {
      sentenceWordIds.add(word.id);
    });
  });

  // Filter out words that are not present in any sentence
  const wordsNotInSentences: DetailedLearningPlan["lessons"][0]["words"] = [];

  plan.lessons.forEach((lesson) => {
    lesson.words.forEach((word) => {
      if (!sentenceWordIds.has(word.id)) {
        wordsNotInSentences.push(word);
      }
    });
  });

  return wordsNotInSentences;
}
