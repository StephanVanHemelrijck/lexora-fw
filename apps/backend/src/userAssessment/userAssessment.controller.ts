import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserAssessmentService } from './userAssessment.service';
import { UserAssessment } from '@prisma/client';
import { SubmitAssessmentDto } from './dto/submit-assessment.dto';

@Controller('userAssessment')
export class UserAssessmentController {
  constructor(private readonly userAssessmentService: UserAssessmentService) {}

  /**
   * Get latest user assessment
   * @body uid
   */
  @Get('/latest/:uid')
  getLatestUserAssessment(@Param('uid') uid: string): Promise<UserAssessment> {
    return this.userAssessmentService.getLatestUserAssessment(uid);
  }

  @Post('/submit')
  submitAssessment(@Body() dto: SubmitAssessmentDto) {
    return this.userAssessmentService.submitAssessment(dto);
  }
}
