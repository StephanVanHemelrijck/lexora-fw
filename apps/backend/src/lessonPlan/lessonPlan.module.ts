import { Module } from '@nestjs/common';
import { LessonPlanService } from './lessonPlan.service';
import { PrismaModule } from '../prisma/prisma.module';
import { LessonPlanController } from './lessonPlan.controller';
import { GptModule } from '../gpt/gpt.module';

@Module({
  imports: [PrismaModule, GptModule],
  controllers: [LessonPlanController],
  providers: [LessonPlanService],
  exports: [LessonPlanService],
})
export class LessonPlanModule {}
