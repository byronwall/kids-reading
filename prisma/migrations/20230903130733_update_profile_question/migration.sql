/*
  Warnings:

  - You are about to drop the `ProfileWordResult` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ProfileWordResult";

-- CreateTable
CREATE TABLE "ProfileQuestionResult" (
    "id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "metaInfo" TEXT NOT NULL DEFAULT '{}',
    "profileId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "ProfileQuestionResult_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ProfileQuestionResult_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProfileQuestionResult_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
