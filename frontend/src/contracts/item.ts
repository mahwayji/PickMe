import {z} from "zod";
import {BlockZ} from "@/contracts/block";


export const TagZ = z.string()
  .min(1, "Can't be empty")
  .max(24, "tag is too long(max 24)")
  .regex(/^[\p{Letter}\p{Number}\p{Mark}_-]+$/u, "Allow only alphabets numbers _ and -");

export const ItemZ = z.object({
    id: z.string(),
    sectionId: z.string(),
    title: z.string().max(60, "Title is too long(max 60)."),
    description: z.string().max(500, "Description is too long(max 500)").optional(),
    tags: z.array(TagZ).max(10, "Maximun 10 tags").optional(),
    thumbnail: z.url().optional(),
    blocks: z.array(BlockZ).max(50).optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
})

export type Item = z.infer<typeof ItemZ>;