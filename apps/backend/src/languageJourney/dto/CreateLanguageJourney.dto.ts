import { StartingOption } from '@prisma/client';

export interface CreateLanguageJourneyDto {
  uid: string;
  languageId: string;
  learningReasons: string[];
  startingOption: StartingOption;
}
