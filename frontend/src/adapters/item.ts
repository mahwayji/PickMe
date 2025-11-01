import { z } from "zod";
import { ItemZ } from "@/contracts/item";
import type { Item } from "@/contracts/item";
import type { ContentBlock } from "@/contracts/block";
import { parseTags } from "@/lib/tag";

const ReadyBlockZ = z.looseObject({
  type: z.enum(["text", "image", "video"]),
});

const ReadyItemZ = z.looseObject({
  id: z.string().optional(),
  _id: z.string().optional(),
  sectionId: z.string(),

  title: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  thumbnail: z.url().optional(),
  blocks: z.array(ReadyBlockZ).optional(),

  createdAt: z.union([z.string(), z.number(), z.date()]).optional(),
  updatedAt: z.union([z.string(), z.number(), z.date()]).optional(),
});

const MediaZ = z.looseObject({
  id: z.string(),
  url: z.url(),
  mimeType: z.string().optional(),
  width: z.number().int().optional(),
  height: z.number().int().optional(),
});

const ApiBlockZ = z.looseObject({
  id: z.string().optional(),
  type: z.enum(["text", "image", "video", "link", "pdf"]),
  orderIndex: z.number().int().optional(),
  content: z.record(z.string(), z.unknown()).optional(),
  media: MediaZ.optional(),
  url: z.url().optional(),
});

const PrismaLikeItemZ = z.looseObject({
  id: z.string(),
  sectionId: z.string(),
  title: z.string(),
  description: z.string().optional(),

  itemTags: z
    .array(z.looseObject({ tag: z.looseObject({ name: z.string() }) }))
    .optional(),

  thumbnailMedia: MediaZ.optional(),
  thumbnailMediaId: z.string().optional(),

  blocks: z.array(ApiBlockZ).optional(),

  createdAt: z.union([z.string(), z.number(), z.date()]).optional(),
  updatedAt: z.union([z.string(), z.number(), z.date()]).optional(),
});

const toIso = (v?: string | number | Date) => {
  const d = v == null ? new Date() : (v instanceof Date ? v : new Date(v));
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
};

function mapApiBlockToContent(b: z.infer<typeof ApiBlockZ>): ContentBlock | null {
  const t = b.type;
  const c = (b.content ?? {}) as Record<string, any>;

  if (t === "text") {
    if (typeof c.text !== "string") return null;
    return {
      type: "text",
      text: c.text,
      style: c.style,
    } as any;
  }

  if (t === "image") {
    const url = b.media?.url ?? b.url ?? c.url;
    if (typeof url !== "string") return null;
    return {
      type: "image",
      url,
      alt: c.alt,
      caption: c.caption,
      aspectRatio: c.aspectRatio,
    } as any;
  }

  if (t === "video") {
    const url = b.media?.url ?? b.url ?? c.url;
    if (typeof url !== "string") return null;
    return {
      type: "video",
      url,
      provider: c.provider ?? "upload",
      caption: c.caption,
      controls: c.controls,
      muted: c.muted,
      startAt: c.startAt,
      endAt: c.endAt,
      aspectRatio: c.aspectRatio,
    } as any;
  }
  return null;
}

export function toItem(payload: unknown): Item {
  const ready = ReadyItemZ.safeParse(payload);
  if (ready.success) {
    const d = ready.data;
    const tags = d.tags ? parseTags(d.tags.join(",")) : undefined;

    const normalized: Item = {
      id: d.id ?? d._id ?? crypto.randomUUID(),
      sectionId: d.sectionId,
      title: d.title,
      description: d.description,
      tags,
      thumbnail: d.thumbnail,
      blocks: d.blocks as any,
      createdAt: toIso(d.createdAt),
      updatedAt: toIso(d.updatedAt),
    };
    return ItemZ.parse(normalized);
  }

  const p = PrismaLikeItemZ.parse(payload);

  const tagNames = p.itemTags?.map((it) => it.tag.name);
  const tags = tagNames ? parseTags(tagNames.join(",")) : undefined;

  const thumbnail = p.thumbnailMedia?.url ?? undefined;

  const blocks = (p.blocks ?? [])
    .slice()
    .sort((a, b) => (a.orderIndex ?? 1e9) - (b.orderIndex ?? 1e9))
    .map(mapApiBlockToContent)
    .filter(Boolean) as ContentBlock[];

  const normalized: Item = {
    id: p.id,
    sectionId: p.sectionId,
    title: p.title,
    description: p.description,
    tags,
    thumbnail,
    blocks: blocks.length ? blocks : undefined,
    createdAt: toIso(p.createdAt),
    updatedAt: toIso(p.updatedAt),
  };

  return ItemZ.parse(normalized);
}

export function toApiItem(input: Partial<Item>) {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(input)) {
    if (v !== undefined) out[k] = v;
  }
  return out;
}
