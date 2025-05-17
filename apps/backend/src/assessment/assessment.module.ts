import { Module } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { AssessmentController } from './assessment.controller';
import { UserModule } from '../user/user.module';
import { GptModule } from '../gpt/gpt.module';

@Module({
  imports: [GptModule, UserModule],
  controllers: [AssessmentController],
  providers: [AssessmentService],
  exports: [AssessmentService],
})
export class AssessmentModule {}
