import { axiosInstance } from '@/lib/axios'

export async function getUrlById(id: string){
    const res = await axiosInstance.get(`media/${id}`)
    return res.data as string
}
