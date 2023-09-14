// get all unique words from sentences, remove punctuation and case
export function getWordsForSentence(sentence: string): string[] {
  const words = sentence.replace(/\s+/g, " ").split(" ");
  const cleanedWords = words.map((word) =>
    word.replace(/[^a-zA-Z']/g, "").toLowerCase()
  );
  const filteredWords = cleanedWords.filter((word) => word !== "");
  return filteredWords;
}
