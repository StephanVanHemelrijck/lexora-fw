import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLanguageJourneyDto } from './dto/CreateLanguageJourney.dto';
import { LanguageJourney } from '@prisma/client';

@Injectable()
export class LanguageJourneyService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(uid: string) {
    return this.prisma.languageJourney.findMany({
      where: { uid },
      include: { language: true },
    });
  }

  async findForUserByLanguageId(uid: string, id: string) {
    return await this.prisma.languageJourney.findFirst({
      where: { uid, languageId: id },
      include: { language: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createLanguageJourney(
    dto: CreateLanguageJourneyDto
  ): Promise<LanguageJourney> {
    const { uid, languageId } = dto;

    const exists = await this.prisma.languageJourney.findFirst({
      where: { uid, languageId },
    });

    if (exists) {
      throw new BadRequestException(
        'Language journey already exists for this language'
      );
    }

    return this.prisma.languageJourney.create({
      data: {
        uid,
        languageId,
        learningReasons: dto.learningReasons,
        startingOption: dto.startingOption,
        lastActivity: new Date(),
        placementLevel: dto.startingOption === 'scratch' ? 'A1' : null,
      },
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
