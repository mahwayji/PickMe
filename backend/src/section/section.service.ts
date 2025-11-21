import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { sectionDto } from './dto/section.dto'
import { MediaService } from 'src/media/media.service'

@Injectable()
export class SectionService {
    constructor(private readonly prisma: PrismaService,
                private readonly mediaService: MediaService
    ) {}

    async createSection(sectionDto: sectionDto, file: Express.Multer.File) {
        try {
            const newSection = await this.prisma.section.create({
                data: {
                    ownerId: sectionDto.ownerId,
                    title: sectionDto.title,
                    description: sectionDto.description,
                    ...(file && {
                        coverMediaId: (await this.mediaService.uploadImage(sectionDto.ownerId, file)).id
                    })
                },
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

    async getSectionByUsername(username: string)
    {
        const user = await this.prisma.user.findUnique({
            where: {username: username}
        })

        const Section = await this.prisma.section.findMany({
            where: {ownerId: user?.id}
        }) 

        if(Section.length === 0)
            return []
        
        return Section
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
            const section = await this.prisma.section.findUnique({where: {id:sectionId}})
            if(section?.coverMediaId) await this.mediaService.deleteImage(section.coverMediaId)
            
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

    async updateSection(sectionId: string, data: Partial<sectionDto>, file: Express.Multer.File) {
        try {
            const section = await this.prisma.section.findUnique({
                where: { id: sectionId },
            })

            if(!section)
                throw new NotFoundException("The section are not exist.")
            // update image
            if(file){
                const media = await this.mediaService.uploadImage(section.ownerId, file);

                // update mediaId
                await this.prisma.section.update({
                    where: {id: sectionId},
                    data: {
                        coverMediaId: media.id
                    }
                })
                // delete old image 
                if(section?.coverMediaId) await this.mediaService.deleteImage(section.coverMediaId)
            }


                
            return await this.getSectionByOwnerId(section.ownerId);
        }
        catch (error) {
            throw new NotFoundException('Section not found')
        }
    }
}