import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LanguageService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.language.findMany();
  }

  async findAllSupported() {
    return this.prisma.language.findMany({ where: { isEnabled: true } });
  }
}
