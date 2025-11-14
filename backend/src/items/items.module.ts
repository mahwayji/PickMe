import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { PrismaService } from '../prisma/prisma.service';
import { MediaService } from 'src/media/media.service';

@Module({
  controllers: [ItemsController],
  providers: [ItemsService, PrismaService, MediaService],
  exports: [ItemsService],
})
export class ItemsModule {}
