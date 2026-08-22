import { readFileSync } from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import { loadCurriculum } from "./loader";
import { parseCurriculumFile } from "./parser";
import { validateCurriculum } from "./validate";

const firstChunkPath = path.resolve(
  process.cwd(),
  "content/curriculum/foundational-phonics/phonics-01-short-vowels-cvc.md"
);

describe("foundational phonics curriculum", () => {
  it("loads and validates the complete authored corpus", async () => {
    const chunks = await loadCurriculum();

    expect(chunks).toHaveLength(11);
    expect(chunks.flatMap((chunk) => chunk.lessons)).toHaveLength(33);
    expect(
      chunks.flatMap((chunk) =>
        chunk.lessons.flatMap((lesson) => lesson.sentences)
      )
    ).toHaveLength(367);
  });

  it("rejects a sentence without the deterministic sentence ID", () => {
    const contents = readFileSync(firstChunkPath, "utf8").replace(
      "lesson-01-01-sentence-01 | The cat sat.",
      "The cat sat."
    );

    expect(() => parseCurriculumFile(contents, "invalid.md")).toThrow(
      /sentence 1 must use/
    );
  });

  it("rejects duplicate sentence text across lessons", async () => {
    const chunks = await loadCurriculum();
    chunks[1]!.lessons[0]!.sentences[0]!.text =
      chunks[0]!.lessons[0]!.sentences[0]!.text;

    expect(() => validateCurriculum(chunks)).toThrow(/duplicate sentence text/);
  });
});
