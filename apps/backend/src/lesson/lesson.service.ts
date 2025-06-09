import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { Language, LanguageJourney, Lesson } from '@prisma/client';

@Injectable()
export class LessonService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) {}

  async getLessonById(id: string): Promise<Lesson> {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
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
    });

    if (!lesson) {
      throw new Error('Lesson not found');
    }

    const lj = lesson.lessonPlan.languageJourney;
    const lang = lj.language;

    if (lesson.exercises.length === 0) {
      const generatedExercises = await this.generateExercisesForLesson(
        lesson,
        lj,
        lang
      );
    }
    return lesson;
  }

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

  async generateExercisesForLesson(
    lesson: Lesson,
    lj: LanguageJourney,
    lang: Language
  ) {
    const { focus, estimatedMinutes } = lesson;
    const { placementLevel, learningReasons } = lj;
    const { name: targetLanguage } = lang;
  }
}
