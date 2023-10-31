/*
  Warnings:

  - A unique constraint covering the columns `[profileId,wordId]` on the table `ProfileWordSummary` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProfileWordSummary_profileId_wordId_key" ON "ProfileWordSummary"("profileId", "wordId");
