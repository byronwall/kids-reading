/*
  Warnings:

  - A unique constraint covering the columns `[imageUrl]` on the table `AwardImages` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AwardImages_imageUrl_key" ON "AwardImages"("imageUrl");
