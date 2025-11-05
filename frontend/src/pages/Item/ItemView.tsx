import { axiosInstance } from '@/lib/axios'
import { isAxiosError } from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Loading from '../Loading'
import NotFound from '../NotFound'
import type { ItemBlock } from '@/types/itemBlock'
import type { Item } from '@/types/item'
import ItemBlocks from './ItemBlocks'

const fakeData = {
    id: "item-003",
    sectionId: "section-03",
    title: "Building a REST API",
    description: "Learn to design and build RESTful APIs using Node.js and Express.",
    tags: ["nodejs", "backend", "api"],
    thumbnail: "https://example.com/thumbnails/rest-api.png",
    orderIndex: 3,
    blocks: [
      {
        id: "block-005",
        type: "text",
        content: "Express simplifies creating robust APIs with minimal setup.",
      } as ItemBlock,
      {
        id: "block-006",
        type: "code",
        content: `app.get('/users', (req, res) => res.json(users));`,
      } as ItemBlock,
    ],
    createdAt: new Date("2024-11-01T09:00:00Z"),
    updatedAt: new Date("2024-11-03T17:45:00Z"),
}
const ItemView : React.FC= () => {
  const [data, setData] = useState< Item | null>(null)
  const [item, setItem] = useState<ItemBlock[]>([]);
  

  const [loading, setLoading] = useState<boolean>(true)
  const { itemId } = useParams()

  const getItem = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/items/${itemId}`)
      setData(response.data)
      setItem(response.data.blocks)
    } catch (error) {
      if(isAxiosError(error)){
        const errorMessage = error.response?.data?.message || "Something went wrong"
        toast.error(errorMessage)
      } else {
        toast.error("An unexpected error occurred")
      } 
    }
    finally {
        setLoading(false)
    }

  }, [itemId])

  useEffect(() => {
    getItem()
    setData(fakeData)
  }, [itemId])

  if(loading) return ( <Loading />)

  else if (!data) return (<NotFound />)
  
    return (
    <div className = 'flex-col p-4 h-screen overflow-auto'>
      <h1>{data?.title}</h1>
      <ItemBlocks items={item} />
    </div>
    
  )
}

export default ItemView