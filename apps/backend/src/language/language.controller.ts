import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { LanguageService } from './language.service';
import { FirebaseAuthGuard } from '../guards/FirebaseAuthGuard';

@Controller('languages')
export class LanguageController {
  constructor(private readonly languagesService: LanguageService) {}

  @Get()
  async getLanguages() {
    return this.languagesService.findAll();
  }

  @Get('supported')
  async getSupportedLanguages() {
    console.log('[BACKEND] INSIDE getSupportedLanguages');

    return this.languagesService.findAllSupported();
  }

  @UseGuards(FirebaseAuthGuard)
  @Get(':id')
  async getSupportedLanguagesIds(@Param('id') id: string) {
    return this.languagesService.getById(id);
  }
}
