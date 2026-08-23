import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
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
    const foundational = await loadCurriculum(
      path.resolve(process.cwd(), "content/curriculum/foundational-phonics")
    );

    expect(
      foundational.slice(0, 10).map((chunk) => chunk.frontMatter.chunk_id)
    ).toEqual(
      Array.from(
        { length: 10 },
        (_, index) => `phonics-${String(index + 1).padStart(2, "0")}`
      )
    );
    expect(
      foundational.flatMap((chunk) => chunk.lessons).length
    ).toBeGreaterThanOrEqual(30);
    expect(
      foundational.flatMap((chunk) =>
        chunk.lessons.flatMap((lesson) => lesson.sentences)
      ).length
    ).toBeGreaterThanOrEqual(320);
  });

  it("keeps direct single-plan roots compatible", async () => {
    const chunks = await loadCurriculum(
      path.resolve(process.cwd(), "content/curriculum/foundational-phonics")
    );

    expect(chunks.length).toBeGreaterThanOrEqual(10);
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
    const foundational = await loadCurriculum(
      path.resolve(process.cwd(), "content/curriculum/foundational-phonics")
    );
    foundational[1]!.lessons[0]!.sentences[0]!.text =
      foundational[0]!.lessons[0]!.sentences[0]!.text;

    expect(() => validateCurriculum(foundational)).toThrow(
      /duplicate sentence text/
    );
  });

  it("allows source IDs and sentence text to repeat in another plan", async () => {
    const foundational = await loadCurriculum(
      path.resolve(process.cwd(), "content/curriculum/foundational-phonics")
    );
    const secondPlan = structuredClone(foundational[0]!);
    secondPlan.frontMatter.plan_id = "second-plan";
    secondPlan.frontMatter.plan_title = "Second Plan";
    secondPlan.frontMatter.plan_description = "An independent plan.";
    secondPlan.sourcePath = "content/curriculum/second-plan/chunk-01.md";

    expect(validateCurriculum([foundational[0]!, secondPlan])).toHaveLength(2);
  });

  it("discovers multiple plan directories without cross-plan collisions", async () => {
    const sourcePath = path.resolve(
      process.cwd(),
      "content/curriculum/foundational-phonics/phonics-01-short-vowels-cvc.md"
    );
    const source = readFileSync(sourcePath, "utf8");
    const root = mkdtempSync(path.join(tmpdir(), "kids-reading-curriculum-"));

    try {
      for (const planId of ["plan-a", "plan-b"]) {
        const directory = path.join(root, planId);
        mkdirSync(directory);
        writeFileSync(
          path.join(directory, "chunk-01.md"),
          source
            .replaceAll("foundational-phonics", planId)
            .replaceAll(
              "Foundational Phonics",
              `Plan ${planId.slice(-1).toUpperCase()}`
            )
        );
      }

      const chunks = await loadCurriculum(root);
      expect(chunks).toHaveLength(2);
      expect(new Set(chunks.map((chunk) => chunk.frontMatter.plan_id))).toEqual(
        new Set(["plan-a", "plan-b"])
      );
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it("does not use another plan's vocabulary as a prerequisite", async () => {
    const foundational = await loadCurriculum(
      path.resolve(process.cwd(), "content/curriculum/foundational-phonics")
    );
    const secondPlan = structuredClone(foundational[0]!);
    secondPlan.frontMatter.plan_id = "second-plan";
    secondPlan.frontMatter.plan_title = "Second Plan";
    secondPlan.frontMatter.plan_description = "An independent plan.";
    secondPlan.sourcePath = "content/curriculum/second-plan/chunk-01.md";
    secondPlan.lessons[0]!.reviewWords.push("chin");
    secondPlan.lessons[0]!.validation.expected_sentence_count =
      secondPlan.lessons[0]!.sentences.length;

    expect(() => validateCurriculum([foundational[0]!, secondPlan])).toThrow(
      /review word 'chin' is not in an earlier lesson/
    );
  });
});
