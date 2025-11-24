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

  /*@Delete('sections/:sectionId/items/delete')
  async deleteAllItemBySectionId(@Param('sectionId') sectionId: string){
    return this.itemsService.deleteAllItemBySectionId(sectionId)
  }*/

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
    let tags: string[] | undefined = undefined

    if (Array.isArray(body?.tags)) {
      tags = body.tags
    } else if (typeof body?.tags === 'string') {
      const raw = body.tags.trim()

      if (raw.startsWith('[') || raw.startsWith('"')) {
        try {
          const parsed = JSON.parse(raw)
          if (Array.isArray(parsed)) {
            tags = parsed
          } else if (typeof parsed === 'string') {
            tags = [parsed]
          }
        } catch {
          tags = [raw]
        }
      } else {
        tags = [raw]
      }
    }

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
