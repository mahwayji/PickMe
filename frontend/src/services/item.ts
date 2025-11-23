import { axiosInstance } from '@/lib/axios'

export type CreateItemPayload = {
  title: string
  description?: string
  tags?: string[]
  thumbnailMediaId?: string
}

export type UpdateItemPayload = {
  title?: string
  description?: string
  tags?: string[]
  blocks?: any[]
}

export async function createItem( sectionId: string, payload: CreateItemPayload, thumbnailFile?: File ) {
  const formData = new FormData()
  formData.append('title', payload.title)
  if (payload.description) formData.append('description', payload.description)
  if (payload.tags) {
    payload.tags.forEach((t) => formData.append('tags', t))
  }
  if (thumbnailFile) {
    formData.append('thumbnail', thumbnailFile)
  }

  const { data } = await axiosInstance.post(
    `/sections/${encodeURIComponent(sectionId)}/items`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return data as ItemDto
}

export type ItemDto = {
  id: string
  sectionId: string 
  title: string
  description?: string
  tags?: string[]
  thumbnailMediaId?: string
  thumbnailUrl?: string
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

export async function updateItem( id: string, payload: UpdateItemPayload, thumbnailFile?: File) {
  const encodedId = encodeURIComponent(id);

  if (thumbnailFile) {
    const form = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (Array.isArray(value) || typeof value === 'object') {
        form.append(key, JSON.stringify(value));
      } else {
        form.append(key, String(value));
      }
    });

    form.append('thumbnail', thumbnailFile);

    const { data } = await axiosInstance.patch(
      `/items/${encodedId}`,
      form,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );
    return data as ItemDto;
  }

  const { data } = await axiosInstance.patch(
    `/items/${encodedId}`,
    payload,
  );
  return data as ItemDto;
}