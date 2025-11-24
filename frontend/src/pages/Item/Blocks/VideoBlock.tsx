import type { ItemBlock } from '@/types/itemBlock'
import VideoNotFound from '@/images/VideoNotFound.mp4'

type Props = {
    block: ItemBlock
}
const VideoBlock = ({block}: Props) => {
    if(block.type !== 'video') return (<></>)
    
    const url = block?.url ? (block.url) : VideoNotFound;
    return (
        <div className = 'p-2'>
            <video src = {url} width = {block.width} height = {block.height} className = 'block mx-auto' controls/>
        </div>
    )
}

export default VideoBlock