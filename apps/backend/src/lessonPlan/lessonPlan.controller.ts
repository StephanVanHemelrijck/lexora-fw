import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { LessonPlanService } from './lessonPlan.service';
import { FirebaseAuthGuard } from '../guards/FirebaseAuthGuard';
import { User } from '../decorators/user.decorator';
import type { FirebaseUser } from '../types/firebase-user';

@Controller('lesson-plan')
export class LessonPlanController {
  constructor(private readonly lessonPlanService: LessonPlanService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post('/generate/:languageJourneyId')
  async generateLessonPlan(
    @User() user: FirebaseUser,
    @Param('languageJourneyId') languageJourneyId: string
  ) {
    return this.lessonPlanService.generateLessonPlan(
      languageJourneyId,
      user.uid
    );
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('/:lessonPlanId/get-progress')
  async getLessonProgressForPlan(
    @User() user: FirebaseUser,
    @Param('lessonPlanId') lessonPlanId: string
  ) {
    return this.lessonPlanService.getLessonProgressForPlan(
      lessonPlanId,
      user.uid
    );
  }
}
