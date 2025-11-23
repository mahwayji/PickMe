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

export type BlockDto =
  | {
      id: string
      type: 'text'
      text: string
      style?: any
      orderIndex: number
      createdAt: string
      updatedAt: string
    }
  | {
      id: string
      type: 'image'
      mediaId?: string
      url: string
      alt?: string
      caption?: string
      aspectRatio?: string
      orderIndex: number
      createdAt: string
      updatedAt: string
    }
  | {
      id: string
      type: 'video'
      mediaId?: string
      url: string
      provider?: string
      caption?: string
      controls?: boolean
      muted?: boolean
      startAt?: number
      endAt?: number
      aspectRatio?: string
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
    patch,
  )
  return data as BlockDto
}

export async function deleteItemBlock(itemId: string, blockId: string) {
  const { data } = await axiosInstance.delete(
    `/items/${encodeURIComponent(itemId)}/blocks/${encodeURIComponent(blockId)}`,
  )
  return data as { ok: true }
}

export async function reorderItemBlocks(itemId: string, orderedIds: string[]) {
  const { data } = await axiosInstance.post(
    `/items/${encodeURIComponent(itemId)}/blocks/reorder`,
    { order: orderedIds },
  )
  return data as BlockDto[]
}

export async function uploadItemBlock(itemId: string, file: File) {
  const form = new FormData()
  form.append('file', file)

  const { data } = await axiosInstance.post(
    `/items/${encodeURIComponent(itemId)}/blocks/upload`,
    form,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  )
  return data as BlockDto
}
