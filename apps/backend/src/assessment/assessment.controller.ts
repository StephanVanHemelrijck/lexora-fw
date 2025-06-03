import { Controller, Get, Param } from '@nestjs/common';
import { AssessmentService } from './assessment.service';

@Controller('assessment')
export class AssessmentController {
  constructor(private readonly assessmentService: AssessmentService) {}

  @Get('')
  async getAllAssessments() {
    const assessments = await this.assessmentService.getAllAssessments();
    return { assessments };
  }

  @Get(':id')
  async getAssessmentById(@Param('id') id: string) {
    const assessment = await this.assessmentService.getAssessmentById(id);
    return { assessment };
  }
}
