/*
  Warnings:

  - You are about to drop the column `words` on the `Sentence` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Sentence" DROP COLUMN "words";

-- AlterTable
ALTER TABLE "Word" ADD COLUMN     "sentenceId" TEXT;
