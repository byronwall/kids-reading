/*
  Warnings:

  - You are about to drop the column `questionId` on the `ProfileQuestionResult` table. All the data in the column will be lost.
  - You are about to drop the `Question` table. If the table is not empty, all the data it contains will be lost.

*/
-- SQLite cannot remove a column that is part of a foreign key in place.
-- Rebuild the table while preserving all columns that remain in the model.
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ProfileQuestionResult" (
    "id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metaInfo" TEXT NOT NULL DEFAULT '{}',
    "profileId" TEXT NOT NULL,
    "sentenceId" TEXT,
    "wordId" TEXT,
    "score" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "new_ProfileQuestionResult_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "new_ProfileQuestionResult_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "new_ProfileQuestionResult_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "new_ProfileQuestionResult_sentenceId_fkey" FOREIGN KEY ("sentenceId") REFERENCES "Sentence"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
-- Resolve the old question relation before removing the Question table.
INSERT INTO "new_ProfileQuestionResult" ("id", "createdAt", "metaInfo", "profileId", "sentenceId", "wordId", "score")
SELECT pqr."id", pqr."createdAt", pqr."metaInfo", pqr."profileId", q."sentenceId", q."wordId", pqr."score"
FROM "ProfileQuestionResult" AS pqr
LEFT JOIN "Question" AS q ON q."id" = pqr."questionId";
DROP TABLE "ProfileQuestionResult";
ALTER TABLE "new_ProfileQuestionResult" RENAME TO "ProfileQuestionResult";
PRAGMA foreign_keys=ON;

-- DropTable
DROP TABLE "Question";
