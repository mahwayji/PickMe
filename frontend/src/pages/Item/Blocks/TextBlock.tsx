import type { ItemBlock } from "@/types/itemBlock";

type Props = {
    block: ItemBlock
}
const textBlock = ({block}: Props) => {
    if(block.type !== 'text') return (<></>)
    // will need to comeback and check with the input again
    const style = `${block.style?.fontSize ? `text-[${block.style.fontSize}] ` : ''}${block.style?.fontWeight ? `font-${block.style?.fontWeight} `: ''}${block.style?.color ? `text-[${block.style?.color}] ` : ''}${block.style?.lineHeight ? `leading-${block.style?.lineHeight}` : '' }`

    console.log(style)
    return (
        <div className = 'p-2'>
            <div className = {style}>
                {block.text}
            </div>
        </div>
    )
}

export default textBlock