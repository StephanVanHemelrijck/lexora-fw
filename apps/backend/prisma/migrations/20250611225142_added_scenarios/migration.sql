/*
  Warnings:

  - A unique constraint covering the columns `[lessonId]` on the table `LessonResult` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "AiScenario" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "difficulty" TEXT NOT NULL,
    "categories" TEXT[],
    "prompt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AiScenario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LessonResult_lessonId_key" ON "LessonResult"("lessonId");
