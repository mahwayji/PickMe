import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { ItemsService } from './items.service'

@Controller()
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}


  @Get('sections/:sectionId/items')
  listBySection(@Param('sectionId') sectionId: string) {
    return this.itemsService.listBySection(sectionId)
  }

  @Get('items/:id')
  getOne(@Param('id') id: string) {
    return this.itemsService.getOne(id)
  }

  @Post('sections/:sectionId/items')
  @UseInterceptors(FileInterceptor('thumbnail'))
  create(
    @Param('sectionId') sectionId: string,
    @UploadedFile() thumbnail?: Express.Multer.File,
    @Body() body?: any,
  ) {

    const tags =
      typeof body?.tags === 'string'
        ? JSON.parse(body.tags)
        : body?.tags

    const normalizedBody = {
      ...body,
      tags,
    }

    return this.itemsService.create(sectionId, normalizedBody, thumbnail)
  }

  @Delete('items/:id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id)
  }

  @Patch('items/:id')
  @UseInterceptors(FileInterceptor('thumbnail'))
  updateItem(
    @Param('id') id: string,
    @Body() body: any,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.itemsService.update(id, body, file);
  }
}
