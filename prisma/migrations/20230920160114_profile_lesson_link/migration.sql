-- CreateTable
CREATE TABLE "ProfileLessonFocus" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "isFocused" BOOLEAN NOT NULL DEFAULT false,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProfileLessonFocus_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ProfileLessonFocus_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProfileLessonFocus_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
