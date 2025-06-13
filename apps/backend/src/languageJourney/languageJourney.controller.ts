import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LanguageJourneyService } from './languageJourney.service';
import { FirebaseAuthGuard } from '../guards/FirebaseAuthGuard';
import { User } from '../decorators/user.decorator';
import type { FirebaseUser } from '../types/firebase-user';
import type { CreateLanguageJourneyDto } from './dto/CreateLanguageJourney.dto';

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

  @UseGuards(FirebaseAuthGuard)
  @Post('/create')
  async create(
    @User() user: FirebaseUser,
    @Body() body: Omit<CreateLanguageJourneyDto, 'uid'>
  ) {
    try {
      if (!user.uid) {
        throw new BadRequestException('Missing UID');
      }

      const dto: CreateLanguageJourneyDto = {
        ...body,
        uid: user.uid,
      };

      return await this.LanguageJourneyService.createLanguageJourney(dto);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
