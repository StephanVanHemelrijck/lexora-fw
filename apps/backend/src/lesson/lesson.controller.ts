import {
  Controller,
  Get,
  Param,
  UseGuards,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { LessonService } from './lesson.service';
import { FirebaseAuthGuard } from '../guards/FirebaseAuthGuard';
import { User } from '../decorators/user.decorator';
import type { FirebaseUser } from '../types/firebase-user';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get('/:id')
  async getLessonById(@Param('id') id: string) {
    try {
      const lesson = await this.lessonService.getLessonById(id);
      if (!lesson) throw new NotFoundException('Lesson not found');
      return lesson;
    } catch (err) {
      console.error('Failed to fetch lesson by ID:', err);
      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('/upcoming/user')
  async getUpcomingLesson(@User() user: FirebaseUser) {
    try {
      const lesson = await this.lessonService.getUpcomingLessonForUser(
        user.uid
      );
      if (!lesson) throw new NotFoundException('No upcoming lessons found');
      return lesson;
    } catch (err) {
      console.error('Failed to fetch upcoming lesson for user:', err);
      throw new InternalServerErrorException('Could not fetch upcoming lesson');
    }
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('/upcoming/journey/:id')
  async getUpcomingLessonForJourney(@Param('id') id: string) {
    try {
      const lesson = await this.lessonService.getUpcomingLessonForJourney(id);
      if (!lesson)
        throw new NotFoundException(
          'No upcoming lessons found for this journey'
        );
      return lesson;
    } catch (err) {
      console.error('Failed to fetch upcoming lesson for journey:', err);
      throw new InternalServerErrorException(
        'Could not fetch lesson for journey'
      );
    }
  }
}
