import { type ItemBlock } from '@/types/itemBlock'
import React, { useContext } from 'react'

type Props = {
    items: ItemBlock[]
}
const ItemBlocks: React.FC<Props> = ({ items }: Props) => {
    
    return (
        <div>ItemBlocks</div>
    )
}

export default ItemBlocks