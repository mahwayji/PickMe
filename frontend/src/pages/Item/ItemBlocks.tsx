import { type ItemBlock } from '@/types/itemBlock'
import React from 'react'
import TextBlock from './Blocks/TextBlock'
import ImageBlock from './Blocks/ImageBlock'
import VideoBlock from './Blocks/VideoBlock'

type Props = {
    items: ItemBlock[]
}

const ItemBlocks: React.FC<Props> = ({ items }: Props) => {
    console.log(items)
    if(!items) return <></>
    return (
        <div className = 'p-2'>
            {(items).map((block) =>{
                if(block.type === 'text')
                    return (
                        < TextBlock block = {block}/>
                )

                else if (block.type === 'image')
                    return (
                        < ImageBlock block = {block}/>
                )
                else if (block.type === 'video')
                    return (
                        < VideoBlock block = {block}/>
                )
            })}
        </div>
    )
}

export default ItemBlocks