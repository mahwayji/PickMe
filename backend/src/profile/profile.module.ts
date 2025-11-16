import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MediaService } from 'src/media/media.service';

@Module({
  providers: [ProfileService, PrismaService, MediaService],
  controllers: [ProfileController],
  exports: [ProfileService]
})
export class ProfileModule {}
