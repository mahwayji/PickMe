import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ItemsService } from './items.service';

@Controller()
export class ItemsController {
  constructor(private readonly items: ItemsService) {}

  // GET /api/v2/sections/:sectionId/items
  @Get('sections/:sectionId/items')
  async listBySection(@Param('sectionId') sectionId: string) {
    return this.items.listBySection(sectionId);
  }

  // GET /api/v2/items/:id
  @Get('items/:id')
  async getOne(@Param('id') id: string) {
    return this.items.getOne(id);
  }

  // POST /api/v2/sections/:sectionId/items
  @Post('sections/:sectionId/items')
  async create(
    @Param('sectionId') sectionId: string,
    @Body() body: any,
  ) {
    return this.items.create(sectionId, body);
  }

  // PATCH /api/v2/items/:id
  @Patch('items/:id')
  async update(@Param('id') id: string, @Body() body: any) {
    return this.items.update(id, body);
  }

  // DELETE /api/v2/items/:id
  @Delete('items/:id')
  async remove(@Param('id') id: string) {
    await this.items.remove(id);
    return { ok: true };
  }
}
