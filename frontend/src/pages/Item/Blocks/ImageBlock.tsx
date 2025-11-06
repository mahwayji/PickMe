import type { ItemBlock } from "@/types/itemBlock"

type Props = {
    block: ItemBlock
}
const ImageBlock = ({block}: Props) => {
    if (block.type !== 'image') return(<></>)
        
    return (
        <div className = 'p-2'>ImageBlock</div>
    )
}

export default ImageBlock