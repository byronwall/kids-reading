-- CreateTable
CREATE TABLE "LearningPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "LearningPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "learningPlanId" TEXT,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LessonToWord" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_LessonToSentence" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LessonToWord_AB_unique" ON "_LessonToWord"("A", "B");

-- CreateIndex
CREATE INDEX "_LessonToWord_B_index" ON "_LessonToWord"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LessonToSentence_AB_unique" ON "_LessonToSentence"("A", "B");

-- CreateIndex
CREATE INDEX "_LessonToSentence_B_index" ON "_LessonToSentence"("B");

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_learningPlanId_fkey" FOREIGN KEY ("learningPlanId") REFERENCES "LearningPlan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LessonToWord" ADD CONSTRAINT "_LessonToWord_A_fkey" FOREIGN KEY ("A") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LessonToWord" ADD CONSTRAINT "_LessonToWord_B_fkey" FOREIGN KEY ("B") REFERENCES "Word"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LessonToSentence" ADD CONSTRAINT "_LessonToSentence_A_fkey" FOREIGN KEY ("A") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LessonToSentence" ADD CONSTRAINT "_LessonToSentence_B_fkey" FOREIGN KEY ("B") REFERENCES "Sentence"("id") ON DELETE CASCADE ON UPDATE CASCADE;
