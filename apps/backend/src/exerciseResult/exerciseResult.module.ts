import { Module } from '@nestjs/common';
import { ExerciseResultController } from './exerciseResult.controller';
import { ExerciseResultService } from './exerciseResult.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ExerciseResultController],
  providers: [ExerciseResultService],
  exports: [ExerciseResultService],
})
export class ExerciseResultModule {}
