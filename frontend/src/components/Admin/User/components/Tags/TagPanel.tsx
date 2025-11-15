import React from "react";

export type TagPanelProps = {
  title?: string;                  // เช่น "Popular"
  tags: string[];                  // รายการแท็ก
  activeTag?: string | null;       // แท็กที่ถูกเลือก (ถ้ามี)
  onSelectTag?: (tag: string | null) => void; // คลิกซ้ำ = ยกเลิกฟิลเตอร์ (ส่ง null)
  className?: string;
};

const TagPanel: React.FC<TagPanelProps> = ({
  title = "Popular",
  tags,
  activeTag = null,
  onSelectTag,
  className = "",
}) => {
  const handleClick = (t: string) => {
    // ถ้ากดแท็กที่กำลัง active -> ยกเลิกฟิลเตอร์ (ส่ง null)
    onSelectTag?.(activeTag === t ? null : t);
  };

  return (
    <aside
      aria-label="Tag panel"
      className={[
        "rounded-2xl border border-zinc-400 p-4 shadow-sm",
        className,
      ].join(" ")}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold">
          {title}
        </h3>
      </div>

      {tags.length === 0 ? (
        <p className="text-xs text-zinc-400">
          ยังไม่มีแท็กให้เลือก
        </p>
      ) : (
        <div className="space-y-2" role="list">
          {tags.map((t) => {
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
                  "truncate", // กันแท็กยาว
                  isActive ? "ring-2 ring-zinc-400/60 dark:ring-zinc-500/60" : "",
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
