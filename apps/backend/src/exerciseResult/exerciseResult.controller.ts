import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ExerciseResultService } from './exerciseResult.service';
import type { SaveExerciseResultDto } from './dto/SaveExerciseResultDto';
import { FirebaseAuthGuard } from '../guards/FirebaseAuthGuard';
import { User } from '../decorators/user.decorator';

@Controller('exercise-result')
export class ExerciseResultController {
  constructor(private readonly exerciseResultService: ExerciseResultService) {}

  @UseGuards(FirebaseAuthGuard)
  @Post('/save')
  saveOrUpdate(@User('uid') uid: string, @Body() dto: SaveExerciseResultDto) {
    return this.exerciseResultService.saveOrUpdate(dto, uid);
  }
}
