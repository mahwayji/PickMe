import { Module } from '@nestjs/common'
import { ItemBlocksController } from './item-blocks.controller'
import { ItemBlocksService } from './item-blocks.service'
import { PrismaService } from 'src/prisma/prisma.service'
import { MediaModule } from 'src/media/media.module'

@Module({
  imports: [MediaModule],
  controllers: [ItemBlocksController],
  providers: [ItemBlocksService, PrismaService],
  exports: [ItemBlocksService],
})

export class ItemBlocksModule {}