import { axiosInstance } from '@/lib/axios'

export type CreateItemPayload = {
  title: string
  description?: string
  tags?: string[]
  thumbnailMediaId?: string
}

export async function createItem(sectionId: string, payload: CreateItemPayload) {
  const { data } = await axiosInstance.post(
    `/sections/${encodeURIComponent(sectionId)}/items`,
    payload
  )
  return data as { id: string; sectionId: string }
}

export type ItemDto = {
  id: string
  title: string
  description?: string
  tags?: string[]
  thumbnailId?: string
  itemBlocks?: {
    id: string
    type: 'text' | 'image' | 'video'
    text?: string
    style?: any
    url?: string
    alt?: string
    caption?: string
    aspectRatio?: number
    orderIndex: number
    provider?: string
    controls?: boolean
    muted?: boolean
    startAt?: number
    endAt?: number
  }[]
  createdAt: string
  updatedAt: string

  sectionTitle?: string
  profileMediaId?: string
  username?: string
}

export async function getItem(itemId: string) {
  const { data } = await axiosInstance.get(`/items/${encodeURIComponent(itemId)}`)
  return data as ItemDto
}

export type UpdateItemPayload = Partial<Pick<ItemDto, 'title' | 'description' | 'tags' | 'thumbnailId'>>

export async function updateItem(itemId: string, payload: UpdateItemPayload) {
  const { data } = await axiosInstance.patch(`/items/${encodeURIComponent(itemId)}`, payload)
  return data as ItemDto
}