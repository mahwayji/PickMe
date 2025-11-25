import SideBar from '@/components/utils/SideBar'
import React, { useCallback, useEffect, useState } from 'react'
import ItemMedia from '../Item/ItemFeed'
import { axiosInstance } from '@/lib/axios';
import type { Item } from '@/types/item';
import { isAxiosError } from 'axios';
import { toast } from 'sonner';
import Loading from '../Loading';
import ProfileSummaryCard from '@/components/Home/Home/ProfileSummaryCard';
import TagPanel from '@/components/Home/Tags/TagPanel';
import type { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

const Home : React.FC= () => {
    const [feed, setFeed] = useState< Item[]>([]);
    const [loading, setLoading] = useState<boolean>(true)
    const [activeTag, setActiveTag] = React.useState<string>('');
    const [tags, setTags] = React.useState<string[]>([]);
    const user = useSelector((state: RootState) => state.auth.user);
    const isAuthenticated = user ? true: false;

    const getFeed = useCallback(async () => {
        try {
            if (activeTag !== ''){
              const response =  await axiosInstance.get(`/feed/${activeTag}`)
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
    }, [activeTag])


    const handleSelectTag = (t: string) => {
      setActiveTag(t)
    };

    const fetchTags = async () => {
      try {
        const response = await axiosInstance.get('/tag');
        setTags(response.data.map((tag: { name: string }) => tag.name));
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
  };

    useEffect(() => {
        fetchTags()
        getFeed()
        console.log(feed)
    }, [activeTag])
    
  if(loading) return (<Loading />)
    
  return (
    <div >
        <div className = 'ml-40 w-full  overflow-y-auto'>
          <SideBar />
          <div className='flex flex-row  justify-around gap-4'>
            {/* Left column: sticky profile summary */}
            <div className="w-[25%]">
              <div className="sticky top-16">
                {isAuthenticated && <ProfileSummaryCard />}
              </div>
            </div>

            <div className = 'w-[50%]'>
                <ItemMedia feed = {feed}/>
            </div>

            <div className="w-[25%]">
              <div className="sticky top-16">
                <TagPanel
                  title="Tags"
                  popularTags={tags.slice(0,7)}
                  newTags={tags.slice(0,7)}
                  activeTag={activeTag}
                  onSelectTag={handleSelectTag}
                />
              </div>
          </div>
            <div className = 'right-0'>
            </div>
          </div >
        </div>
    </div>
  )
}

export default Home