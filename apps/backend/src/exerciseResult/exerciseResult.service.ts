import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaveExerciseResultDto } from './dto/SaveExerciseResultDto';

@Injectable()
export class ExerciseResultService {
  constructor(private readonly prisma: PrismaService) {}

  async saveOrUpdate(dto: SaveExerciseResultDto, userId: string) {
    const { exerciseId, selectedAnswer, isCorrect, status, lessonResultId } =
      dto;

    console.log(lessonResultId);

    await this.prisma.exercise.update({
      where: {
        id: exerciseId,
      },
      data: {
        status,
      },
    });

    return this.prisma.exerciseResult.upsert({
      where: {
        userId_exerciseId: {
          userId,
          exerciseId,
        },
      },
      update: {
        selectedAnswer,
        isCorrect,
        status,
        lessonResultId,
      },
      create: {
        userId,
        exerciseId,
        selectedAnswer,
        isCorrect,
        status,
        lessonResultId,
      },
    });
  }
}
