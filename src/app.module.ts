import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [PrismaService],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
