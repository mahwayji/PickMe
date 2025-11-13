import { axiosInstance } from '@/lib/axios'

export type BlockType = 'text' | 'image' | 'video'

export type TextBlockPayload = {
  type: 'text'
  text: string
  style?: any
  orderIndex?: number
}

export type ImageBlockPayload = {
  type: 'image'
  url: string
  alt?: string
  caption?: string
  aspectRatio?: number
  orderIndex?: number
}

export type VideoBlockPayload = {
  type: 'video'
  url: string
  provider?: string
  caption?: string
  controls?: boolean
  muted?: boolean
  startAt?: number
  endAt?: number
  aspectRatio?: number
  orderIndex?: number
}

export type AnyBlockPayload = TextBlockPayload | ImageBlockPayload | VideoBlockPayload

export type BlockDto = {
  id: string
  type: BlockType
  url?: string
  text?: string
  style?: any
  alt?: string
  caption?: string
  aspectRatio?: number
  provider?: string
  controls?: boolean
  muted?: boolean
  startAt?: number
  endAt?: number
  orderIndex: number
  createdAt: string
  updatedAt: string
}

export async function listItemBlocks(itemId: string) {
  const { data } = await axiosInstance.get(`/items/${encodeURIComponent(itemId)}/blocks`)
  return data as BlockDto[]
}

export async function createItemBlock(itemId: string, payload: AnyBlockPayload) {
  const { data } = await axiosInstance.post(`/items/${encodeURIComponent(itemId)}/blocks`, payload)
  return data as BlockDto
}

export async function updateItemBlock(itemId: string, blockId: string, patch: Partial<AnyBlockPayload>) {
  const { data } = await axiosInstance.patch(
    `/items/${encodeURIComponent(itemId)}/blocks/${encodeURIComponent(blockId)}`,
    patch
  )
  return data as BlockDto
}

export async function deleteItemBlock(itemId: string, blockId: string) {
  const { data } = await axiosInstance.delete(
    `/items/${encodeURIComponent(itemId)}/blocks/${encodeURIComponent(blockId)}`
  )
  return data as { ok: true }
}

export async function reorderItemBlocks(itemId: string, orderedIds: string[]) {
  const { data } = await axiosInstance.post(
    `/items/${encodeURIComponent(itemId)}/blocks/reorder`,
    { order: orderedIds }
  )
  return data as BlockDto[]
}
