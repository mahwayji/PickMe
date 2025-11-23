import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { MediaType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MediaService } from 'src/media/media.service';

//Helper function
function toIso(d: Date | string | number | null | undefined): string {
  const dd = d == null ? new Date() : new Date(d as any);
  return isNaN(dd.getTime()) ? new Date().toISOString() : dd.toISOString();
}

function guessMediaType(url: string): MediaType {
  const u = url.toLowerCase();
  if (/\.(png|jpg|jpeg|webp|gif)$/.test(u)) return 'image';
  if (/\.(mp4|webm|mov)$/.test(u)) return 'video';
  if (/\.(pdf)$/.test(u)) return 'pdf';
  return 'other';
}

@Injectable()
export class ItemsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: MediaService,
  ) {}

  private toApiItemShape(item: any) {
    const tags: string[] =
      item.tags?.map((it: any) => it.tag?.name).filter(Boolean) ?? [];

    const blocksRaw: any[] = item.blocks ?? [];
    const itemBlocks = blocksRaw
      .slice()
      .sort((a, b) => (a.orderIndex ?? 1e9) - (b.orderIndex ?? 1e9))
      .map((b) => {
        const c = (b.content ?? {}) as Record<string, any>;
        if (b.type === 'text') {
          if (typeof c.text !== 'string') return null;
          return {
            id: b.id,
            type: 'text',
            text: c.text,
            style: c.style,
            orderIndex: b.orderIndex ?? 0,
          };
        }
        if (b.type === 'image') {
          const url = b.media?.url ?? c.url;
          if (typeof url !== 'string') return null;
          return {
            id: b.id,
            type: 'image',
            mediaId: b.mediaId ?? undefined,
            url,
            alt: c.alt,
            caption: c.caption,
            aspectRatio: c.aspectRatio,
            orderIndex: b.orderIndex ?? 0,
          };
        }
        if (b.type === 'video') {
          const url = b.media?.url ?? c.url;
          if (typeof url !== 'string') return null;
          return {
            id: b.id,
            type: 'video',
            mediaId: b.mediaId ?? undefined,
            url,
            provider: c.provider ?? 'upload',
            caption: c.caption,
            controls: c.controls,
            muted: c.muted,
            startAt: c.startAt,
            endAt: c.endAt,
            aspectRatio: c.aspectRatio,
            orderIndex: b.orderIndex ?? 0,
          };
        }

        return null;
      })
      .filter(Boolean);

    const sectionTitle: string | undefined = item.section?.title ?? undefined;
    const profileMediaId: string | undefined = item.section?.user?.profile?.profileMediaId ?? undefined;
    const username: string | undefined = item.section?.user?.username ?? undefined;
    const thumbnailMediaId = item.thumbnailMediaId ?? undefined;
    const thumbnailUrl = item.thumbnailMedia?.url ?? undefined;

    return {
      id: item.id,
      sectionId: item.sectionId,
      title: item.title,
      description: item.description ?? undefined,
      tags,
      thumbnailMediaId,
      thumbnailUrl,
      itemBlocks: itemBlocks.length ? itemBlocks : undefined,
      createdAt: toIso(item.createdAt),
      updatedAt: toIso(item.updatedAt),
      sectionTitle,
      profileMediaId,
      username,
    };
  }

  private async ensureMediaByUrl(url: string, ownerId?: string | null) {
    const found = await this.prisma.media.findUnique({ where: { url } });
    if (found) return found;
    return this.prisma.media.create({
      data: {
        url,
        fileName: url.split('/').pop() || url,
        type: guessMediaType(url),
        uploadedAt: new Date(),
        ownerId: ownerId ?? undefined,
      },
    });
  }

  private async ensureTagIds(tagNames: string[]) {
    const names = Array.from(new Set((tagNames ?? []).filter(Boolean)));
    if (!names.length) return [];
    const existing = await this.prisma.tag.findMany({
      where: { name: { in: names } },
    });
    const map = new Map(existing.map((t) => [t.name, t.id]));
    const missing = names.filter((n) => !map.has(n));
    if (missing.length) {
      const created = await this.prisma.$transaction(
        missing.map((n) => this.prisma.tag.create({ data: { name: n } })),
      );
      created.forEach((t) => map.set(t.name, t.id));
    }
    return names.map((n) => map.get(n)!);
  }

  async listBySection(sectionId: string) {
    const items = await this.prisma.item.findMany({
      where: { sectionId },
      orderBy: { createdAt: 'desc' },
      include: {
        thumbnailMedia: true,
        blocks: { include: { media: true } },
        tags: { include: { tag: true } },
        section: { include: { user: { include: { profile: true } } } },
      },
    });
    return items.map((it) => this.toApiItemShape(it));
  }

  async getOne(id: string) {
    const item = await this.prisma.item.findUnique({
      where: { id },
      include: {
        thumbnailMedia: true,
        blocks: { include: { media: true }, orderBy: { orderIndex: 'asc' } },
        tags: { include: { tag: true } },
        section: { include: { user: { include: { profile: true } } } },
      },
    });
    if (!item) throw new NotFoundException('Item not found');
    return this.toApiItemShape(item);
  }

  //Create Item
  async create( sectionId: string, body: any, thumbnailFile?: Express.Multer.File,) {
    const { title, description, tags, blocks } = body ?? {}

    if (!title || typeof title !== 'string') {
      throw new BadRequestException('Title is required')
    }

    const base = await this.prisma.item.create({
      data: {
        sectionId,
        title,
        description,
      },
    })

    if (Array.isArray(tags)) {
      const tagIds = await this.ensureTagIds(tags)
      if (tagIds.length) {
        await this.prisma.itemTag.createMany({
          data: Array.from(new Set(tagIds)).map((tagId) => ({
            itemId: base.id,
            tagId,
          })),
        })
      }
    }

    if (Array.isArray(blocks)) {
      let order = 0
      for (const b of blocks) {
        if (b.type === 'text') {
          await this.prisma.itemBlock.create({
            data: {
              itemId: base.id,
              type: 'text',
              content: {
                text: b.text,
                style: b.style,
              },
              orderIndex: order++,
            },
          })
        } else if (b.type === 'image') {
          const media = await this.ensureMediaByUrl(b.url)
          await this.prisma.itemBlock.create({
            data: {
              itemId: base.id,
              type: 'image',
              mediaId: media?.id,
              content: {
                alt: b.alt,
                caption: b.caption,
                aspectRatio: b.aspectRatio,
                url: b.url,
              },
              orderIndex: order++,
            },
          })
        } else if (b.type === 'video') {
          const media = await this.ensureMediaByUrl(b.url)
          await this.prisma.itemBlock.create({
            data: {
              itemId: base.id,
              type: 'video',
              mediaId: media?.id,
              content: {
                provider: b.provider ?? 'upload',
                caption: b.caption,
                controls: b.controls,
                muted: b.muted,
                startAt: b.startAt,
                endAt: b.endAt,
                aspectRatio: b.aspectRatio,
                url: b.url,
              },
              orderIndex: order++,
            },
          })
        }
      }
    }

    let thumbnailMediaId: string | undefined

    if (thumbnailFile) {
      const section = await this.prisma.section.findUnique({
        where: { id: sectionId },
        select: { ownerId: true },
      })

      const ownerId = section?.ownerId ?? null
      if (!ownerId) {
        throw new BadRequestException('Section owner not found for thumbnail upload')
      }

      const media = await this.mediaService.uploadImage(ownerId, thumbnailFile)
      thumbnailMediaId = media.id
    } else if (typeof (body as any).thumbnail === 'string' && (body as any).thumbnail) {
      const media = await this.ensureMediaByUrl((body as any).thumbnail)
      thumbnailMediaId = media?.id
    }

    if (thumbnailMediaId) {
      await this.prisma.item.update({
        where: { id: base.id },
        data: { thumbnailMediaId },
      })
    }

    const full = await this.prisma.item.findUniqueOrThrow({
      where: { id: base.id },
      include: {
        thumbnailMedia: true,
        blocks: { include: { media: true } },
        tags: { include: { tag: true } },
        section: {
          include: {
            user: {
              include: { profile: true },
            },
          },
        },
      },
    })

    return this.toApiItemShape(full)
  }

    async update(id: string, body: any, file?: Express.Multer.File) {
    const { title, description, tags, thumbnail, blocks } = body ?? {};

    const item = await this.prisma.item.findUnique({
      where: { id },
      select: {
        sectionId: true,
        section: {
          select: { ownerId: true },
        },
      },
    });
    if (!item) {
      throw new NotFoundException('Item not found');
    }

    // owner or null
    const ownerIdForUpload: string | null =
      item.section?.ownerId ?? item.sectionId ?? null;

    // update title desc
    await this.prisma.item.update({
      where: { id },
      data: {
        title: title ?? undefined,
        description: description ?? undefined,
        updatedAt: new Date(),
      },
    });

    // tags
    if (Array.isArray(tags)) {
      await this.prisma.itemTag.deleteMany({ where: { itemId: id } });
      const uniqueTagNames = Array.from(new Set(tags.filter(Boolean)));
      if (uniqueTagNames.length) {
        const existing = await this.prisma.tag.findMany({
          where: { name: { in: uniqueTagNames } },
        });
        const map = new Map(existing.map((t) => [t.name, t.id]));
        const missing = uniqueTagNames.filter((n) => !map.has(n));
        if (missing.length) {
          const created = await this.prisma.$transaction(
            missing.map((n) => this.prisma.tag.create({ data: { name: n } })),
          );
          created.forEach((t) => map.set(t.name, t.id));
        }
        const tagIds = uniqueTagNames.map((n) => map.get(n)!);

        await this.prisma.itemTag.createMany({
          data: tagIds.map((tagId) => ({ itemId: id, tagId })),
        });
      }
    }

    // blocks
    if (Array.isArray(blocks)) {
      await this.prisma.itemBlock.deleteMany({ where: { itemId: id } });

      let order = 0;
      for (const b of blocks) {
        if (b.type === 'text') {
          await this.prisma.itemBlock.create({
            data: {
              itemId: id,
              type: 'text',
              content: {
                text: b.text,
                style: b.style,
              },
              orderIndex: order++,
            },
          });
        } else if (b.type === 'image') {
          const media = await this.ensureMediaByUrl(b.url);
          await this.prisma.itemBlock.create({
            data: {
              itemId: id,
              type: 'image',
              mediaId: media.id,
              content: {
                alt: b.alt,
                caption: b.caption,
                aspectRatio: b.aspectRatio,
              },
              orderIndex: order++,
            },
          });
        } else if (b.type === 'video') {
          const media = await this.ensureMediaByUrl(b.url);
          await this.prisma.itemBlock.create({
            data: {
              itemId: id,
              type: 'video',
              mediaId: media.id,
              content: {
                provider: b.provider ?? 'upload',
                caption: b.caption,
                controls: b.controls,
                muted: b.muted,
                startAt: b.startAt,
                endAt: b.endAt,
                aspectRatio: b.aspectRatio,
              },
              orderIndex: order++,
            },
          });
        }
      }
    }

    if (file) {
      const media = await this.mediaService.uploadImage(ownerIdForUpload, file);
      await this.prisma.item.update({
        where: { id },
        data: { thumbnailMediaId: media.id },
      });
    } else if (typeof thumbnail === 'string' && thumbnail) {
      const media = await this.ensureMediaByUrl(thumbnail, ownerIdForUpload);
      await this.prisma.item.update({
        where: { id },
        data: { thumbnailMediaId: media.id },
      });
    }

    const full = await this.prisma.item.findUnique({
      where: { id },
      include: {
        thumbnailMedia: true,
        blocks: { include: { media: true }, orderBy: { orderIndex: 'asc' } },
        tags: { include: { tag: true } },
        section: { include: { user: { include: { profile: true } } } },
      },
    });
    if (!full) throw new NotFoundException('Item not found');
    return this.toApiItemShape(full);
  }



  async remove(id: string) {
    const item= await this.prisma.item.findUnique({where: {id}});
    
    if(item?.thumbnailMediaId){
      await this.mediaService.deleteImage(item.thumbnailMediaId);
    }
    await this.prisma.itemBlock.deleteMany({ where: { itemId: id } });
    await this.prisma.itemTag.deleteMany({ where: { itemId: id } });
    await this.prisma.viewEvent.deleteMany({ where: { itemId: id } });
    await this.prisma.shareEvent.deleteMany({ where: { itemId: id } });
    await this.prisma.itemStat.deleteMany({ where: { itemId: id } });
    await this.prisma.item.delete({ where: { id } });
  }

}
