import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { tagDto } from './dto/tag.dto';
@Injectable()
export class TagService {
    constructor(private readonly prisma: PrismaService) {}
    async createTag(tagDto: tagDto) {
        try {
                    const newTag = await this.prisma.tag.create({
                        data: tagDto,
                    })
                    return newTag
                } catch (error) {
                    throw new BadRequestException('Failed to create tag')
                }
    }
    async getAllTags() {
        return await this.prisma.tag.findMany();
    }
}
    