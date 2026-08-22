import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { parseCurriculumFile } from "./parser";
import { validateCurriculum } from "./validate";

import type { CurriculumChunk } from "./schema";

export const DEFAULT_CURRICULUM_ROOT = path.resolve(
  process.cwd(),
  "content/curriculum/foundational-phonics"
);

export async function loadCurriculum(
  curriculumRoot = DEFAULT_CURRICULUM_ROOT
): Promise<CurriculumChunk[]> {
  const filenames = (await readdir(curriculumRoot))
    .filter((filename) => filename.endsWith(".md"))
    .sort();

  const chunks = await Promise.all(
    filenames.map(async (filename) => {
      const sourcePath = path.join(curriculumRoot, filename);
      const contents = await readFile(sourcePath, "utf8");
      return parseCurriculumFile(contents, sourcePath);
    })
  );

  return validateCurriculum(chunks);
}
