import { Module } from '@nestjs/common';
import { AiScenarioController } from './ai-scenario.controller';
import { AiScenarioService } from './ai-scenario-service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AiScenarioController],
  providers: [AiScenarioService],
  exports: [AiScenarioService],
})
export class AiScenarioModule {}
