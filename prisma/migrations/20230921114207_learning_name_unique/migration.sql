/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `LearningPlan` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LearningPlan_name_key" ON "LearningPlan"("name");
