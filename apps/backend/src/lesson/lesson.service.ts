import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { Lesson } from '@prisma/client';

@Injectable()
export class LessonService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) {}
  async getUpcomingLessonForUser(uid: string): Promise<Lesson[]> {
    const user = await this.userService.findByUid(uid);

    if (!user) {
      throw new Error('User not found');
    }

    // get all languagejourneys for user

    return this.prisma.lesson.findMany({
      where: {
        lessonPlan: {
          languageJourney: {
            uid,
          },
        },
      },
      include: {
        exercises: true,
        lessonPlan: {
          include: {
            languageJourney: {
              include: {
                language: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: 'asc',
      },

      take: 1,
    });
  }
}
