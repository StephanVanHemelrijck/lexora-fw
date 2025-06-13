// ai-scenario.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GptService } from '../gpt/gpt.service';
import { Language } from '@lexora/types';

@Injectable()
export class AiScenarioService {
  constructor(
    private prisma: PrismaService,
    private readonly gptService: GptService
  ) {}

  async handlePracticeMessage(
    userId: string,
    scenarioId: string,
    messages: { role: 'user' | 'assistant'; content: string }[],
    language: Language
  ) {
    const scenario = await this.prisma.aiScenario.findUnique({
      where: { id: scenarioId },
    });

    if (!scenario) {
      throw new Error('Scenario not found');
    }

    const gptMessages = [
      {
        role: 'system',
        content: `You are roleplaying a native speaker for a language learner. The scenario is: "${scenario.prompt}". Speak naturally, be helpful, ask follow-up questions, and gently correct grammar if needed. You must respond in ${language.name}.`,
      },
      ...messages,
    ];

    const reply = await this.gptService.getGptResponse(gptMessages);

    console.log('[BACKEND] GPT response: ', reply);

    return {
      role: 'assistant',
      content: reply,
    };
  }

  async getById(id: string) {
    return this.prisma.aiScenario.findUnique({ where: { id } });
  }

  async getAllScenarios() {
    return this.prisma.aiScenario.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getRecommendedScenarios(learningReasons: string[]) {
    if (!learningReasons || learningReasons.length === 0) {
      // Fallback: return empty array or all scenarios
      return [];
    }

    return this.prisma.aiScenario.findMany({
      where: {
        categories: {
          hasSome: learningReasons, // ✅ only if array is valid
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
