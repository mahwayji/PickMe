import {z} from "zod";
import {type Item, ItemZ} from "@/contracts/item";
import {BlockZ} from "@/contracts/block";
import {parseTags} from "@/lib/tag";


const ItemApiZ = z.looseObject({

    id: z.string().optional(),
    _id: z.string().optional(),
    sectionId: z.string(),

    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).optional(),
    thumbnail: z.url().optional(),
    blocks: z.array(BlockZ).optional(),

    createdAt: z.union([z.string(), z.number()]).optional(),
    updatedAt: z.union([z.string(), z.number()]).optional(),
})

const toIso = (v?: string | number) =>
  v == null ? new Date().toISOString()
            : (typeof v === "number" ? new Date(v) : new Date(v)).toISOString();

export function toItem(payload: unknown): Item {

    const d = ItemApiZ.parse(payload);
    const tags = d.tags ? parseTags(d.tags.join(",")) : undefined;

    const normalized: Item = {
        id: d.id ?? d._id ?? crypto.randomUUID(),
        sectionId: d.sectionId,
        title: d.title,
        description: d.description,
        tags,
        thumbnail: d.thumbnail,
        blocks: d.blocks,
        createdAt: toIso(d.createdAt),
        updatedAt: toIso(d.updatedAt),
    };
    return ItemZ.parse(normalized);
}

export function toApiItem(input: Partial<Item>){
    const out: Record<string, any> = {};
    for(const [k, v] of Object.entries(input)){
        if(v !== undefined) out[k] = v;
    }
    return out;
}