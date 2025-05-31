/*
  Warnings:

  - You are about to drop the column `routineMinutes` on the `LanguageJourney` table. All the data in the column will be lost.
  - Added the required column `dailyMinutes` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LanguageJourney" DROP COLUMN "routineMinutes";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dailyMinutes" INTEGER NOT NULL;
