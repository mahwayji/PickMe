import SideBar from '@/components/utils/SideBar'
import React, { useCallback, useEffect, useState } from 'react'
import ItemMedia from '../Item/ItemFeed'
import { axiosInstance } from '@/lib/axios';
import type { Item } from '@/types/item';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import Loading from '../Loading';

const Home : React.FC= () => {
    const [feed, setFeed] = useState< Item[]>([]);
    const [tag, setTag] = useState('')
    const [loading, setLoading] = useState<boolean>(true)
    const getFeed = useCallback(async () => {
        try {
            if (tag !== ''){
              const response =  await axiosInstance.get(`/feed/${tag}`)
              setFeed(response.data)
            }
            else{
              const response = await axiosInstance.get(`/feed`)
              setFeed(response.data)  
            }
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
    }, [])

    useEffect(() => {
        getFeed()
    },[tag])
    
  if(loading) return (<Loading />)
    
  return (
    <div >
        <SideBar />
        <div className='flex flex-row items-center justify-around p-4'>
          <ItemMedia feed = {feed}/>
        </div >

    </div>
  )
}

export default Home