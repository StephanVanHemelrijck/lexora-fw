import {
  Controller,
  Get,
  Query,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { TtsService } from './tts.service';
import type { Response } from 'express';

@Controller('tts')
export class TtsController {
  constructor(private readonly ttsService: TtsService) {}

  @Get()
  async getTtsAudio(
    @Query('text') text: string,
    @Query('lang') lang: string,
    @Res() res: Response
  ) {
    if (!text) throw new BadRequestException('Text is required');

    const audioUrl = await this.ttsService.synthesizeSpeechToFile(
      text,
      lang || 'es-ES'
    );

    return res.json({ audioUrl });
  }
}
