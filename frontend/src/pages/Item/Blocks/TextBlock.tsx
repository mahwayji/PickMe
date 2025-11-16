import type { CSSProperties } from "react";
import type { ItemBlock } from "@/types/itemBlock";

type Props = {
  block: ItemBlock;
};

export default function TextBlock({ block }: Props) {
  if (block.type !== "text") return null;

  const s = block.style || {};

  let fontWeight: CSSProperties["fontWeight"] = undefined;
  if (s.weight === "light") fontWeight = 300;
  else if (s.weight === "regular") fontWeight = 400;
  else if (s.weight === "bold") fontWeight = 700;

  const style: CSSProperties = {
    fontFamily: s.font,
    fontSize: s.size ? `${s.size}px` : undefined,
    color: s.color,
    fontStyle: s.italic ? "italic" : undefined,
    textDecoration: s.underline ? "underline" : undefined,
    fontWeight,
    textAlign: s.align,
  };

  return (
    <div className="p-2">
      <div style={style}>
        {block.text}
      </div>
    </div>
  );
}
