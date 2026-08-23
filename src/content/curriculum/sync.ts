import { createHash } from "node:crypto";
import path from "node:path";

import { PrismaClient, type Prisma } from "@prisma/client";

import { DEFAULT_CURRICULUM_ROOT, loadCurriculum } from "./loader";

import type { CurriculumChunk, CurriculumLesson } from "./schema";

export type SyncAction =
  | "added"
  | "changed"
  | "archived"
  | "unchanged"
  | "adopted";
export type SyncEntity = "plans" | "chunks" | "lessons" | "sentences" | "words";

export type SyncReport = {
  dryRun: boolean;
  added: number;
  changed: number;
  archived: number;
  unchanged: number;
  adopted: number;
  counts: Record<SyncEntity, Record<SyncAction, number>>;
};

export type SyncOptions = {
  prisma?: PrismaClient;
  curriculumRoot?: string;
  chunks?: CurriculumChunk[];
  dryRun?: boolean;
  apply?: boolean;
  adoptLegacy?: boolean;
  /** Archive managed plans omitted from a complete authored corpus. */
  archiveMissingPlans?: boolean;
};

class DryRunRollback extends Error {
  constructor(readonly report: SyncReport) {
    super("curriculum dry-run rollback");
  }
}

const entities: SyncEntity[] = [
  "plans",
  "chunks",
  "lessons",
  "sentences",
  "words",
];

function newReport(dryRun: boolean): SyncReport {
  const counts = Object.fromEntries(
    entities.map((entity) => [
      entity,
      { added: 0, changed: 0, archived: 0, unchanged: 0, adopted: 0 },
    ])
  ) as SyncReport["counts"];
  return {
    dryRun,
    added: 0,
    changed: 0,
    archived: 0,
    unchanged: 0,
    adopted: 0,
    counts,
  };
}

function record(report: SyncReport, entity: SyncEntity, action: SyncAction) {
  report.counts[entity][action] += 1;
  report[action] += 1;
}

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function stableSourcePath(sourcePath: string) {
  const relative = path.relative(process.cwd(), sourcePath);
  return relative && !relative.startsWith("..") ? relative : sourcePath;
}

function normalizeWord(value: string) {
  return value.toLowerCase();
}

function namespacedCanonicalId(planCanonicalId: string, sourceId: string) {
  return `${planCanonicalId}:${sourceId}`;
}

function sentenceWords(sentence: string) {
  return sentence
    .split(/\s+/)
    .map((token) => token.replace(/[^A-Za-z']/g, ""))
    .filter(Boolean)
    .map(normalizeWord);
}

function planHash(chunk: CurriculumChunk) {
  const { plan_id, plan_order, plan_title, plan_description, age_range } =
    chunk.frontMatter;
  return hash(
    JSON.stringify({
      plan_id,
      plan_order,
      plan_title,
      plan_description,
      age_range,
    })
  );
}

function chunkHash(chunk: CurriculumChunk) {
  const { chunk_id, chunk_order, difficulty } = chunk.frontMatter;
  return hash(
    JSON.stringify({
      chunk_id,
      chunk_order,
      difficulty,
      title: chunk.title,
      goals: chunk.goals,
    })
  );
}

function lessonHash(lesson: CurriculumLesson) {
  return hash(JSON.stringify(lesson));
}

function sentenceHash(sentence: CurriculumLesson["sentences"][number]) {
  return hash(
    JSON.stringify({ sentence_id: sentence.sentence_id, text: sentence.text })
  );
}

type Tx = Prisma.TransactionClient;

class WordRegistry {
  private readonly words = new Map<
    string,
    Prisma.WordGetPayload<Prisma.WordDefaultArgs>
  >();
  private loaded = false;

  constructor(private readonly tx: Tx, private readonly report: SyncReport) {}

  private async load() {
    if (this.loaded) return;
    const existing = await this.tx.word.findMany();
    for (const word of existing) {
      const normalized = normalizeWord(word.word);
      const previous = this.words.get(normalized);
      if (previous && previous.id !== word.id) {
        throw new Error(
          `Word registry conflict: existing words ${JSON.stringify(
            previous.word
          )} and ${JSON.stringify(word.word)} differ only by case.`
        );
      }
      this.words.set(normalized, word);
    }
    this.loaded = true;
  }

  async get(value: string) {
    await this.load();
    const normalized = normalizeWord(value);
    const existing = this.words.get(normalized);
    if (existing) {
      record(this.report, "words", "unchanged");
      return existing;
    }
    const created = await this.tx.word.create({ data: { word: normalized } });
    this.words.set(normalized, created);
    record(this.report, "words", "added");
    return created;
  }
}

async function restrictManagedSentenceLinks(
  tx: Tx,
  sentenceId: string,
  lessonId: string
) {
  const explicit = await tx.lessonSentence.findMany({
    where: { sentenceId },
    include: { lesson: { select: { id: true, isManaged: true } } },
  });
  for (const relation of explicit) {
    if (relation.lesson.isManaged && relation.lesson.id !== lessonId) {
      await tx.lessonSentence.delete({ where: { id: relation.id } });
      await tx.lesson.update({
        where: { id: relation.lesson.id },
        data: { sentences: { disconnect: { id: sentenceId } } },
      });
    }
  }
  const implicit = await tx.lesson.findMany({
    where: {
      isManaged: true,
      id: { not: lessonId },
      sentences: { some: { id: sentenceId } },
    },
    select: { id: true },
  });
  for (const lesson of implicit) {
    await tx.lesson.update({
      where: { id: lesson.id },
      data: { sentences: { disconnect: { id: sentenceId } } },
    });
  }
}

async function upsertSentence(
  tx: Tx,
  lesson: CurriculumLesson,
  sentence: CurriculumLesson["sentences"][number],
  lessonId: string,
  planCanonicalId: string,
  sourcePath: string,
  sourceHash: string,
  report: SyncReport,
  wordsRegistry: WordRegistry,
  adoptLegacy: boolean
) {
  const canonicalId = namespacedCanonicalId(
    planCanonicalId,
    sentence.sentence_id
  );
  const identity = await tx.sentenceIdentity.findUnique({
    where: { canonicalId },
  });
  if (identity && !identity.isManaged) {
    throw new Error(
      `Cannot sync sentence ${sentence.sentence_id}: an unmanaged sentence identity already uses its canonical ID.`
    );
  }
  const current = identity
    ? await tx.sentence.findFirst({
        where: {
          sentenceIdentityId: identity.id,
          isCurrentRevision: true,
          isManaged: true,
        },
      })
    : await tx.sentence.findFirst({
        where: { canonicalId, isCurrentRevision: true, isManaged: true },
      });
  const unmanagedCanonical = await tx.sentence.findFirst({
    where: { canonicalId, isManaged: false },
    select: { id: true },
  });
  if (unmanagedCanonical) {
    throw new Error(
      `Cannot sync sentence ${sentence.sentence_id}: an unmanaged sentence already uses its canonical ID.`
    );
  }

  // Adopt a legacy sentence only when its text and lesson link are unambiguous.
  // A custom sentence linked to another lesson, or to several lessons, is not safe to adopt.
  const adopted =
    adoptLegacy && !identity && !current
      ? await tx.sentence.findMany({
          where: {
            fullSentence: sentence.text,
            canonicalId: null,
            sentenceIdentityId: null,
            isManaged: false,
            isArchived: false,
            isDeleted: false,
            OR: [
              { lesson: { some: { id: lessonId } } },
              { lessonSentences: { some: { lessonId } } },
            ],
          },
          include: {
            lesson: { select: { id: true } },
            lessonSentences: { include: { lesson: { select: { id: true } } } },
          },
        })
      : [];
  const adoption =
    adopted.length === 1 &&
    (() => {
      const linkedLessonIds = new Set([
        ...adopted[0]!.lesson.map((linkedLesson) => linkedLesson.id),
        ...adopted[0]!.lessonSentences.map((relation) => relation.lesson.id),
      ]);
      return linkedLessonIds.size === 1 && linkedLessonIds.has(lessonId);
    })();
  const adoptedCurrent = adoption ? adopted[0]! : undefined;
  const effectiveCurrent = current ?? adoptedCurrent;
  const latestRevision = identity
    ? await tx.sentence.findFirst({
        where: { sentenceIdentityId: identity.id },
        orderBy: { revision: "desc" },
      })
    : await tx.sentence.findFirst({
        where: { canonicalId },
        orderBy: { revision: "desc" },
      });

  const words = [];
  for (const value of sentenceWords(sentence.text)) {
    words.push(await wordsRegistry.get(value));
  }

  const identityRow =
    identity ??
    (await tx.sentenceIdentity.create({
      data: { canonicalId, sourcePath, sourceHash, isManaged: true },
    }));
  const revision = effectiveCurrent?.revision ?? latestRevision?.revision ?? 0;

  if (effectiveCurrent && effectiveCurrent.fullSentence === sentence.text) {
    const metadataChanged =
      effectiveCurrent.sourcePath !== sourcePath ||
      effectiveCurrent.sourceHash !== sourceHash ||
      effectiveCurrent.isManaged !== true ||
      effectiveCurrent.isArchived !== false ||
      effectiveCurrent.isDeleted !== false ||
      effectiveCurrent.sentenceIdentityId !== identityRow.id;
    await tx.sentence.update({
      where: { id: effectiveCurrent.id },
      data: {
        sentenceIdentityId: identityRow.id,
        canonicalId,
        sourcePath,
        sourceHash,
        isManaged: true,
        isArchived: false,
        isCurrentRevision: true,
        isDeleted: false,
        words: { connect: words.map((word) => ({ id: word.id })) },
      },
    });
    await tx.sentenceIdentity.update({
      where: { id: identityRow.id },
      data: { sourcePath, sourceHash, isManaged: true, isArchived: false },
    });
    await restrictManagedSentenceLinks(tx, effectiveCurrent.id, lessonId);
    record(
      report,
      "sentences",
      adoptedCurrent ? "adopted" : metadataChanged ? "changed" : "unchanged"
    );
    return effectiveCurrent;
  }

  if (effectiveCurrent) {
    await tx.sentence.update({
      where: { id: effectiveCurrent.id },
      data: { isCurrentRevision: false, isArchived: true, isDeleted: true },
    });
  }
  const next = await tx.sentence.create({
    data: {
      fullSentence: sentence.text,
      canonicalId,
      sourcePath,
      sourceHash,
      revision: revision + 1,
      sentenceIdentityId: identityRow.id,
      isCurrentRevision: true,
      isManaged: true,
      isArchived: false,
      isDeleted: false,
      wordCount: words.length,
      words: { connect: words.map((word) => ({ id: word.id })) },
    },
  });
  await tx.sentenceIdentity.update({
    where: { id: identityRow.id },
    data: { sourcePath, sourceHash, isManaged: true, isArchived: false },
  });
  await restrictManagedSentenceLinks(tx, next.id, lessonId);
  record(
    report,
    "sentences",
    adoptedCurrent ? "adopted" : effectiveCurrent ? "changed" : "added"
  );
  return next;
}

async function upsertPlan(
  tx: Tx,
  chunk: CurriculumChunk,
  sourcePath: string,
  sourceHash: string,
  report: SyncReport,
  adoptLegacy: boolean
) {
  const fm = chunk.frontMatter;
  let plan = await tx.learningPlan.findUnique({
    where: { canonicalId: fm.plan_id },
  });
  let adopted = false;
  if (plan && !plan.isManaged) {
    throw new Error(
      `Cannot sync plan ${fm.plan_id}: an unmanaged plan already uses its canonical ID.`
    );
  }
  if (!plan && adoptLegacy) {
    const candidates = await tx.learningPlan.findMany({
      where: {
        name: fm.plan_title,
        canonicalId: null,
        isManaged: false,
        isArchived: false,
      },
    });
    if (candidates.length === 1) {
      plan = candidates[0]!;
      adopted = true;
    }
    if (candidates.length > 1) {
      throw new Error(
        `Cannot adopt legacy plan ${fm.plan_id}: ${candidates.length} exact name matches exist.`
      );
    }
  }
  if (!plan) {
    const conflicts = await tx.learningPlan.findMany({
      where: { name: fm.plan_title },
    });
    if (conflicts.length > 0) {
      throw new Error(
        `Cannot sync plan ${
          fm.plan_id
        }: an existing plan uses the managed name ${JSON.stringify(
          fm.plan_title
        )}.`
      );
    }
  }
  const data = {
    name: fm.plan_title,
    description: fm.plan_description,
    ageRange: fm.age_range,
    order: fm.plan_order,
    canonicalId: fm.plan_id,
    sourcePath,
    sourceHash,
    isManaged: true,
    isArchived: false,
  };
  if (!plan) {
    plan = await tx.learningPlan.create({ data });
    record(report, "plans", "added");
  } else {
    const changed = Object.keys(data).some(
      (key) =>
        (plan as Record<string, unknown>)[key] !==
        (data as Record<string, unknown>)[key]
    );
    plan = await tx.learningPlan.update({ where: { id: plan.id }, data });
    record(
      report,
      "plans",
      adopted ? "adopted" : changed ? "changed" : "unchanged"
    );
  }
  return plan;
}

async function upsertChunk(
  tx: Tx,
  planId: string,
  planCanonicalId: string,
  chunk: CurriculumChunk,
  sourcePath: string,
  sourceHash: string,
  report: SyncReport,
  adoptLegacy: boolean
) {
  const fm = chunk.frontMatter;
  const canonicalId = namespacedCanonicalId(planCanonicalId, fm.chunk_id);
  let current = await tx.learningPlanChunk.findUnique({
    where: { canonicalId },
  });
  let adopted = false;
  if (current && !current.isManaged) {
    throw new Error(
      `Cannot sync chunk ${fm.chunk_id}: an unmanaged chunk already uses its canonical ID.`
    );
  }
  if (!current && adoptLegacy) {
    const candidates = await tx.learningPlanChunk.findMany({
      where: {
        learningPlanId: planId,
        canonicalId: null,
        isManaged: false,
        isArchived: false,
        title: chunk.title,
        description: chunk.goals.join(" "),
        order: fm.chunk_order,
        difficulty: fm.difficulty,
      },
    });
    if (candidates.length === 1) {
      current = candidates[0]!;
      adopted = true;
    }
    if (candidates.length > 1) {
      throw new Error(
        `Cannot adopt legacy chunk ${fm.chunk_id}: ${candidates.length} exact matches exist.`
      );
    }
  }
  if (!current) {
    const orderConflict = await tx.learningPlanChunk.findUnique({
      where: {
        learningPlanId_order: { learningPlanId: planId, order: fm.chunk_order },
      },
    });
    if (orderConflict) {
      throw new Error(
        `Cannot sync chunk ${fm.chunk_id}: an existing chunk occupies order ${fm.chunk_order}.`
      );
    }
  }
  const data = {
    learningPlanId: planId,
    canonicalId,
    sourcePath,
    sourceHash,
    title: chunk.title,
    description: chunk.goals.join(" "),
    goalsJson: JSON.stringify(chunk.goals),
    order: fm.chunk_order,
    difficulty: fm.difficulty,
    isManaged: true,
    isArchived: false,
  };
  if (!current) {
    current = await tx.learningPlanChunk.create({ data });
    record(report, "chunks", "added");
  } else {
    const changed = [
      "learningPlanId",
      "canonicalId",
      "sourcePath",
      "sourceHash",
      "title",
      "description",
      "goalsJson",
      "order",
      "difficulty",
      "isManaged",
      "isArchived",
    ].some(
      (key) =>
        (current as Record<string, unknown>)[key] !==
        (data as Record<string, unknown>)[key]
    );
    current = await tx.learningPlanChunk.update({
      where: { id: current.id },
      data,
    });
    record(
      report,
      "chunks",
      adopted ? "adopted" : changed ? "changed" : "unchanged"
    );
  }
  return current;
}

async function upsertLesson(
  tx: Tx,
  planId: string,
  planCanonicalId: string,
  chunkId: string,
  chunk: CurriculumChunk,
  lesson: CurriculumLesson,
  sourcePath: string,
  sourceHash: string,
  report: SyncReport,
  wordsRegistry: WordRegistry,
  adoptLegacy: boolean
) {
  const metadata = lesson.metadata;
  const canonicalId = namespacedCanonicalId(
    planCanonicalId,
    metadata.lesson_id
  );
  let current = await tx.lesson.findUnique({ where: { canonicalId } });
  let adopted = false;
  if (current && !current.isManaged) {
    throw new Error(
      `Cannot sync lesson ${metadata.lesson_id}: an unmanaged lesson already uses its canonical ID.`
    );
  }
  if (!current && adoptLegacy) {
    const candidates = await tx.lesson.findMany({
      where: {
        learningPlanId: planId,
        canonicalId: null,
        isManaged: false,
        isArchived: false,
        name: metadata.title,
        order: metadata.lesson_order,
      },
    });
    if (candidates.length === 1) {
      current = candidates[0]!;
      adopted = true;
    }
    if (candidates.length > 1) {
      throw new Error(
        `Cannot adopt legacy lesson ${metadata.lesson_id}: ${candidates.length} exact matches exist.`
      );
    }
  }
  const data = {
    name: metadata.title,
    description: lesson.teacherNote,
    order: metadata.lesson_order,
    learningPlanId: planId,
    chunkId,
    canonicalId,
    sourcePath,
    sourceHash,
    focus: metadata.focus,
    difficulty: metadata.difficulty,
    targetPatternsJson: JSON.stringify(metadata.target_patterns),
    teacherNote: lesson.teacherNote,
    allowedSightWordsJson: JSON.stringify(
      lesson.validation.allowed_sight_words
    ),
    isManaged: true,
    isArchived: false,
  };
  if (!current) {
    current = await tx.lesson.create({ data });
    record(report, "lessons", "added");
  } else {
    const changed = [
      "name",
      "description",
      "order",
      "learningPlanId",
      "chunkId",
      "canonicalId",
      "sourcePath",
      "sourceHash",
      "focus",
      "difficulty",
      "targetPatternsJson",
      "teacherNote",
      "allowedSightWordsJson",
      "isManaged",
      "isArchived",
    ].some(
      (key) =>
        (current as Record<string, unknown>)[key] !==
        (data as Record<string, unknown>)[key]
    );
    current = await tx.lesson.update({ where: { id: current.id }, data });
    record(
      report,
      "lessons",
      adopted ? "adopted" : changed ? "changed" : "unchanged"
    );
  }

  const expectedWords = [
    ...lesson.targetWords.map((word, order) => ({
      word,
      role: "TARGET",
      order,
    })),
    ...lesson.reviewWords.map((word, order) => ({
      word,
      role: "REVIEW",
      order,
    })),
  ];
  const wordsByValue = new Map<string, { id: string }>();
  for (const item of expectedWords)
    wordsByValue.set(
      normalizeWord(item.word),
      await wordsRegistry.get(item.word)
    );
  const expectedIds = expectedWords.map(
    (item) => wordsByValue.get(normalizeWord(item.word))!.id
  );
  const existingWords = await tx.lessonWord.findMany({
    where: { lessonId: current.id },
  });
  await tx.lessonWord.deleteMany({
    where: { lessonId: current.id, wordId: { notIn: expectedIds } },
  });
  for (const item of expectedWords) {
    const wordId = wordsByValue.get(normalizeWord(item.word))!.id;
    const row = existingWords.find((candidate) => candidate.wordId === wordId);
    if (row) {
      if (row.role !== item.role || row.order !== item.order) {
        await tx.lessonWord.update({
          where: { id: row.id },
          data: { role: item.role, order: item.order },
        });
      }
    } else {
      await tx.lessonWord.create({
        data: {
          lessonId: current.id,
          wordId,
          role: item.role,
          order: item.order,
        },
      });
    }
    await tx.lesson.update({
      where: { id: current.id },
      data: { words: { connect: { id: wordId } } },
    });
  }

  const authoredSentences = [];
  for (const sentence of lesson.sentences) {
    authoredSentences.push(
      await upsertSentence(
        tx,
        lesson,
        sentence,
        current.id,
        planCanonicalId,
        sourcePath,
        sentenceHash(sentence),
        report,
        wordsRegistry,
        adoptLegacy
      )
    );
  }
  const authoredIds = new Set(authoredSentences.map((sentence) => sentence.id));
  const linked = await tx.lessonSentence.findMany({
    where: { lessonId: current.id },
    include: { sentence: true },
  });
  for (const relation of linked) {
    if (relation.sentence.isManaged && !authoredIds.has(relation.sentenceId)) {
      await tx.lessonSentence.delete({ where: { id: relation.id } });
      await tx.lesson.update({
        where: { id: current.id },
        data: { sentences: { disconnect: { id: relation.sentenceId } } },
      });
    }
  }
  for (const [order, sentence] of authoredSentences.entries()) {
    const relation = await tx.lessonSentence.findUnique({
      where: {
        lessonId_sentenceId: { lessonId: current.id, sentenceId: sentence.id },
      },
    });
    if (relation) {
      if (relation.order !== order)
        await tx.lessonSentence.update({
          where: { id: relation.id },
          data: { order },
        });
    } else {
      await tx.lessonSentence.create({
        data: { lessonId: current.id, sentenceId: sentence.id, order },
      });
    }
    await tx.lesson.update({
      where: { id: current.id },
      data: { sentences: { connect: { id: sentence.id } } },
    });
  }
  return current;
}

async function reconcileRelations(
  tx: Tx,
  lessonByCanonical: Map<string, string>,
  chunks: CurriculumChunk[]
) {
  for (const chunk of chunks) {
    const planCanonicalId = chunk.frontMatter.plan_id;
    for (const lesson of chunk.lessons) {
      const lessonId = lessonByCanonical.get(
        namespacedCanonicalId(planCanonicalId, lesson.metadata.lesson_id)
      );
      if (!lessonId) continue;
      await tx.lessonPrerequisite.deleteMany({ where: { lessonId } });
      await tx.lessonReviewSource.deleteMany({ where: { lessonId } });
      for (const prerequisite of lesson.metadata.prerequisites) {
        const prerequisiteLessonId = lessonByCanonical.get(
          namespacedCanonicalId(planCanonicalId, prerequisite)
        );
        if (prerequisiteLessonId)
          await tx.lessonPrerequisite.create({
            data: { lessonId, prerequisiteLessonId },
          });
      }
      for (const [
        order,
        reviewLessonId,
      ] of lesson.metadata.review_lesson_ids.entries()) {
        const reviewLesson = lessonByCanonical.get(
          namespacedCanonicalId(planCanonicalId, reviewLessonId)
        );
        if (reviewLesson)
          await tx.lessonReviewSource.create({
            data: { lessonId, reviewLessonId: reviewLesson, order },
          });
      }
    }
  }
}

async function performSync(
  tx: Tx,
  chunks: CurriculumChunk[],
  report: SyncReport,
  adoptLegacy: boolean,
  archiveMissingPlans: boolean
) {
  const wordsRegistry = new WordRegistry(tx, report);
  const planIds = new Set<string>();
  const chunkIds = new Set<string>();
  const lessonIds = new Set<string>();
  const sentenceIds = new Set<string>();
  const lessonByCanonical = new Map<string, string>();
  const planByCanonical = new Map<string, string>();
  const planCanonicalIds = new Set(
    chunks.map((chunk) => chunk.frontMatter.plan_id)
  );

  const planHashes = new Map<string, string>();
  for (const chunk of chunks) {
    if (!planHashes.has(chunk.frontMatter.plan_id))
      planHashes.set(chunk.frontMatter.plan_id, planHash(chunk));
  }

  for (const chunk of chunks) {
    const sourceInfo = {
      path: stableSourcePath(chunk.sourcePath),
      hash: chunkHash(chunk),
    };
    let plan = planByCanonical.get(chunk.frontMatter.plan_id)
      ? await tx.learningPlan.findUniqueOrThrow({
          where: { id: planByCanonical.get(chunk.frontMatter.plan_id)! },
        })
      : undefined;
    if (!plan) {
      plan = await upsertPlan(
        tx,
        chunk,
        sourceInfo.path,
        planHashes.get(chunk.frontMatter.plan_id)!,
        report,
        adoptLegacy
      );
      planByCanonical.set(chunk.frontMatter.plan_id, plan.id);
    }
    planIds.add(plan.id);
    const dbChunk = await upsertChunk(
      tx,
      plan.id,
      chunk.frontMatter.plan_id,
      chunk,
      sourceInfo.path,
      sourceInfo.hash,
      report,
      adoptLegacy
    );
    chunkIds.add(dbChunk.id);
    for (const lesson of chunk.lessons) {
      const dbLesson = await upsertLesson(
        tx,
        plan.id,
        chunk.frontMatter.plan_id,
        dbChunk.id,
        chunk,
        lesson,
        sourceInfo.path,
        lessonHash(lesson),
        report,
        wordsRegistry,
        adoptLegacy
      );
      lessonIds.add(dbLesson.id);
      lessonByCanonical.set(
        namespacedCanonicalId(
          chunk.frontMatter.plan_id,
          lesson.metadata.lesson_id
        ),
        dbLesson.id
      );
      for (const sentence of lesson.sentences)
        sentenceIds.add(
          namespacedCanonicalId(chunk.frontMatter.plan_id, sentence.sentence_id)
        );
    }
  }
  await reconcileRelations(tx, lessonByCanonical, chunks);

  // Partial syncs are scoped to represented plans. A complete repository-root
  // sync can also archive managed plans whose source directory was removed.
  const oldPlans = await tx.learningPlan.findMany({
    where: {
      isManaged: true,
      ...(archiveMissingPlans
        ? {}
        : { canonicalId: { in: [...planCanonicalIds] } }),
    },
  });
  const archivedPlanIds = new Set<string>();
  for (const plan of oldPlans) {
    if (!planIds.has(plan.id)) {
      await tx.learningPlan.update({
        where: { id: plan.id },
        data: { isArchived: true },
      });
      archivedPlanIds.add(plan.id);
      record(report, "plans", "archived");
    }
  }
  const scopedPlanIds = [
    ...planIds,
    ...(archiveMissingPlans ? archivedPlanIds : []),
  ];
  const oldChunks = await tx.learningPlanChunk.findMany({
    where: { isManaged: true, learningPlanId: { in: scopedPlanIds } },
  });
  for (const chunk of oldChunks)
    if (!chunkIds.has(chunk.id)) {
      await tx.learningPlanChunk.update({
        where: { id: chunk.id },
        data: { isArchived: true },
      });
      record(report, "chunks", "archived");
    }
  const oldLessons = await tx.lesson.findMany({
    where: { isManaged: true, learningPlanId: { in: scopedPlanIds } },
  });
  for (const lesson of oldLessons)
    if (!lessonIds.has(lesson.id)) {
      await tx.lesson.update({
        where: { id: lesson.id },
        data: { isArchived: true },
      });
      record(report, "lessons", "archived");
    }
  const scopedSentenceRows =
    scopedPlanIds.length === 0
      ? []
      : await tx.sentence.findMany({
          where: {
            isManaged: true,
            lesson: { some: { learningPlanId: { in: scopedPlanIds } } },
            sentenceIdentityId: { not: null },
          },
          select: { sentenceIdentityId: true },
        });
  const scopedIdentityIds = [
    ...new Set(
      scopedSentenceRows
        .map((row) => row.sentenceIdentityId)
        .filter((id): id is string => id !== null)
    ),
  ];
  const oldIdentities = await tx.sentenceIdentity.findMany({
    where: { isManaged: true, id: { in: scopedIdentityIds } },
    include: { revisions: true },
  });
  for (const identity of oldIdentities)
    if (!sentenceIds.has(identity.canonicalId)) {
      await tx.sentenceIdentity.update({
        where: { id: identity.id },
        data: { isArchived: true },
      });
      for (const sentence of identity.revisions) {
        if (
          !sentence.isArchived ||
          sentence.isCurrentRevision ||
          !sentence.isDeleted
        ) {
          await tx.sentence.update({
            where: { id: sentence.id },
            data: {
              isArchived: true,
              isCurrentRevision: false,
              isDeleted: true,
            },
          });
        }
      }
      record(report, "sentences", "archived");
    }
}

export async function syncCurriculum(
  options: SyncOptions = {}
): Promise<SyncReport> {
  const loadingCompleteDefaultCorpus =
    !options.chunks &&
    path.resolve(options.curriculumRoot ?? DEFAULT_CURRICULUM_ROOT) ===
      DEFAULT_CURRICULUM_ROOT;
  const chunks =
    options.chunks ?? (await loadCurriculum(options.curriculumRoot));
  const archiveMissingPlans =
    options.archiveMissingPlans ?? loadingCompleteDefaultCorpus;
  const dryRun = options.apply !== true && options.dryRun !== false;
  const prisma = options.prisma ?? new PrismaClient();
  const report = newReport(dryRun);
  if (dryRun) {
    try {
      await prisma.$transaction(async (tx) => {
        await performSync(
          tx,
          chunks,
          report,
          options.adoptLegacy === true,
          archiveMissingPlans
        );
        throw new DryRunRollback(report);
      });
    } catch (error) {
      if (error instanceof DryRunRollback) return error.report;
      throw error;
    }
  } else {
    await prisma.$transaction((tx) =>
      performSync(
        tx,
        chunks,
        report,
        options.adoptLegacy === true,
        archiveMissingPlans
      )
    );
  }
  return report;
}
