import { Body, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ItemBlocksService } from './item-blocks.service'

@Controller('items/:itemId/blocks')
export class ItemBlocksController {
    constructor(private readonly svc: ItemBlocksService) {}

    @Get()
    list(@Param('itemId') itemId: string) {
      return this.svc.list(itemId)
    }

    @Post()
    async create(
      @Param('itemId') itemId: string,
      @Body() body: any,
    ) {
      return this.svc.create(itemId, body)
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadForItem(
      @Param('itemId') itemId: string,
      @UploadedFile() file: Express.Multer.File,
    ) {
      return this.svc.createFromUpload(itemId, file)
    }

    @Patch(':blockId')
    update(
      @Param('itemId') itemId: string,
      @Param('blockId') blockId: string,
      @Body() body: any,
    ) {
      return this.svc.update(itemId, blockId, body)
    }

    @Post('reorder')
    reorder(
      @Param('itemId') itemId: string,
      @Body('order') order: string[],
    ) {
      return this.svc.reorder(itemId, order)
    }

    @Delete(':blockId')
    remove(
      @Param('itemId') itemId: string,
      @Param('blockId') blockId: string,
    ) {
      return this.svc.remove(itemId, blockId)
    }
}