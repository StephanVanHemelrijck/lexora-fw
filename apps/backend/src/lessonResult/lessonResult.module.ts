import { Module } from '@nestjs/common';
import { LessonResultService } from './lessonResult.service';
import { PrismaModule } from '../prisma/prisma.module';
import { LessonResultController } from './lessonResult.controller';

@Module({
  imports: [PrismaModule],
  controllers: [LessonResultController],
  providers: [LessonResultService],
  exports: [LessonResultService],
})
export class LessonResultModule {}
