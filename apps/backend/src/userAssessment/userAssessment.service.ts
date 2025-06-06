import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Language, UserAssessment } from '@prisma/client';
import { Answer, SubmitAssessmentDto } from './dto/submit-assessment.dto';
import { QuestionItem } from '@lexora/types';
import { AssessmentResult } from './interfaces/resultJson.interface';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from '../user/user.service';
import { AssessmentService } from '../assessment/assessment.service';
import { GptService } from '../gpt/gpt.service';
import { AssessmentJson } from '../assessment/interfaces/assessmentJson.interface';
import { LanguageJourneyService } from '../languageJourney/languageJourney.service';

@Injectable()
export class UserAssessmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly assessmentService: AssessmentService,
    private readonly gptService: GptService,
    private readonly languageJourneyService: LanguageJourneyService
  ) {}

  async getOrCreateUserAssessment(
    uid: string,
    languageId: string,
    nativeLanguage = 'English'
  ): Promise<UserAssessment> {
    try {
      const targetLanguage = await this.prisma.language.findFirst({
        where: { id: languageId },
      });

      if (!targetLanguage) {
        throw new BadRequestException('Language not found');
      }

      // const existingUserAssessment = await this.prisma.userAssessment.findFirst(
      //   {
      //     where: { userId: uid, assessment: { languageId } },
      //     include: { assessment: true },
      //     orderBy: { createdAt: 'desc' },
      //   }
      // );

      // if (existingUserAssessment) {
      //   return existingUserAssessment;
      // }

      const newAssessment = await this.generateNewAssessmentForUser(
        uid,
        targetLanguage,
        nativeLanguage
      );

      if (!newAssessment) {
        throw new BadRequestException('User assessment not found');
      }

      return newAssessment;
    } catch (e) {
      console.error('[getOrCreateUserAssessment] Error:', e);
      throw new InternalServerErrorException(e);
    }
  }

  async getLatestUserAssessment(uid: string): Promise<UserAssessment> {
    if (!uid) {
      throw new BadRequestException('uid is required');
    }

    const user = await this.userService.findByUid(uid);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const existingUserAssessment = await this.prisma.userAssessment.findFirst({
      where: { userId: uid },
      orderBy: { createdAt: 'desc' },
      include: { assessment: true },
    });

    if (!existingUserAssessment) {
      throw new BadRequestException('User has no assessment');
    }

    return existingUserAssessment;
  }

  async submitAssessment(dto: SubmitAssessmentDto) {
    try {
      console.log('[BACKEND] from submit assessment', dto);

      const user = await this.userService.findByUid(dto.uid);
      const assessment = await this.assessmentService.getAssessmentById(
        dto.assessmentId
      );
      const originalQuestions =
        assessment.questions as unknown as QuestionItem[];

      const answerMap = new Map<number, string | Record<number, string>>();
      for (const ans of dto.answers) {
        if ('answer' in ans) {
          answerMap.set(ans.originalIndex, ans.answer);
        } else {
          answerMap.set(ans.originalIndex, ans.answers);
        }
      }

      const annotatedQuestions = originalQuestions.map((question, index) => ({
        ...question,
        index,
        userAnswer: answerMap.get(index) ?? null,
      }));

      const prompt = `
You are an expert language evaluator.
You will receive a list of assessment questions and the answers provided by a user.
Each item includes:
- type: question type
- data: original question
- userAnswer: what the user answered

Return only JSON in this format:
{
  "graded": [
    { "index": 0, "type": "vocabulary_multiple_choice", "correct": true },
    ...
  ],
  "level": "B1",
  "feedback": "User shows a strong grasp of grammar but some vocabulary errors."
}

Here is the data:
${JSON.stringify(annotatedQuestions)}
`;

      const gptResult = await this.gptService.getGptResponse([
        { role: 'system', content: 'You are an expert language evaluator.' },
        { role: 'user', content: prompt },
      ]);

      let result: AssessmentResult;
      try {
        result = JSON.parse(
          this.gptService.cleanGptJsonResponse(gptResult)
        ) as AssessmentResult;
      } catch (error) {
        console.error('Failed to parse GPT response', error);
        throw new InternalServerErrorException(
          'Grading failed. Please try again.'
        );
      }

      console.log('GPT Result:', result);

      const UA = await this.prisma.userAssessment.findFirst({
        where: { userId: user.uid, assessmentId: assessment.id },
      });

      if (!UA) {
        throw new BadRequestException('User assessment not found');
      }

      await this.prisma.userAssessment.update({
        where: { id: UA.id },
        data: {
          status: 'COMPLETED',
          completedAt: new Date(),
          score: result.graded.filter((q) => q.correct).length,
          level: result.level,
        },
      });

      await this.languageJourneyService.updatePlacementLevel(
        user.uid,
        assessment.languageId,
        result.level.toString()
      );

      return result;
    } catch (err) {
      console.error('[submitAssessment] Unexpected error:', err);
      throw new InternalServerErrorException(
        'Something went wrong while submitting the assessment.'
      );
    }
  }

  private async generateNewAssessmentForUser(
    userId: string,
    targetLanguage: Language,
    nativeLanguage: string
  ): Promise<UserAssessment> {
    const prompt = `You are a test generator. Create a language placement test for learning ${targetLanguage.name}. The user's native language is ${nativeLanguage}.

The test should estimate the learner's CEFR level (A1–C2). Include a mix of easier (A1–A2), intermediate (B1–B2), and advanced (C1–C2) questions, but do not label the difficulty levels. Mix the order of difficulties and types.

⚠️ All content (questions, paragraphs, text prompts, options, answers, etc.) must be written entirely in ${targetLanguage.name}, **except** for English translations used as answer choices in vocabulary questions. Do NOT include any explanations or formatting.

Generate exactly 14 questions using the following structure:

- 4 grammar_multiple_choice
- 4 vocabulary_multiple_choice
- 2 reading_comprehension
- 2 listening_comprehension
- 2 speaking_repetition

Use these formats exactly:

{
  "type": "grammar_multiple_choice",
  "question": "...",
  "options": ["...", "...", "...", "..."],
  "correct_answer": "..."
}

{
  "type": "vocabulary_multiple_choice",
  "question": "¿Qué significa la palabra '_____’?",
  "options": ["${nativeLanguage} translation", "...", "...", "..."],
  "correct_answer": "correct ${nativeLanguage} translation"
}

{
  "type": "reading_comprehension",
  "paragraph": "...",
  "question": "...",
  "options": ["...", "...", "...", "..."],
  "correct_answer": "..."
}

{
  "type": "listening_comprehension",
  "text_prompt": "(a single spoken sentence or monologue in ${targetLanguage.name} that clearly implies or states the answer)",
  "question": "(a question about a specific detail mentioned or implied in the text_prompt)",
  "options": ["...", "...", "...", "..."],
  "correct_answer": "..."
}

{
  "type": "speaking_repetition",
  "prompt": "(just the sentence to be repeated, no intro like 'Repite la siguiente frase')"
}
`;

    const gptResponse = await this.gptService.getGptResponse([
      {
        role: 'system',
        content:
          'You only respond with raw JSON — no prose, no Markdown, no formatting. Only output a JSON array of objects.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    console.log('GPT Response:', gptResponse);

    const cleaned = this.gptService.cleanGptJsonResponse(gptResponse);
    let parsed: AssessmentJson;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error('JSON parsing error:', err);
      console.error('Raw cleaned output:', cleaned);
      throw err;
    }

    const assessment = await this.prisma.assessment.create({
      data: {
        languageId: targetLanguage.id,
        questions: parsed,
      },
    });

    const userAssessment = await this.prisma.userAssessment.create({
      data: {
        userId,
        assessmentId: assessment.id,
        status: 'PENDING',
      },
      include: { assessment: true },
    });

    return userAssessment;
  }
}
