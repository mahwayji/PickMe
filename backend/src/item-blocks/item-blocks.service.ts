import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { MediaType } from '@prisma/client'

@Injectable()
export class ItemBlocksService {
    constructor(private readonly prisma: PrismaService) {}

    private toIso(d?: Date | string | number | null) {
        const dd = d == null ? new Date() : new Date(d as any);
        return isNaN(dd.getTime()) ? new Date().toISOString() : dd.toISOString();
    }

    private guessMediaType(url: string): MediaType {
        const u = (url || '').toLowerCase();
        if (/\.(png|jpg|jpeg|webp|gif)$/.test(u)) return 'image';
        if (/\.(mp4|webm|mov)$/.test(u)) return 'video';
        if (/\.(pdf)$/.test(u)) return 'pdf';
        return 'other';
    }

    private async ensureMediaByUrl(url?: string) {
        if(!url) return null;
        const found = await this.prisma.media.findUnique({ where: {url}});
        if(found) return found;
        return this.prisma.media.create({
            data: {
                url,
                fileName: url.split('/').pop() || url,
                type: this.guessMediaType(url),
                uploadedAt: new Date(),
            }
        });
    }

    async list(itemId: string) {
        const item = await this.prisma.item.findUnique({
            where: {id: itemId},
            select: {id: true},
        });
        if(!item) throw new NotFoundException('Item not founded');

        const blocks = await this.prisma.itemBlock.findMany({
            where: { itemId },
            include: { media: true },
            orderBy: { orderIndex: 'asc'},
        });

        return blocks.map(b => {
            const c = (b.content ?? {}) as Record<string, any>;
            if (b.type === 'text') {
                return {
                    id: b.id,
                    type: 'text',
                    text: c.text,
                    style: c.style,
                    orderIndex: b.orderIndex ?? 0,
                    createdAt: this.toIso(b.createdAt),
                    updatedAt: this.toIso(b.updatedAt),
                };
            }
            if (b.type === 'image') {
                const url = b.media?.url ?? c.url;
                return {
                    id: b.id,
                    type: 'image',
                    url,
                    alt: c.alt,
                    caption: c.caption,
                    aspectRatio: c.aspectRatio,
                    orderIndex: b.orderIndex ?? 0,
                    createdAt: this.toIso(b.createdAt),
                    updatedAt: this.toIso(b.updatedAt),
                };
            }
            if (b.type === 'video') {
                const url = b.media?.url ?? c.url;
                return {
                    id: b.id,
                    type: 'video',
                    url,
                    provider: c.provider ?? 'upload',
                    caption: c.caption,
                    controls: c.controls,
                    muted: c.muted,
                    startAt: c.startAt,
                    endAt: c.endAt,
                    aspectRatio: c.aspectRatio,
                    orderIndex: b.orderIndex ?? 0,
                    createdAt: this.toIso(b.createdAt),
                    updatedAt: this.toIso(b.updatedAt),
                };
            }

            return null;
        }).filter(Boolean);
    }

    async create(itemId: string, body: any) {
        const item = await this.prisma.item.findUnique({
            where: { id: itemId },
            select: { id: true },
        });
        if (!item) throw new NotFoundException('Item not found');

        const {type} = body ?? {};
        if(!type || !['text', 'image', 'video'].includes(type)) {
            throw new BadRequestException('Unsupported block type');
        }

        const maxOrder = await this.prisma.itemBlock.aggregate({
            where: {itemId},
            _max: {orderIndex: true},
        });
        const nextOrder = (maxOrder._max.orderIndex ?? -1) + 1;
        const orderIndex = Number.isInteger(body?.orderIndex) ? body.orderIndex : nextOrder;
        
        if(type === 'text'){
            const text = String(body?.text ?? '');
            return this.prisma.itemBlock.create({
                data: {
                    itemId,
                    type: 'text',
                    content: { text, style: body?.style},
                    orderIndex,
                },
            });
        }
        if(type === 'image') {
            const url = String(body?.url ?? '');
            if(!url) throw new BadRequestException('images url is required');

            const media = await this.ensureMediaByUrl(url);
            return this.prisma.itemBlock.create({
                data: {
                    itemId,
                    type: 'image',
                    mediaId: media?.id ?? undefined,
                    content: {
                        alt: body?.alt,
                        caption: body?.caption,
                        aspectRatio: body?.aspectRatio,
                        url,
                    },
                    orderIndex,
                },
                include: {media: true},
            });
        }
        if(type === 'video') {
            const url = String(body?.url ?? '');
            if(!url) throw new BadRequestException('video url is required');

            const media = await this.ensureMediaByUrl(url);
            return this.prisma.itemBlock.create({
                data: {
                    itemId,
                    type: 'video',
                    mediaId: media?.id ?? undefined,
                    content: {
                        provider: body?.provider ?? 'upload',
                        caption: body?.caption,
                        controls: body?.controls,
                        muted: body?.muted,
                        startAt: body?.startAt,
                        endAt: body?.endAt,
                        aspectRatio: body?.aspectRatio,
                        url,
                    },
                    orderIndex,
                },
                include: {media: true},
            });
        }

        throw new BadRequestException('Unsupported block type');
    }

    async update(itemId: string, blockId: string, body: any) {
        const block = await this.prisma.itemBlock.findUnique({
            where: {id:blockId},
            include: {media: true},
        });
        if(!block || block.itemId !== itemId) {
            throw new NotFoundException('Block not found in this iten');
        }

        const c = (block.content ?? {}) as Record<string, any>;
        if (block.type === 'text') {
        const prevStyle = (c.style ?? {}) as Record<string, any>;
        const incomingStyle = (body?.style ?? undefined) as Record<string, any> | undefined;

        const mergedStyle = incomingStyle
            ? { ...prevStyle, ...incomingStyle }
            : prevStyle;

        const nextContent = {
            text: body?.text ?? c.text,
            style: mergedStyle,
        };

        return this.prisma.itemBlock.update({
            where: { id: blockId },
            data: {
            content: nextContent,
            updatedAt: new Date(),
            },
            include: { media: true },
        });
        }
        if(block.type === 'image') {
            let mediaId = block.mediaId ?? undefined;
            let url = body?.url ?? c.url;
            if( typeof url === 'string' && url) {
                const media = await this.ensureMediaByUrl(String(url));
                mediaId = media?.id;
            } else {
                url = c.url;
            }
            const nextContent = {
                alt: body?.alt ?? c.alt,
                caption: body?.caption ?? c.caption,
                aspectRatio: body?.aspectRatio ?? c.aspectRatio,
                url,
            };
            return this.prisma.itemBlock.update({
                where: {id: blockId},
                data: {
                    mediaId,
                    content: nextContent,
                    updatedAt: new Date(),
                },
                include: { media: true},
            });
        }
        if(block.type === 'video') {
            let mediaId =  block.mediaId ?? undefined;
            let url = body?.url ?? c.url;
            if (typeof url === 'string' && url) {
                const media = await this.ensureMediaByUrl(String(url));
                mediaId = media?.id;
            } else {
                url = c.url;
            }
            const nextContent = {
                provider: body?.provider ?? c.provider ?? 'upload',
                caption: body?.caption ?? c.caption,
                controls: body?.controls ?? c.controls,
                muted: body?.muted ?? c.muted,
                startAt: body?.startAt ?? c.startAt,
                endAt: body?.endAt ?? c.endAt,
                aspectRatio: body?.aspectRatio ?? c.aspectRatio,
                url,
            };
            return this.prisma.itemBlock.update({
                where: {id: blockId},
                data: {
                    mediaId,
                    content: nextContent,
                    updatedAt: new Date(),
                },
                include: {media: true},
            });
        }
        throw new BadRequestException('Unsupported block type');
    }

    async reorder(itemId: string, order: string[]) {
        if(!Array.isArray(order) || order.length === 0) {
            throw new BadRequestException('order array must not be empty');
        }

        const blocks = await this.prisma.itemBlock.findMany({
            where: {itemId},
            select: {id:true},
        });
        const valid = new Set(blocks.map(b => b.id));
        const filtered = order.filter(id => valid.has(id));
        if(filtered.length !== blocks.length) {
            throw new BadRequestException('order does not match existing blocks');
        }

        await this.prisma.$transaction(
            filtered.map((id,idx) =>
                this.prisma.itemBlock.update({
                    where: {id},
                    data: {orderIndex: idx, updatedAt: new Date()},
                }),
            ),
        );
        return this.prisma.itemBlock.findMany({
            where: {itemId},
            include: {media: true},
            orderBy: {orderIndex: 'asc'},
        });
    }

    async remove(itemId: string, blockId: string) {
        const block = await this.prisma.itemBlock.findUnique({
            where: {id: blockId},
            select: {id: true, itemId: true},
        });
        if(!block || block.itemId !== itemId) {
            throw new NotFoundException('Block not found in this item');
        }
        await this.prisma.itemBlock.delete({where: { id: blockId }});
        const rest = await this.prisma.itemBlock.findMany({
            where: { itemId },
            select: { id: true },
            orderBy: { orderIndex: 'asc' },
        });
        await this.prisma.$transaction(
            rest.map((b, idx) =>
                this.prisma.itemBlock.update({
                    where: {id: b.id},
                    data: { orderIndex: idx, updatedAt: new Date() },
                }),
            ),
        );
        return { ok:true };
    }
}