-- CreateTable
CREATE TABLE "LanguageJourney" (
    "id" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "languageId" TEXT NOT NULL,
    "startedFromScratch" BOOLEAN NOT NULL,
    "placementLevel" TEXT,
    "lastActivity" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LanguageJourney_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "LanguageJourney" ADD CONSTRAINT "LanguageJourney_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LanguageJourney" ADD CONSTRAINT "LanguageJourney_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
