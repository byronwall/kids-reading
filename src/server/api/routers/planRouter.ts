import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { prisma } from "~/server/db";

import {
  LearningPlanCreateSchema,
  LessonBulkImportWordsSchema,
  LessonCreateSchema,
  LessonEditWordsSchema,
} from "./inputSchemas";
import { getWordsForSentence } from "./getWordsForSentence";

function managedContentError(): never {
  throw new TRPCError({
    code: "FORBIDDEN",
    message: "Managed curriculum content is read-only.",
  });
}

const NO_ACTIVE_PROFILE_ID = "__no_active_profile__";

function requireActiveProfileId(ctx: {
  session: { user: { activeProfile?: { id: string } | null } };
}) {
  const profileId = ctx.session.user.activeProfile?.id;
  if (!profileId) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: "Select a learner to track progress.",
    });
  }
  return profileId;
}

const wordScoreInclude = (profileId: string) => ({
  include: {
    results: { select: { score: true }, where: { profileId } },
  },
});

const lessonInclude = (profileId: string) => ({
  words: wordScoreInclude(profileId),
  lessonWords: {
    orderBy: { order: "asc" as const },
    include: { word: wordScoreInclude(profileId) },
  },
  lessonSentences: {
    orderBy: { order: "asc" as const },
    where: {
      sentence: {
        isCurrentRevision: true,
        isArchived: false,
        isDeleted: false,
      },
    },
    include: { sentence: { include: { words: true } } },
  },
  prerequisites: {
    where: { prerequisiteLesson: { isArchived: false } },
    include: {
      prerequisiteLesson: { select: { id: true, name: true, order: true } },
    },
  },
  reviewSources: {
    orderBy: { order: "asc" as const },
    where: { reviewLesson: { isArchived: false } },
    include: {
      reviewLesson: { select: { id: true, name: true, order: true } },
    },
  },
  ProfileLessonFocus: { take: 1, where: { profileId } },
});

export const planRouter = createTRPCRouter({
  linkProfileToLesson: protectedProcedure
    .input(z.object({ lessonId: z.string() }))
    .mutation(async ({ input: { lessonId }, ctx }) => {
      const profileId = requireActiveProfileId(ctx);
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          words: true,
          lessonWords: { include: { word: true } },
          LearningPlan: { select: { isArchived: true } },
          chunk: { select: { isArchived: true } },
        },
      });
      if (
        !lesson ||
        [
          lesson.isArchived,
          lesson.LearningPlan?.isArchived,
          lesson.chunk?.isArchived,
        ].some(Boolean)
      ) {
        throw new Error(`Lesson not found: ${lessonId}`);
      }

      await prisma.profileLessonFocus.create({ data: { lessonId, profileId } });

      const words = lesson.isManaged
        ? lesson.lessonWords.map((link) => link.word)
        : lesson.words;
      await Promise.all(
        words.map((word) =>
          prisma.profileWordSummary.upsert({
            where: { profileId_wordId: { profileId, wordId: word.id } },
            create: {
              profileId,
              wordId: word.id,
              metaInfo: JSON.stringify({}),
            },
            update: {},
          })
        )
      );
      return true;
    }),

  setProfileLessonFocus: protectedProcedure
    .input(z.object({ lessonId: z.string(), isFocused: z.boolean() }))
    .mutation(async ({ input: { lessonId, isFocused }, ctx }) => {
      const profileId = requireActiveProfileId(ctx);
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          LearningPlan: { select: { isArchived: true } },
          chunk: { select: { isArchived: true } },
        },
      });
      if (
        !lesson ||
        [
          lesson.isArchived,
          lesson.LearningPlan?.isArchived,
          lesson.chunk?.isArchived,
        ].some(Boolean)
      ) {
        throw new Error(`Lesson not found: ${lessonId}`);
      }

      await prisma.profileLessonFocus.update({
        where: { profileId_lessonId: { lessonId, profileId } },
        data: { isFocused },
      });
      return true;
    }),

  getSingleLearningPlan: protectedProcedure
    .input(z.object({ learningPlanName: z.string() }))
    .query(async ({ input: { learningPlanName }, ctx }) => {
      const profileId = ctx.session.user.activeProfile?.id;
      const legacyName = learningPlanName.replace(/-/g, " ");
      const plan = await prisma.learningPlan.findFirst({
        where: {
          isArchived: false,
          OR: [
            { canonicalId: learningPlanName },
            { id: learningPlanName },
            { name: learningPlanName },
            { name: legacyName },
          ],
        },
        include: {
          chunks: {
            where: { isArchived: false },
            orderBy: { order: "asc" },
            include: {
              lessons: {
                where: { isArchived: false },
                orderBy: { order: "asc" },
                include: lessonInclude(profileId ?? NO_ACTIVE_PROFILE_ID),
              },
            },
          },
          lessons: {
            where: { chunkId: null, isArchived: false },
            orderBy: { order: "asc" },
            include: lessonInclude(profileId ?? NO_ACTIVE_PROFILE_ID),
          },
        },
      });
      if (!plan) throw new Error(`Plan not found: ${learningPlanName}`);

      const chunks = plan.chunks.map((chunk) => ({
        ...chunk,
        goals: parseJsonArray(chunk.goalsJson),
        lessons: chunk.lessons.map(augmentLessonWithScores),
      }));
      const lessons = plan.lessons.map(augmentLessonWithScores);
      const legacyWordIds = lessons.flatMap((lesson) =>
        lesson.words.map((word) => word.id)
      );
      const sentences =
        plan.isManaged || plan.chunks.length > 0
          ? []
          : await prisma.sentence.findMany({
              where: {
                isArchived: false,
                isDeleted: false,
                words: { some: { id: { in: legacyWordIds } } },
              },
              include: { words: true },
            });

      return { ...plan, chunks, lessons, sentences };
    }),

  getAllLearningPlans: protectedProcedure.query(async ({ ctx }) => {
    const plans = await getDetailedPlansForProfile(
      ctx.session.user.activeProfile?.id
    );
    return plans.map((plan) => ({
      ...plan,
      // The relation query orders chunks and their lessons. Keep that nesting
      // order when flattening so cards do not interleave lessons from chunks.
      lessons: [
        ...plan.lessons,
        ...plan.chunks.flatMap((chunk) => chunk.lessons),
      ].map(augmentLessonWithScores),
    }));
  }),

  createLearningPlan: protectedProcedure
    .input(LearningPlanCreateSchema)
    .mutation(async ({ input: { name, description } }) => {
      const maxOrder = await prisma.learningPlan.findFirst({
        orderBy: { order: "desc" },
      });
      return prisma.learningPlan.create({
        data: { name, description, order: (maxOrder?.order ?? 0) + 10 },
      });
    }),

  createLesson: protectedProcedure
    .input(LessonCreateSchema)
    .mutation(async ({ input: { name, description, learningPlanId } }) => {
      const plan = await prisma.learningPlan.findUnique({
        where: { id: learningPlanId },
      });
      if (!plan)
        throw new TRPCError({ code: "NOT_FOUND", message: "Plan not found." });
      if (plan.isArchived)
        throw new TRPCError({ code: "NOT_FOUND", message: "Plan not found." });
      if (plan.isManaged) managedContentError();
      const maxOrder = await prisma.lesson.findFirst({
        where: { learningPlanId },
        orderBy: { order: "desc" },
      });
      return prisma.lesson.create({
        data: {
          name,
          description,
          order: (maxOrder?.order ?? 0) + 10,
          LearningPlan: { connect: { id: learningPlanId } },
        },
      });
    }),

  bulkImportLesson: protectedProcedure
    .input(LessonBulkImportWordsSchema)
    .mutation(async ({ input: { contents, learningPlanId } }) => {
      const plan = await prisma.learningPlan.findUnique({
        where: { id: learningPlanId },
      });
      if (!plan)
        throw new TRPCError({ code: "NOT_FOUND", message: "Plan not found." });
      if (plan.isArchived)
        throw new TRPCError({ code: "NOT_FOUND", message: "Plan not found." });
      if (plan.isManaged) managedContentError();

      const lines = contents.split("\n").filter((line) => line.length > 0);
      const data = lines.map((line) => {
        const [topic, subTopic, words] = line
          .split("|")
          .map((s) => s.trim())
          .filter(Boolean);
        if (!topic || !subTopic || !words)
          throw new Error(`Invalid line: ${line}`);
        return { topic: `${topic} - ${subTopic}`, words };
      });
      await Promise.all(
        data.map(({ topic, words }) =>
          prisma.lesson.create({
            data: {
              name: topic,
              description: "",
              order: 0,
              LearningPlan: { connect: { id: learningPlanId } },
              words: {
                connectOrCreate: getWordsForSentence(words).map((word) => ({
                  where: { word },
                  create: { word, metaInfo: JSON.stringify({}) },
                })),
              },
            },
          })
        )
      );
      return true;
    }),

  editLessonWords: protectedProcedure
    .input(LessonEditWordsSchema)
    .mutation(async ({ input: { lessonId, words } }) => {
      const lesson = await prisma.lesson.findUnique({
        where: { id: lessonId },
        include: {
          LearningPlan: { select: { isManaged: true, isArchived: true } },
          chunk: { select: { isManaged: true, isArchived: true } },
        },
      });
      if (!lesson)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lesson not found.",
        });
      if (
        [
          lesson.isArchived,
          lesson.LearningPlan?.isArchived,
          lesson.chunk?.isArchived,
        ].some(Boolean)
      ) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lesson not found.",
        });
      }
      if (
        lesson.isManaged ||
        lesson.LearningPlan?.isManaged === true ||
        lesson.chunk?.isManaged === true
      )
        managedContentError();

      return prisma.lesson.update({
        where: { id: lessonId },
        data: {
          words: {
            connectOrCreate: getWordsForSentence(words).map((word) => ({
              where: { word },
              create: { word, metaInfo: JSON.stringify({}) },
            })),
          },
        },
      });
    }),
});

function parseJsonArray(value: string): string[] {
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

type RawLesson = Awaited<
  ReturnType<typeof getDetailedPlansForProfile>
>[number]["lessons"][number];
type ScoredWord = {
  id: string;
  word: string;
  metaInfo: string;
  results: { score: number }[];
  goodCount: number;
  badCount: number;
  role?: string;
  order?: number;
};

function scoreWord<T extends { results: { score: number }[] }>(word: T) {
  const goodCount = word.results.filter((result) => result.score > 50).length;
  const badCount = word.results.filter((result) => result.score <= 50).length;
  return { ...word, goodCount, badCount };
}

// The generated Prisma payload is intentionally normalized here. This keeps
// legacy components on `words` while managed lessons expose role and order.
function augmentLessonWithScores(lesson: RawLesson) {
  const links = lesson.lessonWords ?? [];
  const managed = lesson.isManaged || links.length > 0;
  const words: ScoredWord[] = managed
    ? links.map((link) => ({
        ...scoreWord(link.word),
        role: link.role,
        order: link.order,
      }))
    : lesson.words.map(scoreWord);
  const targetWords = words.filter(
    (word) => !managed || word.role === "TARGET"
  );
  const reviewWords = managed
    ? words.filter((word) => word.role === "REVIEW")
    : [];
  const sentences = (lesson.lessonSentences ?? []).map((link) => link.sentence);
  return {
    ...lesson,
    words,
    targetWords,
    reviewWords,
    targetPatterns: parseJsonArray(lesson.targetPatternsJson),
    sentences,
    prerequisites: lesson.prerequisites.map((item) => item.prerequisiteLesson),
    reviewSources: lesson.reviewSources.map((item) => item.reviewLesson),
  };
}

async function getDetailedPlansForProfile(profileId?: string) {
  const profileQueryId = profileId ?? NO_ACTIVE_PROFILE_ID;
  return prisma.learningPlan.findMany({
    where: { isArchived: false },
    include: {
      chunks: {
        where: { isArchived: false },
        orderBy: { order: "asc" },
        include: {
          lessons: {
            where: { isArchived: false },
            orderBy: { order: "asc" },
            include: lessonInclude(profileQueryId),
          },
        },
      },
      lessons: {
        where: { chunkId: null, isArchived: false },
        orderBy: { order: "asc" },
        include: lessonInclude(profileQueryId),
      },
    },
    orderBy: [{ order: "asc" }, { canonicalId: "asc" }],
  });
}
