import { Controller } from '@nestjs/common';
import { TagService } from './tag.service';
import { Post, Body, UseGuards, Get } from '@nestjs/common';
import { tagDto } from './dto/tag.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('tag')
export class TagController {
    constructor(private readonly tagService: TagService) {}

    @Post('create')
    @UseGuards(AuthGuard('jwt'))
        async createTag(@Body() tagDto: tagDto) {
            return await this.tagService.createTag(tagDto);
        }
    @Get('')
        async getAllTags() {
            return await this.tagService.getAllTags();
        }
}