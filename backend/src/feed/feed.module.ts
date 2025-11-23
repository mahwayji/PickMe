import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ItemsService } from 'src/items/items.service';
import { MediaService } from 'src/media/media.service';

@Module({
  controllers: [FeedController],
  providers: [FeedService, PrismaService, ItemsService, MediaService],
  exports: [FeedService]
})
export class FeedModule {}
