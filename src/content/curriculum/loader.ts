import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

import { CurriculumParseError, parseCurriculumFile } from "./parser";
import { validateCurriculum } from "./validate";

import type { CurriculumChunk } from "./schema";

export const DEFAULT_CURRICULUM_ROOT = path.resolve(
  process.cwd(),
  "content/curriculum"
);

export async function loadCurriculum(
  curriculumRoot = DEFAULT_CURRICULUM_ROOT
): Promise<CurriculumChunk[]> {
  const entries = await readdir(curriculumRoot, { withFileTypes: true });
  const directFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => path.join(curriculumRoot, entry.name));
  const planDirectories = entries
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((entry) => path.join(curriculumRoot, entry.name));

  // A direct directory remains a valid single-plan root for callers and tests.
  // The repository root uses child directories so each plan has an isolated corpus.
  const files = [
    ...directFiles,
    ...(
      await Promise.all(
        planDirectories.map(async (directory) => {
          const childEntries = await readdir(directory, {
            withFileTypes: true,
          });
          return childEntries
            .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((entry) => path.join(directory, entry.name));
        })
      )
    ).flat(),
  ].sort((a, b) => a.localeCompare(b));

  const chunks = await Promise.all(
    files.map(async (sourcePath) => {
      const contents = await readFile(sourcePath, "utf8");
      const chunk = parseCurriculumFile(contents, sourcePath);
      const parentDirectory = path.basename(path.dirname(sourcePath));
      if (
        planDirectories.includes(path.dirname(sourcePath)) &&
        parentDirectory !== chunk.frontMatter.plan_id
      ) {
        throw new CurriculumParseError(
          `plan directory '${parentDirectory}' does not match plan_id '${chunk.frontMatter.plan_id}'`,
          sourcePath
        );
      }
      return chunk;
    })
  );

  return validateCurriculum(chunks);
}
