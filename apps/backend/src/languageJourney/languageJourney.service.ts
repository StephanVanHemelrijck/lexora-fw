import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LanguageJourneyService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(uid: string) {
    return this.prisma.languageJourney.findMany({ where: { uid } });
  }

  async findForUserByLanguageId(uid: string, id: string) {
    return await this.prisma.languageJourney.findFirst({
      where: { uid, languageId: id },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updatePlacementLevel(uid: string, languageId: string, level: string) {
    const existing = await this.findForUserByLanguageId(uid, languageId);

    console.log(existing);

    if (!existing) return new NotFoundException('Language Journey not found');

    return await this.prisma.languageJourney.update({
      where: { id: existing.id },
      data: { placementLevel: level, lastActivity: new Date() },
    });
  }
}
