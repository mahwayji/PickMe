import type { ItemBlock } from '@/types/itemBlock'
import { MediaVideo } from '@/components/utils/MediaToImage'

type Props = {
    block: ItemBlock
}
const VideoBlock = ({block}: Props) => {
    if(block.type !== 'video') return (<></>)
    
    return (
        <div className = 'p-2'>
            <MediaVideo mediaId = {block.mediaId} width = {block.width} height = {block.height} className = 'block mx-auto'/>
        </div>
    )
}

export default VideoBlock