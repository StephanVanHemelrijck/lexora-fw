import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LessonResultService {
  constructor(private readonly prisma: PrismaService) {}
  async ensureCreated(uid: string, lessonId: string) {
    return this.prisma.lessonResult.upsert({
      where: {
        userId_lessonId: {
          userId: uid,
          lessonId,
        },
      },
      update: {}, // No update needed
      create: {
        userId: uid,
        lessonId,
      },
    });
  }

  async markAsComplete(uid: string, lessonId: string) {
    // First: mark LessonResult as completed
    await this.prisma.lessonResult.update({
      where: { userId_lessonId: { userId: uid, lessonId } },
      data: {
        completedAt: new Date(),
      },
    });

    // Then: mark Lesson as completed
    return this.prisma.lesson.update({
      where: { id: lessonId },
      data: {
        isCompleted: true,
      },
    });
  }

  async getLessonResultByLessonId(uid: string, lessonId: string) {
    return this.prisma.lessonResult.findFirst({
      where: { userId: uid, lessonId },
      include: { exercises: true },
    });
  }
}
