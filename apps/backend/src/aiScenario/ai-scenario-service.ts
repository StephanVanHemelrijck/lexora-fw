// ai-scenario.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AiScenarioService {
  constructor(private prisma: PrismaService) {}

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
