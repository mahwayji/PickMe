import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MediaController],
  providers: [MediaService, PrismaService],
  exports: [MediaService]
})
export class MediaModule {}
