import { axiosInstance } from '@/lib/axios'
import { isAxiosError } from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import Loading from '../Loading'
import NotFound from '../NotFound'
import type { Item } from '@/types/item'
import ItemBlocks from './ItemBlocks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SideBar from '@/components/utils/SideBar'
import { Separator } from '@/components/ui/separator'
import { PROFILE_INFO_PATH } from '@/constants/routes'
import { MediaImage } from '@/components/utils/MediaToImage'

const ItemView : React.FC= () => {
  const [data, setData] = useState< Item | null>(null)  

  const [loading, setLoading] = useState<boolean>(true)
  const { itemId } = useParams()

  const getItem = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/items/${itemId}`)
      setData(response.data)
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
  }, [itemId])

  if(loading) return ( <Loading />)

  else if (!data) return (<NotFound />)
  
    return (
    <div>
      <SideBar />
      <div className = 'p-4 h-screen overflow-auto'>
        <Card className = 'flex-col'>
          
          <CardHeader>
            <CardTitle className = 'text-2xl text-left'>
              {data.sectionTitle}
            </CardTitle>
            <div className = 'flex flex-row justify-between'>
            <div className = 'flex items-center'>

                  <Link to= {PROFILE_INFO_PATH} >
                          <MediaImage
                            mediaId = {data?.profileMediaId}
                            className="w-10 h-10 rounded-full flex items-center justify-center ring-2 shadow-md"
                          />
                  </Link>
                  <CardTitle className = 'text-sm font-semibold px-2'>
                    {data.username}
                  </CardTitle>
              </div>
              <CardFooter>
                <Button variant='outline' className='bg-background'>
                  Contact Me
                </Button>
              </CardFooter>
            </div>
          </CardHeader>
        <Separator className="bg-zinc-400 my-4 "/>
        <CardContent>
          
          <CardTitle className = 'text-lg'>{data?.title}</CardTitle>
          <ItemBlocks items={data.blocks} />
        </CardContent>
        </ Card>
      </div>
    </div>
    
  )
}

export default ItemView