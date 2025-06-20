import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FirebaseService } from '../firebase/firebase.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { OnboardingDto } from './dto/onboarding.dto';
import { FirebaseAdminError, SaveOnboardingResponse } from '@lexora/types';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly firebase: FirebaseService
  ) {}

  async registerUser(dto: RegisterUserDto) {
    return this.prisma.user.create({
      data: {
        uid: dto.uid,
        dailyMinutes: dto.dailyMinutes,
      },
    });
  }

  async handleOnboarding(dto: OnboardingDto) {
    let firebaseUid: string | null = null;

    try {
      // Step 1: Create user in Firebase
      const userRecord = await this.firebase.auth.createUser({
        email: dto.email,
        password: dto.password,
        displayName: dto.displayName,
      });

      firebaseUid = userRecord.uid;
      const token = await this.firebase.auth.createCustomToken(firebaseUid);

      // Step 2: Ensure selected language exists
      const languageExists = await this.prisma.language.findUnique({
        where: { id: dto.selectedLanguageId },
      });

      if (!languageExists) {
        throw new BadRequestException('Selected language does not exist');
      }

      // Step 3: Prepare data
      const userData = {
        uid: firebaseUid,
        nativeLanguageId: dto.nativeLanguageId ?? undefined,
        dailyMinutes: dto.routineMinutes,
      };

      const languageJourneyData = {
        uid: firebaseUid,
        languageId: dto.selectedLanguageId,
        learningReasons: dto.learningReasons,
        startingOption: dto.startingOption,
        placementLevel: dto.startingOption == 'scratch' ? 'A1 ' : null,
      };

      // Step 4: Save to DB
      await this.prisma.$transaction([
        this.prisma.user.create({ data: userData }),
        this.prisma.languageJourney.create({ data: languageJourneyData }),
      ]);

      const user = await this.prisma.user.findUnique({
        where: { uid: firebaseUid },
        include: {
          languageJourneys: {
            include: { language: true },
          },
        },
      });

      if (!user) {
        throw new InternalServerErrorException(
          'Failed to fetch user after onboarding.'
        );
      }

      return {
        message: 'Onboarding completed successfully.',
        user: {
          ...user,
          displayName: dto.displayName,
          email: dto.email,
          accessToken: token,
        },
      } satisfies SaveOnboardingResponse;
    } catch (error: unknown) {
      // Cleanup Firebase user if it was created
      if (firebaseUid) {
        try {
          await this.firebase.auth.deleteUser(firebaseUid);
        } catch (cleanupError) {
          console.error(
            'Failed to delete Firebase user during rollback:',
            cleanupError
          );
        }
      }

      // Firebase-specific error
      const firebaseCode = (error as FirebaseAdminError)?.errorInfo?.code;
      if (firebaseCode === 'auth/email-already-exists') {
        throw new BadRequestException('This email is already in use.');
      }

      if (error instanceof BadRequestException) {
        throw error;
      }

      console.error('Onboarding error:', error);
      throw new InternalServerErrorException(
        'Onboarding failed. Please try again.'
      );
    }
  }

  async getMe(uid: string) {
    const userRecord = await this.firebase.auth.getUser(uid);
    const dbUser = await this.prisma.user.findUnique({
      where: { uid },
      include: {
        languageJourneys: {
          include: { language: true },
        },
      },
    });

    if (!dbUser) {
      throw new BadRequestException('User not found');
    }

    return {
      uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      nativeLanguage: dbUser.nativeLanguage,
      dailyMinutes: dbUser.dailyMinutes,
      languageJourneys: dbUser.languageJourneys,
    };
  }
}
