import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findByUid(uid: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { uid } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
