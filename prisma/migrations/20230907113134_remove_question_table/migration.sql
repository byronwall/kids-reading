/*
  Warnings:

  - You are about to drop the column `questionId` on the `ProfileQuestionResult` table. All the data in the column will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProfileQuestionResult" DROP CONSTRAINT "ProfileQuestionResult_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_sentenceId_fkey";

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_wordId_fkey";

-- AlterTable
ALTER TABLE "ProfileQuestionResult" DROP COLUMN "questionId",
ADD COLUMN     "sentenceId" TEXT,
ADD COLUMN     "wordId" TEXT;

-- DropTable
DROP TABLE "Question";

-- DropEnum
DROP TYPE "QuestionType";

-- AddForeignKey
ALTER TABLE "ProfileQuestionResult" ADD CONSTRAINT "ProfileQuestionResult_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileQuestionResult" ADD CONSTRAINT "ProfileQuestionResult_sentenceId_fkey" FOREIGN KEY ("sentenceId") REFERENCES "Sentence"("id") ON DELETE SET NULL ON UPDATE CASCADE;
