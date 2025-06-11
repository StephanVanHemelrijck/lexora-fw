import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ExerciseType, LanguageJourney } from '@prisma/client';
import { GptService } from '../gpt/gpt.service';
import { addDays, startOfDay } from 'date-fns';

function buildWeekPlanPrompt({
  targetLanguage,
  nativeLanguage,
  cefrLevel,
  learningReasons,
  dailyMinutes,
}: {
  targetLanguage: string;
  nativeLanguage: string;
  cefrLevel: string;
  learningReasons: string[];
  dailyMinutes: number;
}) {
  return `
You are an expert language tutor.

Create a structured 7-day learning plan for a student learning ${targetLanguage}.
- Native language: ${nativeLanguage}
- CEFR level: ${cefrLevel}
- Learning reasons: ${learningReasons.join(', ')}
- Desired study time per day: approximately ${dailyMinutes} minutes

Each day should include:
- A short title/description of the focus
- A list of 1–3 exercise types to target the day's objective
- An estimated number of minutes for that day (this can vary slightly, e.g., 20–30 min)

🧠 Educational goals:
- The plan should build progressively from foundational to more applied language skills.
- Match difficulty and focus to the user's CEFR level and learning motivations.
- Ensure variety and well-rounded skill development.

✅ Important requirements:
- Use **every** one of the following exercise types **at least once** during the 7-day plan:
  - grammar_multiple_choice
  - vocabulary_multiple_choice
  - reading_comprehension
  - listening_comprehension
  - speaking_repetition

⚠️ Return only JSON in the format below:

[
  {
    "day": 1,
    "focus": "Conjugating common present-tense verbs",
    "exerciseTypes": ["grammar_multiple_choice", "speaking_repetition"],
    "estimatedMinutes": 25
  },
  ...
]
`;
}

@Injectable()
export class LessonPlanService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gptService: GptService
  ) {}

  async generateLessonPlan(languageJourneyId: string, uid: string) {
    console.log(`Generating plan for ${languageJourneyId} and user ${uid}`);

    const languageJourney = await this.prisma.languageJourney.findUnique({
      where: { id: languageJourneyId },
    });

    const today = startOfDay(new Date());
    // get week plan for languageJourneyId and check if its not already expired
    console.log(`[BACKEND] today: ${today}`);

    const existingWeekPlan = await this.prisma.lessonPlan.findFirst({
      where: {
        languageJourneyId,
        startDate: { lte: today },
        endDate: { gte: today },
      },
      include: { lessons: { include: { exercises: true } } },
    });

    // if (existingWeekPlan) {
    //   console.log(`[BACKEND] returning existing week plan`);
    //   return existingWeekPlan;
    // }

    if (!languageJourney)
      throw new NotFoundException('Language Journey not found');

    const weekPlan = await this.generateWeeklyLearningPlan(languageJourney);
    // TODO: Save plan and generate lessons based on `weekPlan`

    console.log('[BACKEND WEEKPLAN]', weekPlan);

    const lessonPlan = await this.prisma.lessonPlan.create({
      data: {
        languageJourneyId,
        cefrLevel: languageJourney.placementLevel ?? 'A1',
        startDate: today,
        endDate: addDays(today, 6),
        lessons: {
          create: weekPlan.map((day) => ({
            date: addDays(today, day.day - 1),
            focus: day.focus,
            estimatedMinutes: day.estimatedMinutes,
            exerciseTypes: { set: day.exerciseTypes as ExerciseType[] },
          })),
        },
      },
      include: {
        lessons: {
          include: {
            exercises: true,
          },
        },
      },
    });

    console.log('[BACKEND] Generated plan: ', lessonPlan);

    return lessonPlan;
  }

  async generateWeeklyLearningPlan(languageJourney: LanguageJourney) {
    const { placementLevel, learningReasons, uid } = languageJourney;

    const user = await this.prisma.user.findUnique({ where: { uid } });
    if (!user) throw new BadRequestException('User not found');

    const language = await this.prisma.language.findUnique({
      where: { id: languageJourney.languageId },
    });

    if (!language || !placementLevel)
      throw new BadRequestException('Language or placement level not found');

    const prompt = buildWeekPlanPrompt({
      targetLanguage: language.name,
      nativeLanguage: user.nativeLanguage,
      cefrLevel: placementLevel,
      learningReasons,
      dailyMinutes: user.dailyMinutes,
    });

    const gptResponse = await this.gptService.getGptResponse([
      { role: 'system', content: 'You are an expert language teacher' },
      { role: 'user', content: prompt },
    ]);

    console.log('[BACKEND] GPT response: ', gptResponse);

    const cleaned = this.gptService.cleanGptJsonResponse(gptResponse);
    console.log('[BACKEND] Cleaned GPT response: ', cleaned);

    let parsed: {
      day: number;
      focus: string;
      exerciseTypes: string[];
      estimatedMinutes: number;
    }[];

    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error(e);
      throw new Error('Failed to parse GPT response');
    }

    return parsed;
  }

  async getLessonProgressForPlan(lessonPlanId: string, userId: string) {
    const lessons = await this.prisma.lesson.findMany({
      where: { lessonPlanId },
      include: {
        exercises: {
          select: { id: true },
        },
        LessonResult: {
          where: { userId },
          include: {
            exercises: true,
          },
        },
      },
    });

    return lessons.map((lesson) => {
      const completedCount =
        lesson.LessonResult[0]?.exercises.filter(
          (ex) => ex.status === 'completed'
        ).length || 0;

      return {
        id: lesson.id,
        focus: lesson.focus,
        estimatedMinutes: lesson.estimatedMinutes,
        exercises: {
          total: lesson.exercises.length,
          completed: completedCount,
        },
      };
    });
  }
}
