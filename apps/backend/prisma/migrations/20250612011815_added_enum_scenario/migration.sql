/*
  Warnings:

  - Changed the type of `difficulty` on the `AiScenario` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ScenarioDifficulty" AS ENUM ('easy', 'medium', 'hard');

-- AlterTable
ALTER TABLE "AiScenario" DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" "ScenarioDifficulty" NOT NULL;
