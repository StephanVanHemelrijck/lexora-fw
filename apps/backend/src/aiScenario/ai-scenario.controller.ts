// ai-scenario.controller.ts
import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { FirebaseAuthGuard } from '../guards/FirebaseAuthGuard';
import { AiScenarioService } from './ai-scenario.service';
import { User } from '../decorators/user.decorator';
import type { FirebaseUser } from '../types/firebase-user';

@Controller('ai-scenario')
export class AiScenarioController {
  constructor(private readonly scenarioService: AiScenarioService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get(':id')
  getScenarioById(@Param('id') id: string) {
    try {
      return this.scenarioService.getById(id);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @UseGuards(FirebaseAuthGuard)
  @Get()
  getAllScenarios() {
    try {
      return this.scenarioService.getAllScenarios();
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('recommended')
  getRecommended(@Body('reasons') reasons: string[]) {
    try {
      return this.scenarioService.getRecommendedScenarios(reasons);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('practice')
  async handlePracticeMessage(
    @User() user: FirebaseUser,
    @Body()
    body: {
      scenarioId: string;
      messages: { role: 'user' | 'assistant'; content: string }[];
    }
  ) {
    return this.scenarioService.handlePracticeMessage(
      user.uid,
      body.scenarioId,
      body.messages
    );
  }
}
