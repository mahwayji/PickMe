import type { ItemBlock } from "./itemBlock";

export type Item = {
    id: string,
    username: string,
    sectionTitle: string,
    profileMediaId: string,
    title: string,
    description: string,
    tags: string[],
    thumbnailMediaId: string,
    itemBlocks: ItemBlock[],
    orderIndex: number,
    createdAt: Date,
    updatedAt: Date,
}