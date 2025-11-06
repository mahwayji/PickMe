import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ITEM_INFO_PATH } from '@/constants/routes'
import { axiosInstance } from '@/lib/axios';
import type { Item } from '@/types/item';
import { isAxiosError } from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner';

//demo
import RacoonDance from '@/images/coolRacoon.gif'
import { Button } from '@/components/ui/button';
import Loading from '../Loading';
import { demoItems } from './DemoData';
import { User } from 'lucide-react';



const ItemMedia: React.FC = () => {
    const [feed, setFeed] = useState< Item[]>([]);

    const [loading, setLoading] = useState<boolean>(true)

    const getFeed = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`/feed`)
            setFeed(response.data)
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
        setFeed(demoItems) //demo test 
    },[])


    if(loading) return (<Loading />)

    if(feed.length === 0) return (
      <div>
        Item not found
      </div>
    )
    return (
        <div className = 'flex flex-col gap-4 min-h-0 h-screen w-[50%] overflow-y-auto'>
            {feed.map((item) => {
                return(     
                    <Link to = {ITEM_INFO_PATH.replace(':itemId', item.id)}>
                        <Card className = 'flex-col justify-center'>
                            <CardHeader className = 'flex-row justify-between'>
                                <div className = 'flex'>
                                    {/* will add the profile later */}
                                    <User />
                                    <CardTitle className = 'text-sm font-semibold px-2'>
                                      profile
                                    </CardTitle>
                                </div>
                                <CardFooter>
                                  <Button variant='outline' className='bg-background'>
                                    Contact Me
                                  </Button>
                                </CardFooter>
                            </CardHeader>

                            <img src = {RacoonDance} alt = 'Loading' className = 'block mx-auto max-h-[400px] w-auto'/>                           
                            <br></br>
                            <CardContent className = 'text-left p-4'>
                              <h2 className = 'font-bold'>
                                  {item.title}
                              </h2>
                              <p className = 'mt-2'>
                                  {item.description}
                              </p>
                              <p className = 'text-blue-400'>
                              {item.tags.map((tag) => {
                                return (`#${tag} `)
                                // we can add link to tag here later on
                              })}
                              </p>
                            </CardContent>
                        </Card>
                    </Link>
                )
                    
            })}
            <div>
              That's all of the items!
            </div>
        </div>
    )
}

export default ItemMedia