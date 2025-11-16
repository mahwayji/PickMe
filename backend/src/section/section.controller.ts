import { SectionService } from "./section.service";
import { Controller, Get, Post, Delete, Patch, Body, UseGuards, Param } from "@nestjs/common";
import { sectionDto } from "./dto/section.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller('section')
export class SectionController {
    constructor(private readonly sectionService: SectionService) {}

    @Get('user/:id')
    async getSectionByUserId(@Param('id') ownerId: string) {
        return await this.sectionService.getSectionByOwnerId(ownerId);
    }

    @Get(':sectionId')
    async getSectionById(@Param('sectionId') sectionId: string) {
        return await this.sectionService.getSectionById(sectionId);
    }

    @Patch('update/:sectionId')
    @UseGuards(AuthGuard('jwt'))
    async updateSection(@Param('sectionId') sectionId: string, @Body() data: Partial<sectionDto>) {
        return await this.sectionService.updateSection(sectionId, data);
    }

    @Delete('delete/:sectionId')
    @UseGuards(AuthGuard('jwt'))
    async deleteSection(@Param('sectionId') sectionId: string) {
        return await this.sectionService.deleteSection(sectionId);
    }

    @Post('create')
    @UseGuards(AuthGuard('jwt'))
    async createSection(@Body() sectionDto: sectionDto) {
        return await this.sectionService.createSection(sectionDto);
    }
}