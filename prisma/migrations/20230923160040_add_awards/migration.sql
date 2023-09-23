-- CreateEnum
CREATE TYPE "AwardType" AS ENUM ('WORD_COUNT', 'SENTENCE_COUNT', 'WORD_MASTERY', 'LESSON_MASTERY');

-- CreateTable
CREATE TABLE "ProfileAward" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profileId" TEXT NOT NULL,
    "awardType" TEXT NOT NULL,
    "awardValue" INTEGER,
    "wordId" TEXT,
    "lessonId" TEXT,
    "imageId" TEXT,

    CONSTRAINT "ProfileAward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AwardImages" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "metaInfo" JSONB NOT NULL,

    CONSTRAINT "AwardImages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProfileAward" ADD CONSTRAINT "ProfileAward_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileAward" ADD CONSTRAINT "ProfileAward_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileAward" ADD CONSTRAINT "ProfileAward_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;
