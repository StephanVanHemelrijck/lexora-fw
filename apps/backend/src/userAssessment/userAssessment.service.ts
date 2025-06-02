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

@Injectable()
export class UserAssessmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly assessmentService: AssessmentService,
    private readonly gptService: GptService
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
          where: { userId: uid, assessment: { languageId: languageId } },
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
      throw new InternalServerErrorException(e);
    }
  }

  /**
   * Get latest user assessment
   * @param uid - user id
   * @returns  user assessment
   */
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
    // 1. Validate user and assessment
    const user = await this.userService.findByUid(dto.uid);
    const assessment = await this.assessmentService.getAssessmentById(
      dto.assessmentId
    );
    const originalQuestions = assessment.questions as unknown as QuestionItem[];

    // 2. Sort and map user answers by original index
    const answerMap = new Map<number, Answer>();
    for (const ans of dto.answers) {
      answerMap.set(ans.originalIndex, ans.answer);
    }

    // 3. Annotate questions with user answers
    const annotatedQuestions = originalQuestions.map((question, index) => ({
      ...question,
      index,
      userAnswer: answerMap.get(index) ?? null,
    }));

    // 4. Prepare GPT grading prompt
    const prompt = `
You are an expert language evaluator.

You will receive a list of assessment questions and the answers provided by a user. Each item includes:
- type: question type
- data: original question
- userAnswer: what the user answered

For each, indicate if the answer is correct.
At the end, assign a CEFR level (A1–C2) and include brief feedback.

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

    // 5. Send to GPT and parse result
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
      throw new Error('Grading failed. Please try again.');
    }

    console.log(result);

    // 6. (Optional) Persist result to database, mark assessment as completed, etc.
    // await this.prisma.userAssessment.update({
    //   where: { id: dto.assessmentId },
    //   data: {
    //     status: 'COMPLETED',
    //     completedAt: new Date(),
    //     score: result.graded.filter((q) => q.correct).length,
    //     level: result.level,
    //   },
    // });

    // 7. Return result (for summary screen)
    // return {
    //   summary: annotatedQuestions.map((q, i) => ({
    //     index: i,
    //     type: q.type,
    //     question: q.data,
    //     userAnswer: q.userAnswer,
    //     correct: result.graded.find((g) => g.index === i)?.correct ?? false,
    //   })),
    //   level: result.level,
    //   feedback: result.feedback,
    // };
  }

  /**
   * Helper method to generate a fresh assessment and assign it to user
   * @param userId ID of the user
   * @param targetLanguage Target language for the assessment
   * @param nativeLanguage (optional) Default to 'English'
   */
  private async generateNewAssessmentForUser(
    userId: string,
    targetLanguage: Language,
    nativeLanguage: string
  ): Promise<UserAssessment> {
    const prompt = `
  You are a test generator.
  
  Create a ${targetLanguage.name} language test (A2–C2 level). Learner's native language: ${nativeLanguage}.
  
  Requirements:
  - Total: 15 to 20 questions
  - Structure:
    - 5 vocabulary_multiple_choice
    - 5 grammar_multiple_choice
    - 3 fill_in_the_blank
    - 1 reading_comprehension
    - 1 writing_prompt
  - Do not exceed 1 reading_comprehension and 1 writing_prompt
  - Questions in ${nativeLanguage}, answers in ${targetLanguage}
  - Keep content short and clear
  
  Return only a JSON array, no text, no comments. Each item must follow:
  
  { "type": "question_type", "data": { ... } }
  
  Allowed types:
  - vocabulary_multiple_choice: { "question": "...", "options": ["A", "B", "C", "D"], "correct_answer": "A" }
  - grammar_multiple_choice: same as above
  - fill_in_the_blank: { "sentence": "... ____ ...", "correct_answers": ["..."], "hint": "...", "expected_translation": "..." }
  - reading_comprehension: { "paragraph": "...", "questions": [ { "question": "...", "options": ["A", "B", "C", "D"], "correct_answer": "A" } ] }
  - writing_prompt: { "prompt": "...", "expected_length": "..." }
  
  Output only valid JSON array of 15–20 items.
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

    let cleanedGptResponse: AssessmentJson;

    try {
      cleanedGptResponse = JSON.parse(
        this.gptService.cleanGptJsonResponse(gptResponse)
      ) as AssessmentJson;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Failed to parse assessment JSON');
    }

    const assessment = await this.prisma.assessment.create({
      data: {
        languageId: targetLanguage.id,
        questions: cleanedGptResponse,
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
