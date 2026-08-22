import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { tmpdir } from "node:os";

import { PrismaClient } from "@prisma/client";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { loadCurriculum } from "./loader";
import { syncCurriculum } from "./sync";

const managedId = (planId: string, sourceId: string) => `${planId}:${sourceId}`;

describe("curriculum sync", () => {
  let databaseDirectory: string;
  let prisma: PrismaClient;
  let chunks: Awaited<ReturnType<typeof loadCurriculum>>;

  beforeAll(async () => {
    databaseDirectory = mkdtempSync(path.join(tmpdir(), "kids-reading-curriculum-"));
    const databasePath = path.join(databaseDirectory, "test.db");
    writeFileSync(databasePath, "");
    execFileSync(path.resolve("node_modules/.bin/prisma"), ["db", "push", "--schema", "prisma/schema.prisma", "--skip-generate"], {
      cwd: process.cwd(),
      env: { ...process.env, CI: "true", DATABASE_URL: `file:${databasePath}` },
      stdio: "inherit",
    });
    prisma = new PrismaClient({ datasources: { db: { url: `file:${databasePath}` } } });
    chunks = await loadCurriculum();
  });

  afterAll(async () => {
    await prisma?.$disconnect();
    rmSync(databaseDirectory, { recursive: true, force: true });
  });

  it("projects the authored corpus, then applies it idempotently", async () => {
    await prisma.word.create({ data: { word: "Cat" } });
    const first = await syncCurriculum({ prisma, chunks, apply: true });
    expect(first.counts.plans.added).toBe(1);
    expect(first.counts.chunks.added).toBe(10);
    expect(first.counts.lessons.added).toBe(30);
    expect(first.counts.sentences.added).toBe(320);

    const second = await syncCurriculum({ prisma, chunks, apply: true });
    expect(second.added).toBe(0);
    expect(second.changed).toBe(0);
    expect(second.archived).toBe(0);
    expect(second.counts.sentences.unchanged).toBe(320);
    await expect(prisma.word.findUnique({ where: { word: "i" } })).resolves.not.toBeNull();
    await expect(prisma.word.findUnique({ where: { word: "I" } })).resolves.toBeNull();
    await expect(prisma.word.findUnique({ where: { word: "Cat" } })).resolves.not.toBeNull();
    await expect(prisma.word.findUnique({ where: { word: "cat" } })).resolves.toBeNull();
  }, 120_000);

  it("creates an immutable sentence revision while retaining old rows", async () => {
    const changedChunks = structuredClone(chunks);
    const original = changedChunks[0]!.lessons[0]!.sentences[0]!;
    original.text = "A bat can nap.";
    const report = await syncCurriculum({ prisma, chunks: changedChunks, apply: true });
    expect(report.counts.plans.changed).toBe(0);
    expect(report.counts.chunks.changed).toBe(0);
    expect(report.counts.lessons.changed).toBe(1);
    expect(report.counts.sentences.changed).toBe(1);

    const revisions = await prisma.sentence.findMany({
      where: { canonicalId: managedId(changedChunks[0]!.frontMatter.plan_id, original.sentence_id) },
      orderBy: { revision: "asc" },
    });
    expect(revisions).toHaveLength(2);
    expect(revisions[0]!.isCurrentRevision).toBe(false);
    expect(revisions[1]!.isCurrentRevision).toBe(true);
    expect(revisions[0]!.fullSentence).not.toBe(revisions[1]!.fullSentence);
  });

  it("does not mutate the database in dry-run mode", async () => {
    const dryRunChunks = structuredClone(chunks);
    const sentence = dryRunChunks[0]!.lessons[0]!.sentences[0]!;
    sentence.text = "A dry run is safe.";
    const before = await prisma.sentence.findFirstOrThrow({ where: { canonicalId: managedId(dryRunChunks[0]!.frontMatter.plan_id, sentence.sentence_id), isCurrentRevision: true } });
    const report = await syncCurriculum({ prisma, chunks: dryRunChunks, dryRun: true });
    expect(report.dryRun).toBe(true);
    await expect(prisma.sentence.findFirstOrThrow({ where: { canonicalId: managedId(dryRunChunks[0]!.frontMatter.plan_id, sentence.sentence_id), isCurrentRevision: true } })).resolves.toMatchObject({ id: before.id, fullSentence: before.fullSentence });
  });

  it("does not archive managed content from another plan", async () => {
    const otherPlan = await prisma.learningPlan.create({
      data: { name: "Other Plan", description: "Other", order: 2, canonicalId: "other-plan", isManaged: true },
    });
    const otherChunk = await prisma.learningPlanChunk.create({
      data: { learningPlanId: otherPlan.id, canonicalId: "other-chunk", title: "Other", description: "Other", order: 1, isManaged: true },
    });
    const otherLesson = await prisma.lesson.create({
      data: { learningPlanId: otherPlan.id, chunkId: otherChunk.id, canonicalId: "other-lesson", name: "Other", description: "Other", order: 1, isManaged: true },
    });
    const otherIdentity = await prisma.sentenceIdentity.create({ data: { canonicalId: "other-sentence", isManaged: true } });
    const otherSentence = await prisma.sentence.create({
      data: { fullSentence: "Other sentence.", canonicalId: "other-sentence", sentenceIdentityId: otherIdentity.id, isManaged: true },
    });
    await prisma.lesson.update({ where: { id: otherLesson.id }, data: { sentences: { connect: { id: otherSentence.id } } } });

    await syncCurriculum({ prisma, chunks, apply: true });
    await expect(prisma.learningPlan.findUnique({ where: { id: otherPlan.id } })).resolves.toMatchObject({ isArchived: false });
    await expect(prisma.sentenceIdentity.findUnique({ where: { id: otherIdentity.id } })).resolves.toMatchObject({ isArchived: false });
  });

  it("adopts a uniquely linked legacy sentence without changing its ID", async () => {
    const plan = await prisma.learningPlan.create({ data: { name: "Adoption Plan", description: "Adoption", order: 3 } });
    const lesson = await prisma.lesson.create({ data: { learningPlanId: plan.id, name: "Adoption Lesson", description: "Adoption", order: 1 } });
    const source = chunks[0]!.lessons[0]!.sentences[0]!;
    const legacy = await prisma.sentence.create({ data: { fullSentence: source.text, wordCount: 3 } });
    await prisma.lesson.update({ where: { id: lesson.id }, data: { sentences: { connect: { id: legacy.id } } } });
    const user = await prisma.user.create({ data: { email: `adopt-${Date.now()}@example.com` } });
    const profile = await prisma.profile.create({ data: { name: "Adoption", userId: user.id } });
    const result = await prisma.profileQuestionResult.create({ data: { profileId: profile.id, sentenceId: legacy.id } });

    const adoptionChunk = structuredClone(chunks[0]!);
    adoptionChunk.frontMatter.plan_id = "adoption-plan";
    adoptionChunk.frontMatter.plan_title = "Adoption Plan";
    adoptionChunk.frontMatter.plan_description = "Adoption";
    adoptionChunk.frontMatter.chunk_id = "adoption-chunk";
    adoptionChunk.title = "Adoption";
    adoptionChunk.lessons = [structuredClone(adoptionChunk.lessons[0]!)];
    adoptionChunk.lessons[0]!.metadata.lesson_id = "lesson-99-01";
    adoptionChunk.lessons[0]!.metadata.title = "Adoption Lesson";
    adoptionChunk.lessons[0]!.sentences = adoptionChunk.lessons[0]!.sentences.map((item, index) => ({
      ...item,
      sentence_id: `lesson-99-01-sentence-${String(index + 1).padStart(2, "0")}`,
      text: index === 0 ? source.text : item.text,
    }));
    adoptionChunk.fileSummary = {
      chunk_id: "adoption-chunk",
      lesson_count: 1,
      word_count: adoptionChunk.lessons[0]!.targetWords.length,
      sentence_count: adoptionChunk.lessons[0]!.sentences.length,
    };
    await syncCurriculum({ prisma, chunks: [adoptionChunk], apply: true, adoptLegacy: true });

    await expect(prisma.sentence.findUnique({ where: { id: legacy.id } })).resolves.toMatchObject({ canonicalId: managedId("adoption-plan", "lesson-99-01-sentence-01"), isManaged: true });
    await expect(prisma.profileQuestionResult.findUnique({ where: { id: result.id } })).resolves.toMatchObject({ sentenceId: legacy.id });
  });

  it("preserves an unmanaged custom sentence and its result", async () => {
    const lesson = await prisma.lesson.findUniqueOrThrow({ where: { canonicalId: managedId(chunks[0]!.frontMatter.plan_id, "lesson-01-01") } });
    const customWord = await prisma.word.upsert({ where: { word: "custom" }, update: {}, create: { word: "custom" } });
    const custom = await prisma.sentence.create({
      data: { fullSentence: "Custom words remain.", wordCount: 3, words: { connect: [{ id: customWord.id }] } },
    });
    await prisma.lesson.update({ where: { id: lesson.id }, data: { sentences: { connect: { id: custom.id } } } });
    const user = await prisma.user.create({ data: { email: `sync-${Date.now()}@example.com` } });
    const profile = await prisma.profile.create({ data: { name: "Sync", userId: user.id } });
    const result = await prisma.profileQuestionResult.create({ data: { profileId: profile.id, sentenceId: custom.id } });

    await syncCurriculum({ prisma, chunks, apply: true });
    await expect(prisma.sentence.findUnique({ where: { id: custom.id } })).resolves.toMatchObject({ isDeleted: false });
    await expect(prisma.profileQuestionResult.findUnique({ where: { id: result.id } })).resolves.toMatchObject({ sentenceId: custom.id });
  });

  it("keeps custom plan, chunk, and lesson rows separate from managed identities", async () => {
    const customPlan = await prisma.learningPlan.create({ data: { name: "Custom Plan", description: "Custom", order: 99 } });
    const customChunk = await prisma.learningPlanChunk.create({
      data: { learningPlanId: customPlan.id, canonicalId: "chunk-01", title: "Custom", description: "Custom", order: 99 },
    });
    const customLesson = await prisma.lesson.create({
      data: { learningPlanId: customPlan.id, chunkId: customChunk.id, canonicalId: "lesson-01-01", name: "Custom", description: "Custom", order: 99 },
    });

    await syncCurriculum({ prisma, chunks, apply: true });

    await expect(prisma.learningPlan.findUnique({ where: { id: customPlan.id } })).resolves.toMatchObject({ isManaged: false, isArchived: false });
    await expect(prisma.learningPlanChunk.findUnique({ where: { id: customChunk.id } })).resolves.toMatchObject({ isManaged: false, isArchived: false });
    await expect(prisma.lesson.findUnique({ where: { id: customLesson.id } })).resolves.toMatchObject({ isManaged: false, isArchived: false });
    await expect(prisma.lesson.findUnique({ where: { canonicalId: managedId(chunks[0]!.frontMatter.plan_id, "lesson-01-01") } })).resolves.toMatchObject({ isManaged: true });
  });

  it("namespaces equal source IDs across plans", async () => {
    const second = structuredClone(chunks[0]!);
    second.frontMatter.plan_id = "second-plan";
    second.frontMatter.plan_title = "Second Plan";
    second.frontMatter.plan_description = "Second plan with the same source IDs";
    second.sourcePath = "content/curriculum/foundational-phonics/second-plan.md";

    await syncCurriculum({ prisma, chunks: [second], apply: true });

    const firstChunk = await prisma.learningPlanChunk.findUniqueOrThrow({ where: { canonicalId: managedId(chunks[0]!.frontMatter.plan_id, chunks[0]!.frontMatter.chunk_id) } });
    const secondChunk = await prisma.learningPlanChunk.findUniqueOrThrow({ where: { canonicalId: managedId(second.frontMatter.plan_id, second.frontMatter.chunk_id) } });
    expect(secondChunk.id).not.toBe(firstChunk.id);
    const firstSentence = await prisma.sentenceIdentity.findUniqueOrThrow({ where: { canonicalId: managedId(chunks[0]!.frontMatter.plan_id, chunks[0]!.lessons[0]!.sentences[0]!.sentence_id) } });
    const secondSentence = await prisma.sentenceIdentity.findUniqueOrThrow({ where: { canonicalId: managedId(second.frontMatter.plan_id, second.lessons[0]!.sentences[0]!.sentence_id) } });
    expect(secondSentence.id).not.toBe(firstSentence.id);
  });

  it("reports and performs exact legacy adoption only when enabled", async () => {
    const plan = await prisma.learningPlan.create({ data: { name: "Explicit Adoption", description: "Explicit", order: 100 } });
    const lesson = await prisma.lesson.create({ data: { learningPlanId: plan.id, name: "Exact Adoption Lesson", description: "Exact", order: 1 } });
    const source = chunks[0]!.lessons[0]!.sentences[0]!;
    const legacy = await prisma.sentence.create({ data: { fullSentence: source.text, wordCount: 3 } });
    await prisma.lesson.update({ where: { id: lesson.id }, data: { sentences: { connect: { id: legacy.id } } } });
    const adoptionChunk = structuredClone(chunks[0]!);
    adoptionChunk.frontMatter.plan_id = "explicit-adoption";
    adoptionChunk.frontMatter.plan_title = "Explicit Adoption";
    adoptionChunk.frontMatter.plan_description = "Explicit";
    adoptionChunk.frontMatter.chunk_id = "explicit-adoption-chunk";
    adoptionChunk.lessons = [structuredClone(adoptionChunk.lessons[0]!)];
    adoptionChunk.lessons[0]!.metadata.lesson_id = "exact-adoption-lesson" as never;
    adoptionChunk.lessons[0]!.metadata.title = "Exact Adoption Lesson";
    adoptionChunk.lessons[0]!.sentences = adoptionChunk.lessons[0]!.sentences.map((item, index) => ({ ...item, sentence_id: `exact-adoption-sentence-${index + 1}` as never, text: index === 0 ? source.text : item.text }));
    adoptionChunk.fileSummary = { chunk_id: "explicit-adoption-chunk", lesson_count: 1, word_count: adoptionChunk.lessons[0]!.targetWords.length, sentence_count: adoptionChunk.lessons[0]!.sentences.length };
    const report = await syncCurriculum({ prisma, chunks: [adoptionChunk], apply: true, adoptLegacy: true });
    expect(report.adopted).toBeGreaterThanOrEqual(2);
    await expect(prisma.sentence.findUnique({ where: { id: legacy.id } })).resolves.toMatchObject({ isManaged: true });
  });

  it("rejects multiple existing word case variants", async () => {
    const duplicate = await prisma.word.create({ data: { word: "cat" } });
    try {
      await expect(syncCurriculum({ prisma, chunks: [chunks[0]!], apply: true })).rejects.toThrow(/Word registry conflict/);
    } finally {
      await prisma.word.delete({ where: { id: duplicate.id } });
    }
  });

  it("does not adopt a deleted custom sentence", async () => {
    const lesson = await prisma.lesson.findUniqueOrThrow({ where: { canonicalId: managedId(chunks[0]!.frontMatter.plan_id, "lesson-01-01") } });
    const source = chunks[0]!.lessons[0]!.sentences[0]!;
    const deleted = await prisma.sentence.create({ data: { fullSentence: source.text, wordCount: 3, isDeleted: true, isArchived: true } });
    await prisma.lesson.update({ where: { id: lesson.id }, data: { sentences: { connect: { id: deleted.id } } } });
    const changed = structuredClone(chunks[0]!);
    changed.lessons[0]!.sentences.push({ ...source, sentence_id: "lesson-01-01-sentence-99" as never });
    await syncCurriculum({ prisma, chunks: [changed], apply: true, adoptLegacy: true });
    await expect(prisma.sentence.findUnique({ where: { id: deleted.id } })).resolves.toMatchObject({ isDeleted: true, isManaged: false });
    await expect(prisma.sentenceIdentity.findUnique({ where: { canonicalId: managedId(changed.frontMatter.plan_id, "lesson-01-01-sentence-99") } })).resolves.toMatchObject({ isManaged: true });
  });
});
