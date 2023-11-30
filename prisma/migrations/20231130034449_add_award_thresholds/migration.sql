-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "sentenceThresholdForAward" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "wordThresholdForAward" INTEGER NOT NULL DEFAULT 100;
