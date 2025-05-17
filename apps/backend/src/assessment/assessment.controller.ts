import { Controller, Get, Param } from '@nestjs/common';
import { AssessmentService } from './assessment.service';
import { UserService } from '../user/user.service';

@Controller('assessment')
export class AssessmentController {
  constructor(
    private readonly assessmentService: AssessmentService,
    private readonly userService: UserService
  ) {}

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

  @Get('language/:language')
  async getAssessment(@Param('language') language: string) {
    const uid = 'aPS3tK1wWnS4352U65InNxn5zbi2';
    language = language.charAt(0).toUpperCase() + language.slice(1);

    // Check if user exists
    const user = await this.userService.findByUid(uid);

    const assessment = await this.assessmentService.createOrReuseAssessment(
      user.uid,
      language
    );
    return { assessment };
  }
}
