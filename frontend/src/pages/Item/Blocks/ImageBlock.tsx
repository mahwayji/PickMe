import { MediaImage } from "@/components/utils/MediaToImage"
import type { ItemBlock } from "@/types/itemBlock"

type Props = {
    block: ItemBlock
}
const ImageBlock = ({block}: Props) => {
    if (block.type !== 'image') return(<></>)
        
    return (
        <div className = 'p-2'>
            <MediaImage mediaId = {block.url} alt = {block.alt} className = 'block mx-auto max-h-[400px] w-auto' />
        </div>
    )
}

export default ImageBlock