-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "maximumWordCount" INTEGER NOT NULL DEFAULT 1000,
ADD COLUMN     "minimumWordCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Sentence" ADD COLUMN     "wordCount" INTEGER NOT NULL DEFAULT 0;
