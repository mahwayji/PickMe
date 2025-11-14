import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Modal from '@/components/modal'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { createItem } from '@/services/item'

export default function CreateItemModal() {
  const {sectionId = '' } = useParams()
  const nav = useNavigate()

  const [file, setFile] = useState<File | null>(null) // wait for real upload
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [saving, setSaving] = useState(false)

  const titleCount = useMemo(() => `${title.length}/60`, [title])
  const descCount = useMemo(() => `${desc.length}/500`, [desc])
  
  const onClose = () => nav(-1)

  const addTag = () => {
    const t = tagInput.trim()
    if (!t) return
    if (tags.includes(t)) return setTagInput('')
    if (tags.length >= 10) return toast.error('แท็กได้ไม่เกิน 10 รายการ')
    setTags([...tags, t]); setTagInput('')
  }
  const removeTag = (t: string) => setTags(tags.filter(x => x !== t))

  const onSave = async () => {
    if (!title.trim()) { toast.error('กรอกชื่อไอเท็ม'); return }
    setSaving(true)
    try {
      const payload = {
        title: title.trim().slice(0, 60),
        description: desc.trim() ? desc.trim().slice(0, 500) : undefined,
        tags: tags.length ? tags : undefined,
        thumbnail: file ? file: undefined,
      }
      await createItem(sectionId, payload)
      toast.success('สร้าง Item สำเร็จ!')
      onClose()
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || 'บันทึกไม่สำเร็จ')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open onClose={onClose}>
      {/* Header - SAVE */}
      <div className="sticky top-0 z-[1] flex items-center justify-between rounded-t-3xl border-b border-border bg-background/95 p-4 sm:p-5 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <button
          onClick={onClose}
          aria-label="close"
          className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted"
        >
          ✕
        </button>
        <h3 className="text-base font-semibold">Item</h3>
        <Button
          onClick={onSave}
          disabled={saving}
          className="
            rounded-full px-5
            bg-black text-white hover:bg-black/90
            dark:bg-white dark:text-black dark:hover:bg-white/90
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
            disabled:opacity-60 disabled:pointer-events-none
          "
        >
          {saving ? 'Saving…' : 'SAVE'}
        </Button>
      </div>

      {/* Body */}
      <div className="px-4 pb-6 pt-2 sm:px-5 space-y-4">
        {/* Thumbnail */}
        <label
          className="block rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground hover:border-foreground/40 cursor-pointer"
        >
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
          />
          <div className="space-y-2">
            <div className="text-sm">
              {file ? file.name : 'Select/Drop Thumbnail'}
            </div>
          </div>
        </label>

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
            className="w-full rounded-xl border border-border bg-background p-3 text-foreground placeholder:text-muted-foreground outline-none min-h-[140px]"
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
    </Modal>
  )
}
