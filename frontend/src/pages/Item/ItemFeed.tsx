import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ITEM_INFO_PATH, PROFILE_INFO_PATH } from '@/constants/routes'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button';
import { MediaImage } from '@/components/utils/MediaToImage';
import type { Item } from '@/types/item';
import { Separator } from '@/components/ui/separator';

type Props = {
    feed: Item[],   
}

const ItemMedia = ({feed}: Props) => {

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
                                <div className = 'flex items-center'>
                                    <Link to= {PROFILE_INFO_PATH} >
                                            <MediaImage
                                            mediaId = {item.profileMediaId}
                                            className="w-10 h-10 rounded-full flex items-center justify-center ring-1 shadow-md"
                                            />
                                    </Link>
                                    <CardTitle className = 'text-sm font-semibold px-2'>
                                      {item.username}
                                    </CardTitle>
                                </div>
                                <CardFooter>
                                  <Button variant='outline' className='bg-background'>
                                    Contact Me
                                  </Button>
                                </CardFooter>
                            </CardHeader>

                            <MediaImage mediaId = {item.thumbnailId} alt = 'Loading' className = 'block mx-auto max-h-[400px] w-auto'/>                           
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
            
            <Separator className = 'py-2' />
            <div>
                That's all of the items!
            </div>
        </div>
    )
}

export default ItemMedia