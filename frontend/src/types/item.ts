import type { ItemBlock } from "./itemBlock";

export type Item = {
    id: string,
    sectionId: string,
    title: string,
    description: string,
    tags: string[],
    thumbnail: string,
    orderIndex: number,
    blocks: ItemBlock[],
    createdAt: Date,
    updatedAt: Date,
}