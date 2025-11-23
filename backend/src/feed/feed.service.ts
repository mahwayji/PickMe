import { Injectable, NotFoundException } from '@nestjs/common';
import { iif } from 'rxjs';
import { ItemsService } from 'src/items/items.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FeedService {
    constructor(
        private readonly prisma: PrismaService, 
        private readonly itemService: ItemsService
    ){}

    async getFeed() {
        const items = await this.prisma.item.findMany({
        orderBy: { updatedAt: 'desc' },
        select: { id: true },
        take: 20,
        });

        const results = await Promise.all(
            items.map(item => this.itemService.getOne(item.id))
        );

        return results;
    }

    async getFeedByTag(tag: string){
        const tagData = await this.prisma.tag.findUnique({
            where: {name: tag},
            select: {id: true}
        })

        if(!tagData)
            throw new NotFoundException("Tag not found!")
        
        const items = await this.prisma.itemTag.findMany({
        where: {tagId:tagData.id},
        select: { itemId: true },
        take: 20
        });

        // normalize to { id: ... }

        const results = await Promise.all(
        items.map(item => this.itemService.getOne(item.itemId))
    );

    return results;
    }
}

