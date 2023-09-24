-- AddForeignKey
ALTER TABLE "ProfileAward" ADD CONSTRAINT "ProfileAward_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "AwardImages"("id") ON DELETE SET NULL ON UPDATE CASCADE;
