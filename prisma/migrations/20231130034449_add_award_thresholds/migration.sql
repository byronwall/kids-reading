-- AlterTable
ALTER TABLE "Profile" ADD COLUMN "sentenceThresholdForAward" INTEGER NOT NULL DEFAULT 10;
ALTER TABLE "Profile" ADD COLUMN "wordThresholdForAward" INTEGER NOT NULL DEFAULT 100;
