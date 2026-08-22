-- CreateTable
CREATE TABLE "ProfileAward" (
    "id" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profileId" TEXT NOT NULL,
    "awardType" TEXT NOT NULL,
    "awardValue" INTEGER,
    "wordId" TEXT,
    "lessonId" TEXT,
    "imageId" TEXT,

    CONSTRAINT "ProfileAward_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "ProfileAward_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ProfileAward_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ProfileAward_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "ProfileAward_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "AwardImages"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "AwardImages" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "metaInfo" TEXT NOT NULL DEFAULT '{}',

    CONSTRAINT "AwardImages_pkey" PRIMARY KEY ("id")
);
