import type { ItemBlock } from "./itemBlock";

export type Item = {
    id: string,
    sectionId: string,
    title: string,
    description: string,
    tags: string[],
    thumbnail: string,
    blocks: ItemBlock[],
    orderIndex: number,
    createdAt: Date,
    updatedAt: Date,
}