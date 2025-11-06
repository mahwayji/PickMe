import { Module } from '@nestjs/common';
import { ItemBlocksController } from './item-blocks.controller';
import { ItemBlocksService } from './item-blocks.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [ItemBlocksController],
    providers: [ItemBlocksService, PrismaService],
    exports: [ItemBlocksService],
})

export class ItemBlocksModule {}