import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async registerUser(dto: RegisterUserDto) {
    const user = await this.prisma.user.create({
      data: {
        uid: dto.uid,
      },
    });
    return user;
  }
}
