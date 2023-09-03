/*
  Warnings:

  - You are about to drop the `ProfileWordResult` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProfileWordResult" DROP CONSTRAINT "ProfileWordResult_profileId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileWordResult" DROP CONSTRAINT "ProfileWordResult_questionId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileWordResult" DROP CONSTRAINT "ProfileWordResult_wordId_fkey";

-- DropTable
DROP TABLE "ProfileWordResult";

-- CreateTable
CREATE TABLE "ProfileQuestionResult" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metaInfo" JSONB NOT NULL,
    "profileId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProfileQuestionResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProfileQuestionResult" ADD CONSTRAINT "ProfileQuestionResult_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileQuestionResult" ADD CONSTRAINT "ProfileQuestionResult_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
