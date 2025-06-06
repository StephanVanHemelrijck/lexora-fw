import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserAssessmentService } from './userAssessment.service';
import { UserAssessment } from '@prisma/client';
import type { SubmitAssessmentDto } from './dto/submit-assessment.dto';
import { FirebaseAuthGuard } from '../guards/FirebaseAuthGuard';
import { User } from '../decorators/user.decorator';
import type { FirebaseUser } from '../types/firebase-user';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

@Controller('user-assessment')
export class UserAssessmentController {
  constructor(private readonly userAssessmentService: UserAssessmentService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get('/active-or-create/:languageId')
  async getOrCreateUserAssessment(
    @User() user: FirebaseUser,
    @Param('languageId') languageId: string
  ): Promise<UserAssessment> {
    console.log('[BACKEND] INSIDE getOrCreateUserAssessment');

    return this.userAssessmentService.getOrCreateUserAssessment(
      user.uid,
      languageId
    );
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('/submit')
  @UseInterceptors(AnyFilesInterceptor())
  submitAssessment(
    @User() user: FirebaseUser,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: any // can't use DTO directly when parsing multipart
  ) {
    console.log('[BACKEND] INSIDE submitAssessment');

    return this.userAssessmentService.submit(user.uid, body, files);
  }
}
