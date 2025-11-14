import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { sectionDto } from './dto/section.dto'

@Injectable()
export class SectionService {
    constructor(private readonly prisma: PrismaService) {}

    async createSection(sectionDto: sectionDto) {
        try {
            const newSection = await this.prisma.section.create({
                data: sectionDto,
            })
            return newSection
        } catch (error) {
            throw new BadRequestException('Failed to create section')
        }
    }

    async getSectionByOwnerId(ownerId: string) {
        try {
            const Section = await this.prisma.section.findMany({
                where: { ownerId: ownerId },
            })
            return Section
        } catch (error) {
            throw new BadRequestException('Failed to get section')
        }
    }

    async getSectionById(sectionId: string) {
        try {
            const section = await this.prisma.section.findUnique({
                where: { id: sectionId },
            })
            return section
        } catch (error) {
            throw new NotFoundException('Section not found')
        }
    }

    async deleteSection(sectionId: string) {
        try {
            await this.prisma.section.delete({
                where: { id: sectionId },
            })

            await this.prisma.item.deleteMany({
                where: { sectionId: sectionId },
            })

            return { message: 'Section/Item deleted successfully' }
        } catch (error) {
            throw new NotFoundException('Section not found')
        }
    }

    async updateSection(sectionId: string, data: Partial<sectionDto>) {
        try {
            await this.prisma.section.update({
                where: { id: sectionId },
                data: data,
            })
            return { message: 'Section updated successfully' }
        }
        catch (error) {
            throw new NotFoundException('Section not found')
        }
    }
}