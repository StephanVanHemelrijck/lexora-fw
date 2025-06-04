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

      const existingUserAssessment = await this.prisma.userAssessment.findFirst(
        {
          where: { userId: uid, assessment: { languageId } },
          include: { assessment: true },
        }
      );

      if (existingUserAssessment) {
        return existingUserAssessment;
      }

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
    const prompt = `You are a test generator. Create a language test for learning ${targetLanguage.name}. The user's native language is English.

Generate exactly 18 questions total.

Allowed types:
- "grammar_multiple_choice": one question + 4 options + correct_answer
- "vocabulary_multiple_choice": same format
- "reading_comprehension": short paragraph, 1 question + 4 options + correct_answer
- "listening_comprehension": a realistic short sentence or dialogue as "text_prompt" that can be read aloud using TTS. Avoid using phrases like "You will hear...". Include "question", "options" (4), and "correct_answer".
- "speaking_repetition": a single sentence to repeat

Return a JSON array of 18 items. Each item must include a "type" field and follow one of the formats below:

{
  "type": "grammar_multiple_choice",
  "question": "Which sentence is correct?",
  "options": ["...", "...", "...", "..."],
  "correct_answer": "..."
}

{
  "type": "vocabulary_multiple_choice",
  "question": "What does 'joyful' mean?",
  "options": ["...", "...", "...", "..."],
  "correct_answer": "..."
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
  "text_prompt": "Anna called her friend to say she'll be 10 minutes late.",
  "question": "How late will Anna be?",
  "options": ["5 minutes", "10 minutes", "15 minutes", "20 minutes"],
  "correct_answer": "10 minutes"
}

{
  "type": "speaking_repetition",
  "prompt": "Repeat: 'I would like a cup of coffee, please.'"
}

Shuffle the order of questions. Randomize correct answer positions. Ensure valid JSON — no extra comments or text.
`;

    const gptResponse = await this.gptService.getGptResponse([
      {
        role: 'system',
        content: 'You create only valid JSON formatted language tests.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ]);

    const parsed: AssessmentJson = JSON.parse(gptResponse);
    console.log('Parsed GPT Response:', parsed);

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
