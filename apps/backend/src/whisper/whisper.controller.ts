import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { WhisperService } from './whisper.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FirebaseAuthGuard } from '../guards/FirebaseAuthGuard';

@Controller('whisper')
export class WhisperController {
  constructor(private readonly whisperService: WhisperService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post('transcribe')
  @UseInterceptors(FileInterceptor('file'))
  async transcribeAudio(
    @UploadedFile() file: Express.Multer.File,
    @Body('expected') expected: string
  ) {
    if (!file) throw new BadRequestException('Audio file is required.');
    if (!expected) throw new BadRequestException('Expected text is required.');

    const transcription = await this.whisperService.transcribeAudio(file);
    const isCorrect = this.whisperService.compareTranscription(
      transcription,
      expected
    );

    return {
      transcription,
      isCorrect,
    };
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('transcribe-only')
  @UseInterceptors(FileInterceptor('file'))
  async transcribeOnly(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Audio file is required.');

    const transcription = await this.whisperService.transcribeAudio(file);

    return { transcription };
  }
}
