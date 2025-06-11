import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LanguageService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.language.findMany();
  }

  async findAllSupported() {
    console.log('[BACKEND] INSIDE findAllSupported');

    return this.prisma.language.findMany({ where: { isEnabled: true } });
  }

  async getById(id: string) {
    return this.prisma.language.findUnique({ where: { id } });
  }
}
