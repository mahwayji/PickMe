import type { ItemBlock } from '@/types/itemBlock'

type Props = {
    block: ItemBlock
}
const VideoBlock = ({block}: Props) => {
    if(block.type !== 'video') return (<></>)
    
    console.log(block.url)
    return (
        <div className = 'p-2'>
            <video src = {block.url} width = {block.width} height = {block.height} className = 'block mx-auto' controls/>
        </div>
    )
}

export default VideoBlock