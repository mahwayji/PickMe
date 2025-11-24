import SideBar from '@/components/utils/SideBar'
import React, {useEffect} from 'react'
import { Button } from '@/components/ui/button'
import {PROFILE_INFO_PATH} from '@/constants/routes'
import { Link, useParams } from 'react-router-dom'
import { axiosInstance } from '@/lib/axios'
import type { UserProfile } from '@/types/userProfile'
import type { Item } from '@/types/item'
import { toast } from 'sonner'
import { ItemListView } from '@/components/Item/ItemListView';
import { MediaImage } from '@/components/utils/MediaToImage'


const Section: React.FC = () => {

    const {username , sectionId} = useParams(); 
    
    const [data, setData] = React.useState<UserProfile|null>(null);
    const [itemData, setItemData] = React.useState<Item[]>([]);
    const [userId, setUserId] = React.useState<string | null>(null);
    const [isLoading, setLoading] = React.useState<boolean >(false);
    

    const fetchUserId = async () => {
        try {
          const res = await axiosInstance.get(`/auth/me`);
          setUserId(res.data.id);
        } catch (error) {
          console.error('Error fetching user ID:', error);
        }
    }

    const fetchItem = async () => {
        try {
          const res = await axiosInstance.get(`/sections/${sectionId}/items`);
          setItemData(res.data);
        } catch (error) {
          console.error('Error fetching item', error);
        }
    }

    const fetchProfile = async () => {
    try { 
      const res = await axiosInstance.get(`/profile/${username}`)
      setData(res.data);
    }
    catch(error){
      toast.error("Can't get this user profile!")
    }
    }

    useEffect(() => {

        fetchUserId();
        if (username) fetchProfile();
        if (userId) fetchItem();

      }, [username,sectionId,userId]);

    console.log(data)
    console.log(itemData)
    return (
        <div className="text-foreground min-h-screen text-center" >
            <SideBar />

            <div className='w-[1200px] pl-40 text-left'>
                <>
                
                
                { (data? data.id === userId: 0) ? 
                /* Button */
                (
                <div className='flex justify-between pr-4 pl-4'>
                    <Button className="border font-light rounded-3xl bg-white text-zinc-700 px-4 py-2 cursor-pointer" >
                        <Link to={PROFILE_INFO_PATH.replace(':username', username ? username : '404')}>
                            CANCEL
                        </Link>
                    </Button>
                    <Button className="border font-light rounded-3xl bg-black text-white px-4 py-2 cursor-pointer">
                        <Link to={PROFILE_INFO_PATH.replace(':username', username ? username : '404')}>
                            SAVE
                        </Link>
                    </Button>

                </div>
                ):

                /*Name card*/
                <div className='flex justify-between pr-4 pl-4'>  
                    
                    <div className="flex flex-row justify-between">
                        <Link to={PROFILE_INFO_PATH.replace(':username', username ? username : '404')} className = 'flex items-center'>
                        
                            <MediaImage
                                mediaId= {data?.profileMediaId}
                                className="w-10 h-10 rounded-full flex items-center justify-center ring-2 shadow-md"
                            />
                                
                            <div className = 'text-sm font-semibold px-2'>
                                {data? data.firstName: 'Anonymous'} {data? data.lastName: 'King'}
                            </div>
                        </Link>
                    </div>
                    <div>
                        <Button className="border font-light rounded-3xl px-4 py-2 cursor-pointer">
                            <Link to={PROFILE_INFO_PATH.replace(':username', username ? username : '404')}>
                                CONTACT ME
                            </Link>
                        </Button>
                    </div>
                </div>
                }

                {/* Seperator */}
                <div className="w-full h-px bg-gray-300 my-[10px]"></div>

                {/* Item View */}
                <div className='flex justify-start w-full '>
                    <ItemListView itemData={itemData} ownerPageId={data? data.id: null} userId={userId} isLoading={isLoading} setLoading={setLoading}/>
                </div>
                </>
            </div>
        </div>
    )
}

export default Section