import { Module } from '@nestjs/common';
import { AiScenarioController } from './ai-scenario.controller';
import { AiScenarioService } from './ai-scenario.service';
import { PrismaModule } from '../prisma/prisma.module';
import { GptModule } from '../gpt/gpt.module';

@Module({
  imports: [PrismaModule, GptModule],
  controllers: [AiScenarioController],
  providers: [AiScenarioService],
  exports: [AiScenarioService],
})
export class AiScenarioModule {}
