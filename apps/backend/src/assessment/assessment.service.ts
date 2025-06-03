import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssessmentService {
  constructor(private readonly prisma: PrismaService) {}

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
}
