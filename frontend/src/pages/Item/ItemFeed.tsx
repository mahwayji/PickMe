import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ITEM_INFO_PATH } from '@/constants/routes'
import { axiosInstance } from '@/lib/axios';
import type { Item } from '@/types/item';
import type { ItemBlock } from '@/types/itemBlock';
import { isAxiosError } from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner';

//demo
import RacoonDance from '@/images/coolRacoon.gif'
import { Button } from '@/components/ui/button';
import { Waves } from 'lucide-react';
import Loading from '../Loading';

const demoItems: Item[] = [
  {
    id: "item-001",
    sectionId: "section-01",
    title: "Introduction to React",
    description: "A beginner-friendly overview of React components and JSX.",
    tags: ["react", "frontend", "javascript"],
    thumbnail: "https://example.com/thumbnails/react-intro.png",
    orderIndex: 1,
    blocks: [
      {
        id: "block-001",
        type: "text",
        content: "React is a JavaScript library for building user interfaces.",
      } as ItemBlock,
      {
        id: "block-002",
        type: "image",
        content: "https://example.com/images/react-logo.png",
      } as ItemBlock,
    ],
    createdAt: new Date("2024-10-01T10:00:00Z"),
    updatedAt: new Date("2024-10-05T12:00:00Z"),
  },
  {
    id: "item-002",
    sectionId: "section-02",
    title: "Advanced TypeScript",
    description: "Deep dive into TypeScript’s advanced typing features.",
    tags: ["typescript", "advanced", "frontend"],
    thumbnail: "https://example.com/thumbnails/ts-advanced.png",
    orderIndex: 2,
    blocks: [
      {
        id: "block-003",
        type: "code",
        content: "type Result<T> = { data: T; error?: string };",
      } as ItemBlock,
      {
        id: "block-004",
        type: "text",
        content: "Conditional types let you express logic in types.",
      } as ItemBlock,
    ],
    createdAt: new Date("2024-10-10T14:00:00Z"),
    updatedAt: new Date("2024-10-12T09:30:00Z"),
  },
  {
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
  },
];

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
                                <CardTitle className = 'text-lg'>
                                  profile
                                </CardTitle>
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