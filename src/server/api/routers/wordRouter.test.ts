import { describe, expect, it } from "vitest";

import { normalizeWords } from "./wordRouter.helpers";

describe("wordRouter word normalization", () => {
  it("trims, lowercases, removes blanks, and deduplicates words", () => {
    expect(normalizeWords("  Cat, DOG\n dog, ,  ")).toEqual(["cat", "dog"]);
  });
});
