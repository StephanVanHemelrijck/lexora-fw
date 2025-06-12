// ai-scenario.controller.ts
import { Controller, Get, Post, Body, UseGuards, Param } from '@nestjs/common';
import { FirebaseAuthGuard } from '../guards/FirebaseAuthGuard';
import { AiScenarioService } from './ai-scenario-service';

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
}
