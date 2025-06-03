import { Module } from '@nestjs/common';
import { UserAssessmentController } from './userAssessment.controller';
import { UserAssessmentService } from './userAssessment.service';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { AssessmentModule } from '../assessment/assessment.module';
import { GptModule } from '../gpt/gpt.module';
import { LanguageJourneyModule } from '../languageJourney/languageJourney.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AssessmentModule,
    GptModule,
    LanguageJourneyModule,
  ],
  controllers: [UserAssessmentController],
  providers: [UserAssessmentService],
})
export class UserAssessmentModule {}
