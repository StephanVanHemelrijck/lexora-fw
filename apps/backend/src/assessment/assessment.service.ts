import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GptService } from '../gpt/gpt.service';
import { AssessmentJson } from './interfaces/assessmentJson.interface';

@Injectable()
export class AssessmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly gptService: GptService
  ) {}

  /**
   * Get all assessments
   */
  async getAllAssessments() {
    const assessments = await this.prisma.assessment.findMany();
    return assessments;
  }

  /**
   * Get assessment by ID
   * @param id ID of the assessment
   */
  async getAssessmentById(id: string) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id },
    });

    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    return assessment;
  }

  /**
   * Main method to create or reuse an assessment intelligently
   * @param userId ID of the user
   * @param language Target language for the assessment
   */
  async createOrReuseAssessment(userId: string, language: string) {
    // 1. Check if user already has an assessment
    const existingUserAssessment = await this.prisma.userAssessment.findFirst({
      where: { userId, assessment: { language } },
      orderBy: { createdAt: 'desc' },
      include: { assessment: true },
    });

    if (existingUserAssessment) {
      // If user has assessment, generate a new one (to prevent retaking same test)
      return this.generateNewAssessmentForUser(userId, language, 'English');
    }

    // 2. No UserAssessment yet -> Try finding an existing Assessment
    const existingAssessment = await this.prisma.assessment.findFirst({
      where: { language },
      orderBy: { createdAt: 'desc' },
    });

    if (existingAssessment) {
      // Reuse existing generated assessment
      await this.prisma.userAssessment.create({
        data: {
          userId,
          assessmentId: existingAssessment.id,
          status: 'PENDING',
        },
      });

      return existingAssessment;
    }

    // 3. No assessments exist at all -> Generate a new one
    return this.generateNewAssessmentForUser(userId, language, 'English');
  }

  /**
   * Helper method to generate a fresh assessment and assign it to user
   * @param userId ID of the user
   * @param targetLanguage Target language for the assessment
   * @param nativeLanguage (optional) Default to 'English'
   */
  private async generateNewAssessmentForUser(
    userId: string,
    targetLanguage: string,
    nativeLanguage: string
  ) {
    const prompt = `
You are a test generator.

Create a ${targetLanguage} language test (A2–B1 level). Learner's native language: ${nativeLanguage}.

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
        language: targetLanguage,
        questions: cleanedGptResponse,
      },
    });

    await this.prisma.userAssessment.create({
      data: {
        userId,
        assessmentId: assessment.id,
        status: 'PENDING',
      },
    });

    return assessment;
  }
}
