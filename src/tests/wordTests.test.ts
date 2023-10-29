import { expect, test } from "vitest";

import { getSyllables } from "~/lib/splitArpabet";

// these are words where the syllable break seems off by one
// trying to fix them currently breaks other things in obvious ways.
const trickWords = [
  "believer",
  "unbelievable",
  "stretching",
  "belly",
  "apostle",
  "blackout",
  "timeout",
  "watching",
];

const wordsToTest2 = [
  "believe",
  "comfortable",
  "kitten",
  "couch",
  "dog",
  "potato",
  "loyal",
  "church",
  "throat",
  "squirrel",
  "journey",
  "constable",
  "attention",
  "dictatorship",
  "ocean",
  "happiness",
  "suffering",
];

wordsToTest2.forEach((word) => {
  test("syllables for " + word, () => {
    const syllables = getSyllables(word);
    expect(syllables).toMatchSnapshot();
  });
});
