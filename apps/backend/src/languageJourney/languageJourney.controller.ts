import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { LanguageJourneyService } from './languageJourney.service';
import { FirebaseAuthGuard } from '../guards/FirebaseAuthGuard';
import { User } from '../decorators/user.decorator';
import type { FirebaseUser } from '../types/firebase-user';

@Controller('language-journeys')
export class LanguageJourneyController {
  constructor(
    private readonly LanguageJourneyService: LanguageJourneyService
  ) {}

  @UseGuards(FirebaseAuthGuard)
  @Get()
  findAll(@User() user: FirebaseUser) {
    try {
      return this.LanguageJourneyService.findAll(user.uid);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('language/:id')
  findByLanguageId(@User() user: FirebaseUser, @Param('id') id: string) {
    try {
      return this.LanguageJourneyService.findForUserByLanguageId(user.uid, id);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
