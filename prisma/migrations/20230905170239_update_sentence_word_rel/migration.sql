/*
  Warnings:

  - You are about to drop the column `words` on the `Sentence` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sentence" DROP COLUMN "words";

-- AlterTable
ALTER TABLE "Word" ADD COLUMN     "sentenceId" TEXT;

-- AddForeignKey
ALTER TABLE "Word" ADD CONSTRAINT "Word_sentenceId_fkey" FOREIGN KEY ("sentenceId") REFERENCES "Sentence"("id") ON DELETE SET NULL ON UPDATE CASCADE;
