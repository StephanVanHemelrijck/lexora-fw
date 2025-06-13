import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './auth.service';
import { OnboardingDto } from './dto/onboarding.dto';
import { FirebaseAuthGuard } from '../guards/FirebaseAuthGuard';
import { User } from '../decorators/user.decorator';
import type { FirebaseUser } from '../types/firebase-user';
import { getAuth } from 'firebase-admin/auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async registerUser(
    @Body() registerUserDto: RegisterUserDto
  ): Promise<RegisterUserDto> {
    const user = await this.authService.registerUser(registerUserDto);
    return user;
  }

  @Post('onboarding')
  async onboarding(@Body() dto: OnboardingDto) {
    const onboarding = await this.authService.handleOnboarding(dto);
    return onboarding;
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  async getMe(@User() user: FirebaseUser) {
    const res = await this.authService.getMe(user.uid);
    return res;
  }
}
