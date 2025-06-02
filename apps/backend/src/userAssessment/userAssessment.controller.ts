import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserAssessmentService } from './userAssessment.service';
import { UserAssessment } from '@prisma/client';
import { SubmitAssessmentDto } from './dto/submit-assessment.dto';
import { FirebaseAuthGuard } from '../guards/FirebaseAuthGuard';
import { User } from '../decorators/user.decorator';
import type { FirebaseUser } from '../types/firebase-user';

@Controller('user-assessment')
export class UserAssessmentController {
  constructor(private readonly userAssessmentService: UserAssessmentService) {}

  @Get('/latest/:uid')
  getLatestUserAssessment(@Param('uid') uid: string): Promise<UserAssessment> {
    return this.userAssessmentService.getLatestUserAssessment(uid);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('/active-or-create/:languageId')
  async getOrCreateUserAssessment(
    @User() user: FirebaseUser,
    @Param('languageId') languageId: string
  ): Promise<UserAssessment> {
    return this.userAssessmentService.getOrCreateUserAssessment(
      user.uid,
      languageId
    );
  }

  @Post('/submit')
  submitAssessment(@Body() dto: SubmitAssessmentDto) {
    return this.userAssessmentService.submitAssessment(dto);
  }
}
