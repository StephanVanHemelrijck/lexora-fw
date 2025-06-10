import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { WhisperService } from './whisper.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('whisper')
export class WhisperController {
  constructor(private readonly whisperService: WhisperService) {}

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
}
