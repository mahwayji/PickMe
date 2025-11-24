import React, { useState, useMemo } from "react";

export type TagPanelProps = {
  title?: string;
  popularTags: string[];           // แท็กหมวด Popular
  newTags?: string[];              // แท็กหมวด New & Noteworthy (ถ้าไม่ส่งมา จะถือว่าไม่มีหมวดนี้)
  activeTag?: string | null;
  onSelectTag?: (tag: string) => void;
  className?: string;
};

type TagGroup = "popular" | "new";

const TagPanel: React.FC<TagPanelProps> = ({
  title = "Tags",
  popularTags,
  newTags,
  activeTag = '',
  onSelectTag,
  className = "",
}) => {
  const [search, setSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState<TagGroup>("popular");

  const handleClick = (t: string) => {
    onSelectTag?.(activeTag === t ? '' : t);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  // เลือก base tags ตาม group ที่เลือก
  const baseTags = useMemo(() => {
    if (activeGroup === "popular" || !newTags || newTags.length === 0) {
      return popularTags;
    }
    return newTags;
  }, [activeGroup, popularTags, newTags]);

  // filter จาก search
  const filteredTags = useMemo(() => {
    if (!search.trim()) return baseTags;
    const q = search.toLowerCase();
    return baseTags.filter((t) => t.toLowerCase().includes(q));
  }, [baseTags, search]);

  const hasNewGroup = !!newTags && newTags.length > 0;

  return (
    <aside
      aria-label="Tag panel"
      className={[
        "rounded-2xl border border-zinc-400 p-4 shadow-sm",
        className,
      ].join(" ")}
    >
      {/* Header + group switch */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{title}</h3>

        {hasNewGroup && (
          <div className="inline-flex rounded-full border border-zinc-400 text-[10px]">
            <button
              type="button"
              onClick={() => setActiveGroup("popular")}
              className={[
                "px-2 py-1 rounded-full transition",
                activeGroup === "popular"
                  ? "bg-zinc-400 text-black"
                  : "text-zinc-500",
              ].join(" ")}
            >
              Popular
            </button>
            <button
              type="button"
              onClick={() => setActiveGroup("new")}
              className={[
                "px-2 py-1 rounded-full transition",
                activeGroup === "new"
                  ? "bg-zinc-400 text-black"
                  : "text-zinc-500",
              ].join(" ")}
            >
              New &amp; Noteworthy
            </button>
          </div>
        )}
      </div>

      {/* search */}
      <div className="mb-3">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search tags..."
          className="w-full rounded-lg border border-zinc-400 px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-zinc-500"
        />
      </div>

      {/* tags */}
      {filteredTags.length === 0 ? (
        <p className="text-xs text-zinc-400">Tag not found.</p>
      ) : (
        <div className="space-y-2" role="list">
          {filteredTags.map((t) => {
            const isActive = activeTag === t;
            return (
              <button
                key={t}
                type="button"
                title={t}
                aria-pressed={isActive}
                onClick={() => handleClick(t)}
                className={[
                  "w-full rounded-lg border px-3 py-1.5 text-left text-xs transition",
                  "border-zinc-400 hover:bg-zinc-400",
                  "truncate",
                  isActive
                    ? "ring-2 ring-zinc-400/60 dark:ring-zinc-500/60"
                    : "",
                ].join(" ")}
              >
                {t}
              </button>
            );
          })}
        </div>
      )}
    </aside>
  );
};

export default TagPanel;
