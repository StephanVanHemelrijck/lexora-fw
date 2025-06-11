/*
  Warnings:

  - Added the required column `estimatedMinutes` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `focus` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "estimatedMinutes" INTEGER NOT NULL,
ADD COLUMN     "focus" TEXT NOT NULL;
