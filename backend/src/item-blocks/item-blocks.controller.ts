import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ItemBlocksService } from './item-blocks.service';

@Controller('items/:itemId/blocks')
export class ItemBlocksController {
    constructor(private readonly svc: ItemBlocksService) {}

    @Get()
    list(@Param('itemId') itemId: string) {
        return this.svc.list(itemId);
    }

    @Post()
    async create(@Param('itemId') itemId: string,
    @Body() body: any,
    ) {
    try {
        return await this.svc.create(itemId, body);
    } catch (e: any) {
        console.error('[ItemBlocks:create] error', e?.message, e?.stack);
        throw e;
    }
    }

    @Patch(':blockId')
    update(@Param('itemId') itemId: string,
    @Param('blockId') blockId: string,
    @Body() body: any,
    ) {
        return this.svc.update(itemId, blockId, body);
    }

    @Post('reorder')
    reorder(@Param('itemId') itemId: string, @Body('order') order: string[] ) {
        return this.svc.reorder(itemId, order);
    }

    @Delete(':blockId')
    remove(@Param('itemId') itemId: string,
    @Param('blockId') blockId: string,) {
        return this.svc.remove(itemId, blockId);
    }
}