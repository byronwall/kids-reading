/*
  Warnings:

  - You are about to drop the column `sentenceId` on the `Word` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Word" DROP COLUMN "sentenceId";

-- CreateTable
CREATE TABLE "_SentenceToWord" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_SentenceToWord_A_fkey" FOREIGN KEY ("A") REFERENCES "Sentence"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_SentenceToWord_B_fkey" FOREIGN KEY ("B") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_SentenceToWord_AB_unique" ON "_SentenceToWord"("A", "B");

-- CreateIndex
CREATE INDEX "_SentenceToWord_B_index" ON "_SentenceToWord"("B");
