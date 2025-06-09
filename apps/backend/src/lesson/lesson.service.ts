import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import {
  ExerciseType,
  Language,
  LanguageJourney,
  Lesson,
} from '@prisma/client';
import { GptService } from '../gpt/gpt.service';
import { ExerciseJson } from './lesson.interface';

@Injectable()
export class LessonService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly gptService: GptService
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

      await this.prisma.exercise.createMany({
        data: generatedExercises.map((e) => ({
          lessonId: lesson.id,
          type: e.type,
          data: e,
        })),
      });

      const updatedLesson = await this.prisma.lesson.findUnique({
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

      if (!updatedLesson) {
        throw new Error('Lesson not found');
      }

      return updatedLesson;
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
    const { focus, estimatedMinutes, exerciseTypes } = lesson;
    const { placementLevel, learningReasons } = lj;
    const { name: targetLanguage } = lang;

    const formatMap: Record<ExerciseType, string> = {
      grammar_multiple_choice: `{
  "type": "grammar_multiple_choice",
  "question": "Complete the sentence: Yo ___ al mercado.",
  "options": ["va", "voy", "vas", "van"],
  "correct_answer": "voy"
}`,
      vocabulary_multiple_choice: `{
  "type": "vocabulary_multiple_choice",
  "question": "What does the word 'perro' mean?",
  "options": ["dog", "cat", "car", "house"],
  "correct_answer": "dog"
}`,
      reading_comprehension: `{
  "type": "reading_comprehension",
  "paragraph": "Juan va al mercado todos los días. Compra frutas y verduras frescas.",
  "question": "What does Juan buy at the market?",
  "options": ["Shoes", "Books", "Fruits and vegetables", "Clothes"],
  "correct_answer": "Fruits and vegetables"
}`,
      listening_comprehension: `{
  "type": "listening_comprehension",
  "text_prompt": "Hoy es un buen día para caminar en el parque.",
  "question": "What does the speaker suggest doing?",
  "options": ["Go to the park", "Cook at home", "Go to the movies", "Read a book"],
  "correct_answer": "Go to the park"
}`,
      speaking_repetition: `{
  "type": "speaking_repetition",
  "prompt": "¿Dónde está el baño?"
}`,
      text_ai_conversation: `{
  "type": "text_ai_conversation",
  "context": "You are practicing small talk in a café.",
  "initial_prompt": "Hola, ¿cómo estás hoy?",
  "aiPersona": "friendly native speaker",
  "goal": "Practice responding with polite greetings and small talk"
}`,
      voice_ai_conversation: `{
  "type": "voice_ai_conversation",
  "context": "You are ordering food at a restaurant.",
  "initial_prompt": "Hola, ¿qué te gustaría pedir?",
  "aiPersona": "polite restaurant server",
  "goal": "Practice ordering food out loud"
}`,
    };

    const includedFormats = exerciseTypes
      .map((type) => formatMap[type])
      .filter(Boolean)
      .join('\n\n');

    const numberOfExercises = Math.ceil(estimatedMinutes / 1.5);

    const prompt = `
You are an AI assistant helping build structured language learning exercises.

The learner is studying: ${targetLanguage}
CEFR level: ${placementLevel ?? 'A1'}
Lesson topic: "${focus}"
Learning goals: ${learningReasons.join(', ')}

📌 Generate exactly **${numberOfExercises} exercises** for this session.
You can freely choose from these allowed types: ${exerciseTypes.join(', ')}.
You may repeat types, but try to vary the content and challenge.

Each exercise must follow **one of the formats below exactly**:

${includedFormats}

⚠️ Return only a JSON array of exactly ${numberOfExercises} exercises.
Do not include any extra text, comments, Markdown, or explanations.
`;

    const generated = await this.gptService.getGptResponse([
      {
        role: 'system',
        content: 'You are an expert language teacher and curriculum designer.',
      },
      { role: 'user', content: prompt },
    ]);

    const cleaned = this.gptService.cleanGptJsonResponse(generated);
    const exercises: ExerciseJson[] = JSON.parse(cleaned);

    return exercises;
  }
}
