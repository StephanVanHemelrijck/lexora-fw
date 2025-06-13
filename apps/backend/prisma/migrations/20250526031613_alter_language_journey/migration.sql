/*
  Warnings:

  - You are about to drop the column `startedFromScratch` on the `LanguageJourney` table. All the data in the column will be lost.
  - Added the required column `routineMinutes` to the `LanguageJourney` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startingOption` to the `LanguageJourney` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StartingOption" AS ENUM ('scratch', 'placement');

-- AlterTable
ALTER TABLE "LanguageJourney" DROP COLUMN "startedFromScratch",
ADD COLUMN     "learningReasons" TEXT[],
ADD COLUMN     "routineMinutes" INTEGER NOT NULL,
ADD COLUMN     "startingOption" "StartingOption" NOT NULL;
