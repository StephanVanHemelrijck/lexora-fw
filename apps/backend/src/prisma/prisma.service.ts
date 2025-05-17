import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();
  }
  // This method runs when the module is initialized
  async onModuleInit() {
    await this.$connect(); // Connect to the database
  }

  // This method runs when the module is destroyed
  async onModuleDestroy() {
    await this.$disconnect(); // Disconnect from the database
  }
}
