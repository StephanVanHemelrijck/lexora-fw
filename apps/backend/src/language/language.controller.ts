import { Controller, Get } from '@nestjs/common';
import { LanguageService } from './language.service';

@Controller('languages')
export class LanguageController {
  constructor(private readonly languagesService: LanguageService) {}

  @Get()
  async getLanguages() {
    return this.languagesService.findAll();
  }

  @Get('supported')
  async getSupportedLanguages() {
    return this.languagesService.findAllSupported();
  }
}
