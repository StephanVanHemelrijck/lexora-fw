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
}
