-- This migration is intentionally additive.
-- Existing LearningPlan, Lesson, Sentence, ProfileQuestionResult, and relation
-- rows remain unchanged. The curriculum sync will populate the new fields for
-- managed records after it validates the authored files.
-- The legacy implicit lesson relations are not copied into LessonWord or
-- LessonSentence: their role, order, and authored source IDs are unavailable.
-- A later cleanup can backfill them only after an explicit content policy.

-- Create the new identity and hierarchy tables before adding their nullable
-- references to existing rows.
CREATE TABLE "SentenceIdentity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "canonicalId" TEXT NOT NULL,
    "sourcePath" TEXT,
    "sourceHash" TEXT,
    "isManaged" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE "LearningPlanChunk" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "learningPlanId" TEXT NOT NULL,
    "canonicalId" TEXT,
    "sourcePath" TEXT,
    "sourceHash" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "goalsJson" TEXT NOT NULL DEFAULT '[]',
    "order" INTEGER NOT NULL,
    "difficulty" INTEGER,
    "isManaged" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "LearningPlanChunk_learningPlanId_fkey"
      FOREIGN KEY ("learningPlanId") REFERENCES "LearningPlan"("id")
      ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "LessonWord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lessonId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,
    "role" TEXT NOT NULL CHECK ("role" IN ('TARGET', 'REVIEW')),
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "LessonWord_lessonId_fkey"
      FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id")
      ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LessonWord_wordId_fkey"
      FOREIGN KEY ("wordId") REFERENCES "Word"("id")
      ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "LessonSentence" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lessonId" TEXT NOT NULL,
    "sentenceId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "LessonSentence_lessonId_fkey"
      FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id")
      ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LessonSentence_sentenceId_fkey"
      FOREIGN KEY ("sentenceId") REFERENCES "Sentence"("id")
      ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "LessonPrerequisite" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lessonId" TEXT NOT NULL,
    "prerequisiteLessonId" TEXT NOT NULL,
    CONSTRAINT "LessonPrerequisite_lessonId_fkey"
      FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id")
      ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LessonPrerequisite_prerequisiteLessonId_fkey"
      FOREIGN KEY ("prerequisiteLessonId") REFERENCES "Lesson"("id")
      ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "LessonReviewSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "lessonId" TEXT NOT NULL,
    "reviewLessonId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "LessonReviewSource_lessonId_fkey"
      FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id")
      ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "LessonReviewSource_reviewLessonId_fkey"
      FOREIGN KEY ("reviewLessonId") REFERENCES "Lesson"("id")
      ON DELETE CASCADE ON UPDATE CASCADE
);

ALTER TABLE "LearningPlan" ADD COLUMN "canonicalId" TEXT;
ALTER TABLE "LearningPlan" ADD COLUMN "sourcePath" TEXT;
ALTER TABLE "LearningPlan" ADD COLUMN "sourceHash" TEXT;
ALTER TABLE "LearningPlan" ADD COLUMN "ageRange" TEXT;
ALTER TABLE "LearningPlan" ADD COLUMN "isManaged" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "LearningPlan" ADD COLUMN "isArchived" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Lesson" ADD COLUMN "chunkId" TEXT REFERENCES "LearningPlanChunk"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Lesson" ADD COLUMN "canonicalId" TEXT;
ALTER TABLE "Lesson" ADD COLUMN "sourcePath" TEXT;
ALTER TABLE "Lesson" ADD COLUMN "sourceHash" TEXT;
ALTER TABLE "Lesson" ADD COLUMN "focus" TEXT;
ALTER TABLE "Lesson" ADD COLUMN "difficulty" INTEGER;
ALTER TABLE "Lesson" ADD COLUMN "targetPatternsJson" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "Lesson" ADD COLUMN "teacherNote" TEXT;
ALTER TABLE "Lesson" ADD COLUMN "allowedSightWordsJson" TEXT NOT NULL DEFAULT '[]';
ALTER TABLE "Lesson" ADD COLUMN "isManaged" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Lesson" ADD COLUMN "isArchived" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Sentence" ADD COLUMN "sentenceIdentityId" TEXT REFERENCES "SentenceIdentity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Sentence" ADD COLUMN "canonicalId" TEXT;
ALTER TABLE "Sentence" ADD COLUMN "sourcePath" TEXT;
ALTER TABLE "Sentence" ADD COLUMN "sourceHash" TEXT;
ALTER TABLE "Sentence" ADD COLUMN "revision" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Sentence" ADD COLUMN "isCurrentRevision" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "Sentence" ADD COLUMN "isManaged" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Sentence" ADD COLUMN "isArchived" BOOLEAN NOT NULL DEFAULT false;

CREATE UNIQUE INDEX "SentenceIdentity_canonicalId_key"
  ON "SentenceIdentity"("canonicalId");
CREATE UNIQUE INDEX "LearningPlan_canonicalId_key"
  ON "LearningPlan"("canonicalId");
CREATE UNIQUE INDEX "LearningPlanChunk_canonicalId_key"
  ON "LearningPlanChunk"("canonicalId");
CREATE UNIQUE INDEX "LearningPlanChunk_learningPlanId_order_key"
  ON "LearningPlanChunk"("learningPlanId", "order");
CREATE UNIQUE INDEX "Lesson_canonicalId_key"
  ON "Lesson"("canonicalId");
CREATE UNIQUE INDEX "Sentence_canonicalId_revision_key"
  ON "Sentence"("canonicalId", "revision");
CREATE UNIQUE INDEX "LessonWord_lessonId_wordId_key"
  ON "LessonWord"("lessonId", "wordId");
CREATE UNIQUE INDEX "LessonWord_lessonId_role_order_key"
  ON "LessonWord"("lessonId", "role", "order");
CREATE UNIQUE INDEX "LessonSentence_lessonId_sentenceId_key"
  ON "LessonSentence"("lessonId", "sentenceId");
CREATE UNIQUE INDEX "LessonSentence_lessonId_order_key"
  ON "LessonSentence"("lessonId", "order");
CREATE UNIQUE INDEX "LessonPrerequisite_lessonId_prerequisiteLessonId_key"
  ON "LessonPrerequisite"("lessonId", "prerequisiteLessonId");
CREATE UNIQUE INDEX "LessonReviewSource_lessonId_reviewLessonId_key"
  ON "LessonReviewSource"("lessonId", "reviewLessonId");
CREATE UNIQUE INDEX "LessonReviewSource_lessonId_order_key"
  ON "LessonReviewSource"("lessonId", "order");

CREATE INDEX "LearningPlanChunk_learningPlanId_idx"
  ON "LearningPlanChunk"("learningPlanId");
CREATE INDEX "Lesson_chunkId_order_idx"
  ON "Lesson"("chunkId", "order");
CREATE INDEX "LessonWord_wordId_idx"
  ON "LessonWord"("wordId");
CREATE INDEX "LessonSentence_sentenceId_idx"
  ON "LessonSentence"("sentenceId");
CREATE INDEX "LessonPrerequisite_prerequisiteLessonId_idx"
  ON "LessonPrerequisite"("prerequisiteLessonId");
CREATE INDEX "LessonReviewSource_reviewLessonId_idx"
  ON "LessonReviewSource"("reviewLessonId");
CREATE INDEX "Sentence_sentenceIdentityId_isCurrentRevision_idx"
  ON "Sentence"("sentenceIdentityId", "isCurrentRevision");
CREATE INDEX "Sentence_canonicalId_idx"
  ON "Sentence"("canonicalId");
