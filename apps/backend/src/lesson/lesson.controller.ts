import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { FirebaseAuthGuard } from '../guards/FirebaseAuthGuard';
import { User } from '../decorators/user.decorator';
import type { FirebaseUser } from '../types/firebase-user';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get('/:id')
  getLessonById(@Param('id') id: string) {
    return this.lessonService.getLessonById(id);
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('/upcoming/user')
  getUpcomingLesson(@User() user: FirebaseUser) {
    return this.lessonService.getUpcomingLessonForUser(user.uid);
  }
}
