import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { LessonResultService } from './lessonResult.service';
import { FirebaseAuthGuard } from '../guards/FirebaseAuthGuard';
import { User } from '../decorators/user.decorator';

@Controller('lesson-result')
export class LessonResultController {
  constructor(private readonly lessonResultService: LessonResultService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post('ensure-created')
  ensureCreated(@User('uid') uid: string, @Body() dto: { lessonId: string }) {
    return this.lessonResultService.ensureCreated(uid, dto.lessonId);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('mark-as-complete')
  markAsComplete(@User('uid') uid: string, @Body() dto: { lessonId: string }) {
    return this.lessonResultService.markAsComplete(uid, dto.lessonId);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('get-by-lesson-id/:id')
  getByLessonId(@User('uid') uid: string, @Param('id') lessonId: string) {
    return this.lessonResultService.getLessonResultByLessonId(uid, lessonId);
  }
}
