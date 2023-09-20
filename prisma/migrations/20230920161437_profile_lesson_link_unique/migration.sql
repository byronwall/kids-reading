/*
  Warnings:

  - A unique constraint covering the columns `[profileId,lessonId]` on the table `ProfileLessonFocus` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProfileLessonFocus_profileId_lessonId_key" ON "ProfileLessonFocus"("profileId", "lessonId");
