import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { GptModule } from '../gpt/gpt.module';
import { AssessmentModule } from '../assessment/assessment.module';
import { UserAssessmentModule } from '../userAssessment/userAssessment.module';
import { LanguageModule } from '../language/language.module';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    GptModule,
    AssessmentModule,
    UserAssessmentModule,
    LanguageModule,
    FirebaseModule,
  ],
})
export class AppModule {}
