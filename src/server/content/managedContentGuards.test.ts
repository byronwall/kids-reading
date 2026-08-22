import { describe, expect, it } from "vitest";

import {
  assertSentenceCanBeMutated,
  assertWordCanBeMutated,
  isManagedSentence,
} from "./managedContentGuards";

describe("managed content guards", () => {
  it("recognizes a sentence marked as managed", () => {
    expect(isManagedSentence({ id: "sentence-1", isManaged: true })).toBe(true);
  });

  it("recognizes a sentence attached to managed curriculum", () => {
    expect(
      isManagedSentence({
        id: "sentence-1",
        isManaged: false,
        lessonSentences: [{ lesson: { isManaged: true } }],
      })
    ).toBe(true);
  });

  it("allows custom sentences", () => {
    expect(() =>
      assertSentenceCanBeMutated(
        { id: "sentence-1", isManaged: false },
        "edited"
      )
    ).not.toThrow();
  });

  it("rejects mutations to managed sentences", () => {
    expect(() =>
      assertSentenceCanBeMutated(
        { id: "sentence-1", isManaged: true },
        "deleted"
      )
    ).toThrow("Managed curriculum sentence sentence-1 cannot be deleted");
  });

  it("allows words that are not used by managed lessons", () => {
    expect(() => assertWordCanBeMutated("word-1", false)).not.toThrow();
  });

  it("rejects words used by managed lessons", () => {
    expect(() => assertWordCanBeMutated("word-1", true)).toThrow(
      "Word word-1 is used by managed curriculum content and cannot be deleted"
    );
  });
});
