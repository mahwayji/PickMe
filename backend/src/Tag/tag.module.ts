import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { PrismaService } from "src/prisma/prisma.service";
import { AuthModule } from "src/auth/auth.module";

@Module({
  controllers: [TagController],
  providers: [TagService, PrismaService],
  imports: [AuthModule]
})
export class TagModule {}