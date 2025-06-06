import { Module } from '@nestjs/common';
import { UserAssessmentController } from './userAssessment.controller';
import { UserAssessmentService } from './userAssessment.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { AssessmentModule } from '../assessment/assessment.module';
import { GptModule } from '../gpt/gpt.module';
import { LanguageJourneyModule } from '../languageJourney/languageJourney.module';
import { WhisperModule } from '../whisper/whisper.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AssessmentModule,
    GptModule,
    LanguageJourneyModule,
    WhisperModule,
  ],
  controllers: [UserAssessmentController],
  providers: [UserAssessmentService],
})
export class UserAssessmentModule {}
