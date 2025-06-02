import { Module } from '@nestjs/common';
import { LanguageJourneyController } from './languageJourney.controller';
import { LanguageJourneyService } from './languageJourney.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LanguageJourneyController],
  providers: [LanguageJourneyService],
})
export class LanguageJourneyModule {}
