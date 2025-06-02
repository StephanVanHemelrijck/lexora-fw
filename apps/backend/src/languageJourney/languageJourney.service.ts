import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LanguageJourneyService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(uid: string) {
    return this.prisma.languageJourney.findMany({ where: { uid } });
  }

  async findForUserByLanguageId(uid: string, id: string) {
    return this.prisma.languageJourney.findFirst({
      where: { uid, languageId: id },
    });
  }
}
