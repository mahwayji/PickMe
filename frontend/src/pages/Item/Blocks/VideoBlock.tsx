import type { ItemBlock } from '@/types/itemBlock'

type Props = {
    block: ItemBlock
}
const VideoBlock = ({block}: Props) => {
    if(block.type !== 'video') return (<></>)

    return (
        <div className = 'p-2'>VideoBlock</div>
    )
}

export default VideoBlock