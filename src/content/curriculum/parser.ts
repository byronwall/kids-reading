import {
  CurriculumChunkSchema,
  CurriculumFrontMatterSchema,
  CurriculumLessonSchema,
  CurriculumSentenceSchema,
  FileSummarySchema,
  LessonMetadataSchema,
  LessonValidationSchema,
  type CurriculumChunk,
  type CurriculumLesson,
  type CurriculumSentence,
} from "./schema";

export class CurriculumParseError extends Error {
  constructor(message: string, readonly sourcePath = "content") {
    super(`${sourcePath}: ${message}`);
    this.name = "CurriculumParseError";
  }
}

type ParsedMap = Record<string, unknown>;

function parseScalar(raw: string, sourcePath: string, lineNumber: number) {
  const value = raw.trim();

  if (value === "[]") return [];
  if (/^-?\d+$/.test(value)) return Number(value);

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  if (value === "") return [];
  if (value.includes(": ")) {
    throw new CurriculumParseError(
      `unsupported YAML scalar on line ${lineNumber}`,
      sourcePath
    );
  }

  return value;
}

function parseSimpleYaml(block: string, sourcePath: string): ParsedMap {
  const result: ParsedMap = {};
  let currentArrayKey: string | undefined;

  for (const [index, rawLine] of block.split("\n").entries()) {
    const lineNumber = index + 1;
    const line = rawLine.replace(/\r$/, "");

    if (line.trim() === "") continue;

    const listMatch = line.match(/^(\s+)-\s+(.+)$/);
    if (listMatch) {
      if (!currentArrayKey || !Array.isArray(result[currentArrayKey])) {
        throw new CurriculumParseError(
          `list item has no array key on line ${lineNumber}`,
          sourcePath
        );
      }

      (result[currentArrayKey] as unknown[]).push(
        parseScalar(listMatch[2]!, sourcePath, lineNumber)
      );
      continue;
    }

    const keyMatch = line.match(/^([A-Za-z_][A-Za-z0-9_]*):(?:\s*(.*))?$/);
    if (!keyMatch) {
      throw new CurriculumParseError(
        `invalid YAML mapping on line ${lineNumber}`,
        sourcePath
      );
    }

    const key = keyMatch[1]!;
    const rawValue = keyMatch[2] ?? "";
    if (Object.prototype.hasOwnProperty.call(result, key)) {
      throw new CurriculumParseError(
        `duplicate YAML key '${key}' on line ${lineNumber}`,
        sourcePath
      );
    }

    const value = parseScalar(rawValue, sourcePath, lineNumber);
    result[key] = value;
    currentArrayKey = Array.isArray(value) ? key : undefined;
  }

  return result;
}

function unwrapYaml(
  lines: string[],
  index: number,
  sourcePath: string,
  context: string
): { value: ParsedMap; nextIndex: number } {
  if (lines[index] !== "```yaml") {
    throw new CurriculumParseError(
      `${context} must start with a yaml code block`,
      sourcePath
    );
  }

  const end = lines.indexOf("```", index + 1);
  if (end === -1) {
    throw new CurriculumParseError(
      `${context} has an unclosed yaml code block`,
      sourcePath
    );
  }

  return {
    value: parseSimpleYaml(lines.slice(index + 1, end).join("\n"), sourcePath),
    nextIndex: end + 1,
  };
}

function unwrapText(
  lines: string[],
  index: number,
  sourcePath: string,
  context: string
): { value: string[]; nextIndex: number } {
  if (lines[index] !== "```text") {
    throw new CurriculumParseError(
      `${context} must start with a text code block`,
      sourcePath
    );
  }

  const end = lines.indexOf("```", index + 1);
  if (end === -1) {
    throw new CurriculumParseError(
      `${context} has an unclosed text code block`,
      sourcePath
    );
  }

  const value = lines.slice(index + 1, end);
  if (value.some((line) => line.trim() === "")) {
    throw new CurriculumParseError(
      `${context} cannot contain blank lines`,
      sourcePath
    );
  }

  return { value, nextIndex: end + 1 };
}

function skipBlankLines(lines: string[], index: number) {
  let nextIndex = index;
  while (lines[nextIndex]?.trim() === "") nextIndex += 1;
  return nextIndex;
}

function parseSentences(
  lines: string[],
  index: number,
  sourcePath: string
): { value: CurriculumSentence[]; nextIndex: number } {
  const block = unwrapText(lines, index, sourcePath, "Practice Sentences");
  const sentences = block.value.map((line, sentenceIndex) => {
    const match = line.match(
      /^(lesson-\d{2}-\d{2}-sentence-\d{2})\s+\|\s+(.+)$/
    );
    if (!match) {
      throw new CurriculumParseError(
        `sentence ${sentenceIndex + 1} must use 'sentence_id | text' format`,
        sourcePath
      );
    }

    const sentence = CurriculumSentenceSchema.safeParse({
      sentence_id: match[1],
      text: match[2],
    });
    if (!sentence.success) {
      throw new CurriculumParseError(
        `invalid sentence '${line}': ${sentence.error.message}`,
        sourcePath
      );
    }

    return sentence.data;
  });

  return { value: sentences, nextIndex: block.nextIndex };
}

function parseLesson(
  lines: string[],
  headingIndex: number,
  sourcePath: string
): { lesson: CurriculumLesson; nextIndex: number } {
  const heading = lines[headingIndex];
  const headingMatch = heading?.match(/^### Lesson: (.+)$/);
  if (!headingMatch) {
    throw new CurriculumParseError(
      `invalid lesson heading on line ${headingIndex + 1}`,
      sourcePath
    );
  }

  let index = skipBlankLines(lines, headingIndex + 1);
  const metadataBlock = unwrapYaml(
    lines,
    index,
    sourcePath,
    `lesson ${headingMatch[1]} metadata`
  );
  const metadataResult = LessonMetadataSchema.safeParse(metadataBlock.value);
  if (!metadataResult.success) {
    throw new CurriculumParseError(
      `invalid metadata for ${headingMatch[1]}: ${metadataResult.error.message}`,
      sourcePath
    );
  }
  if (metadataResult.data.lesson_id !== headingMatch[1]) {
    throw new CurriculumParseError(
      `lesson heading and lesson_id differ for ${headingMatch[1]}`,
      sourcePath
    );
  }
  index = skipBlankLines(lines, metadataBlock.nextIndex);

  const requireSection = (expected: string) => {
    if (lines[index] !== expected) {
      throw new CurriculumParseError(
        `expected '${expected}' on line ${index + 1}`,
        sourcePath
      );
    }
    index = skipBlankLines(lines, index + 1);
  };

  requireSection("#### Target Words");
  const targetWordsBlock = unwrapText(lines, index, sourcePath, "Target Words");
  index = skipBlankLines(lines, targetWordsBlock.nextIndex);

  requireSection("#### Review Words");
  const reviewWordsBlock = unwrapText(lines, index, sourcePath, "Review Words");
  index = skipBlankLines(lines, reviewWordsBlock.nextIndex);

  requireSection("#### Practice Sentences");
  const sentencesBlock = parseSentences(lines, index, sourcePath);
  index = skipBlankLines(lines, sentencesBlock.nextIndex);

  requireSection("#### Teacher Note");
  const teacherNoteLines: string[] = [];
  while (
    index < lines.length &&
    lines[index] !== "#### Validation" &&
    !lines[index]?.startsWith("### Lesson:") &&
    lines[index] !== "## File Summary"
  ) {
    const teacherNoteLine = lines[index];
    if (teacherNoteLine?.trim() !== "") teacherNoteLines.push(teacherNoteLine!);
    index += 1;
  }
  if (teacherNoteLines.length === 0) {
    throw new CurriculumParseError(
      "Teacher Note must contain text",
      sourcePath
    );
  }
  index = skipBlankLines(lines, index);

  requireSection("#### Validation");
  const validationBlock = unwrapYaml(
    lines,
    index,
    sourcePath,
    "Lesson Validation"
  );
  const validationResult = LessonValidationSchema.safeParse(
    validationBlock.value
  );
  if (!validationResult.success) {
    throw new CurriculumParseError(
      `invalid lesson validation: ${validationResult.error.message}`,
      sourcePath
    );
  }
  index = validationBlock.nextIndex;

  const lessonResult = CurriculumLessonSchema.safeParse({
    metadata: metadataResult.data,
    targetWords: targetWordsBlock.value,
    reviewWords: reviewWordsBlock.value,
    sentences: sentencesBlock.value,
    teacherNote: teacherNoteLines.join("\n").trim(),
    validation: validationResult.data,
  });
  if (!lessonResult.success) {
    throw new CurriculumParseError(
      `invalid lesson ${headingMatch[1]}: ${lessonResult.error.message}`,
      sourcePath
    );
  }

  return { lesson: lessonResult.data, nextIndex: index };
}

function parseFrontMatter(lines: string[], sourcePath: string) {
  if (lines[0] !== "---") {
    throw new CurriculumParseError(
      "file must start with YAML front matter",
      sourcePath
    );
  }

  const end = lines.indexOf("---", 1);
  if (end === -1) {
    throw new CurriculumParseError(
      "front matter has no closing delimiter",
      sourcePath
    );
  }

  const result = CurriculumFrontMatterSchema.safeParse(
    parseSimpleYaml(lines.slice(1, end).join("\n"), sourcePath)
  );
  if (!result.success) {
    throw new CurriculumParseError(
      `invalid front matter: ${result.error.message}`,
      sourcePath
    );
  }

  return { value: result.data, nextIndex: end + 1 };
}

export function parseCurriculumFile(
  contents: string,
  sourcePath = "curriculum.md"
): CurriculumChunk {
  const lines = contents.replace(/\r\n?/g, "\n").split("\n");
  const frontMatter = parseFrontMatter(lines, sourcePath);
  let index = skipBlankLines(lines, frontMatter.nextIndex);

  const titleMatch = lines[index]?.match(/^# (.+)$/);
  if (!titleMatch) {
    throw new CurriculumParseError("file must have a chunk title", sourcePath);
  }
  const title = titleMatch[1];
  index = skipBlankLines(lines, index + 1);

  if (lines[index] !== "## Chunk Goals") {
    throw new CurriculumParseError(
      "file must contain a Chunk Goals section",
      sourcePath
    );
  }
  index = skipBlankLines(lines, index + 1);
  const goals: string[] = [];
  while (index < lines.length && lines[index]?.startsWith("- ")) {
    goals.push(lines[index]!.slice(2).trim());
    index += 1;
  }
  if (goals.length === 0) {
    throw new CurriculumParseError("Chunk Goals must not be empty", sourcePath);
  }
  index = skipBlankLines(lines, index);

  if (lines[index] !== "## Lessons") {
    throw new CurriculumParseError(
      "file must contain a Lessons section",
      sourcePath
    );
  }
  index = skipBlankLines(lines, index + 1);

  const lessons: CurriculumLesson[] = [];
  while (index < lines.length && lines[index]?.startsWith("### Lesson: ")) {
    const parsedLesson = parseLesson(lines, index, sourcePath);
    lessons.push(parsedLesson.lesson);
    index = skipBlankLines(lines, parsedLesson.nextIndex);
  }
  if (lessons.length === 0) {
    throw new CurriculumParseError("Lessons must not be empty", sourcePath);
  }

  if (lines[index] !== "## File Summary") {
    throw new CurriculumParseError(
      "File Summary must follow the lessons",
      sourcePath
    );
  }
  index = skipBlankLines(lines, index + 1);
  const summaryBlock = unwrapYaml(lines, index, sourcePath, "File Summary");
  const summaryResult = FileSummarySchema.safeParse(summaryBlock.value);
  if (!summaryResult.success) {
    throw new CurriculumParseError(
      `invalid file summary: ${summaryResult.error.message}`,
      sourcePath
    );
  }
  index = skipBlankLines(lines, summaryBlock.nextIndex);
  if (lines.slice(index).some((line) => line.trim() !== "")) {
    throw new CurriculumParseError(
      "unexpected content after File Summary",
      sourcePath
    );
  }

  const chunkResult = CurriculumChunkSchema.safeParse({
    sourcePath,
    title,
    goals,
    frontMatter: frontMatter.value,
    lessons,
    fileSummary: summaryResult.data,
  });
  if (!chunkResult.success) {
    throw new CurriculumParseError(
      `invalid curriculum file: ${chunkResult.error.message}`,
      sourcePath
    );
  }

  return chunkResult.data;
}
