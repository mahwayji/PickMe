import { SectionService } from "./section.service";
import { Controller, Get, Post, Delete, Patch, Body, UseGuards, Param, UseInterceptors, UploadedFile } from "@nestjs/common";
import { sectionDto } from "./dto/section.dto";
import { AuthGuard } from "@nestjs/passport";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('section')
export class SectionController {
    constructor(private readonly sectionService: SectionService) {}

    @Get('user/:id')
    async getSectionByUserId(@Param('id') ownerId: string) {
        return await this.sectionService.getSectionByOwnerId(ownerId);
    }

    @Get('username/:username')
    async getSectionByUsername(@Param('username') username: string) {
        return await this.sectionService.getSectionByUsername(username);
    }


    @Get(':sectionId')
    async getSectionById(@Param('sectionId') sectionId: string) {
        return await this.sectionService.getSectionById(sectionId);
    }

    @Patch('update/:sectionId')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('coverImage'))
    async updateSection(
        @Param('sectionId') sectionId: string,
        @Body() data: Partial<sectionDto>,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return await this.sectionService.updateSection(sectionId, data, file);
    }

    @Delete('delete/:sectionId')
    @UseGuards(AuthGuard('jwt'))
    async deleteSection(@Param('sectionId') sectionId: string) {
        return await this.sectionService.deleteSection(sectionId);
    }

    @Post('create')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(FileInterceptor('coverImage'))
    async createSection(
        @Body() sectionDto: sectionDto,
        @UploadedFile() file: Express.Multer.File,
    ) {
        return await this.sectionService.createSection(sectionDto, file);
    }
}