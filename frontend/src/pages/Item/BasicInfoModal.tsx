import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { getItem, updateItem, type ItemDto } from '@/services/item'

type Props = {
  itemId: string
  open: boolean
  onClose: () => void
  onSaved?: (updated: ItemDto) => void
}

export default function BasicInfoModal({ itemId, open, onClose, onSaved }: Props) {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  // form state
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  // counters
  const titleCount = useMemo(() => `${title.length}/60`, [title])
  const descCount = useMemo(() => `${desc.length}/500`, [desc])

  useEffect(() => {
    if (!open) return
    setLoading(true)
    getItem(itemId)
      .then((it) => {
        setTitle(it.title ?? '')
        setDesc(it.description ?? '')
        setTags(it.tags ?? [])
      })
      .catch((e:any) => toast.error(e?.response?.data?.message || e?.message || 'โหลดข้อมูล Item ไม่สำเร็จ'))
      .finally(() => setLoading(false))
  }, [open, itemId])

  // tag helpers
  const addTag = () => {
    const t = tagInput.trim()
    if (!t) return
    if (tags.includes(t)) { setTagInput(''); return }
    if (tags.length >= 10) { toast.error('แท็กได้ไม่เกิน 10 รายการ'); return }
    setTags(prev => [...prev, t])
    setTagInput('')
  }
  const removeTag = (t: string) => setTags(prev => prev.filter(x => x !== t))

  // save
  const handleSave = async () => {
    if (!title.trim()) { toast.error('กรอก Title'); return }
    if (title.length > 60) { toast.error('Title เกิน 60 ตัวอักษร'); return }
    if (desc.length > 500) { toast.error('Description เกิน 500 ตัวอักษร'); return }
    if (tags.length > 10) { toast.error('แท็กเกิน 10 รายการ'); return }

    setSaving(true)
    try {
      const payload = {
        title: title.trim(),
        description: desc.trim() || undefined,
        tags: tags.length ? tags : undefined,
        // thumbnailMediaId: "To be ddcide"
      }
      const updated = await updateItem(itemId, payload)
      toast.success('บันทึกสำเร็จ')
      onSaved?.(updated)
      onClose()
    } catch (e:any) {
      toast.error(e?.response?.data?.message || e?.message || 'บันทึกไม่สำเร็จ')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      {/* panel */}
      <div className="relative z-[61] w-full max-w-[720px] overflow-hidden rounded-3xl border border-border bg-background shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 px-5 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/70">
          <button
            onClick={onClose}
            aria-label="close"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
          >
            ✕
          </button>
          <h3 className="text-base font-semibold">Item</h3>
          <Button
            onClick={handleSave}
            disabled={saving || loading}
            className="
              rounded-full px-5
              bg-black text-white hover:bg-black/90
              dark:bg-white dark:text-black dark:hover:bg-white/90
              disabled:opacity-60 disabled:pointer-events-none
            "
          >
            {saving ? 'Saving…' : 'SAVE'}
          </Button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">กำลังโหลด…</div>
          ) : (
            <div className="space-y-4">
              {/* Title */}
              <div>
                <input
                  className="w-full rounded-xl border border-border bg-background p-3 text-foreground placeholder:text-muted-foreground outline-none"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value.slice(0, 60))}
                />
                <div className="mt-1 text-right text-xs text-muted-foreground">{titleCount}</div>
              </div>

              {/* Description */}
              <div>
                <textarea
                  className="w-full min-h-[120px] rounded-xl border border-border bg-background p-3 text-foreground placeholder:text-muted-foreground outline-none"
                  placeholder="Description"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value.slice(0, 500))}
                />
                <div className="mt-1 text-right text-xs text-muted-foreground">{descCount}</div>
              </div>

              {/* Tags */}
              <div className="rounded-xl border border-border p-3">
                <input
                  className="w-full bg-background text-foreground placeholder:text-muted-foreground outline-none"
                  placeholder="Tags (กด Enter เพื่อเพิ่ม)"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag() } }}
                />
                {tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map(t => (
                      <span key={t} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-sm">
                        {t}
                        <button onClick={() => removeTag(t)} className="text-muted-foreground hover:text-foreground">✕</button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-1 text-right text-xs text-muted-foreground">{tags.length}/10</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
