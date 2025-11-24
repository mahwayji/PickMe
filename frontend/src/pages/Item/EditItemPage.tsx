import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import BasicInfoModal from './BasicInfoModal'
import { getItem } from '@/services/item'
import InsertBlockToolbar from './components/InsertBlockToolbar'
import type { TextOptions } from './components/InsertBlockToolbar'
import type { ItemDto } from '@/services/item'
import { ArrowUp, ArrowDown, Trash2 } from 'lucide-react'
import {
  listItemBlocks,
  createItemBlock,
  updateItemBlock,
  deleteItemBlock,
  reorderItemBlocks,
  uploadItemBlock,
  type BlockDto,
} from '@/services/ItemBlock'

type TextBlock = { id: string; type: 'text'; content: string; opts?: TextOptions }
type ImageBlock = { id: string; type: 'image'; url: string; caption?: string }
type VideoBlock = { id: string; type: 'video'; url: string; caption?: string }
type Block = TextBlock | ImageBlock | VideoBlock

// --- helper: debounce ---
function debounce<F extends (...args: any[]) => void>(fn: F, ms = 400) {
  let t: any
  return (...args: Parameters<F>) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), ms)
  }
}

export default function EditItemPage() {
  const { itemId = '' } = useParams()
  const nav = useNavigate()

  const [showBasicModal, setShowBasicModal] = useState(false)
  const [blocks, setBlocks] = useState<Block[]>([])
  const [title, setTitle] = useState('')
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const selectedBlock = blocks.find(b => b.id === selectedBlockId) || null

  useEffect(() => {
    async function bootstrap() {
      try {
        const it = await getItem(itemId)
        setTitle(it.title ?? '')

        // load block BE
        const serverBlocks = await listItemBlocks(itemId)
        const mapped: Block[] = serverBlocks.map((b: BlockDto) => {
          if (b.type === 'text') {
            return {
              id: b.id,
              type: 'text',
              content: b.text ?? '',
              opts: (b as any).style ?? {},
            }
          }
          if (b.type === 'image') {
            return {
              id: b.id,
              type: 'image',
              mediaId: b.mediaId,
              url: b.url,
              caption: b.caption,
            }
          }
          return {
            id: b.id,
            type: 'video',
            mediaId: b.mediaId,
            url: b.url,
            caption: b.caption,
          }
        })
        setBlocks(mapped)
      } catch (e: any) {
        toast.error(e?.response?.data?.message || e?.message || 'ไม่พบ Item')
      }
    }
    bootstrap()
  }, [itemId])

  const updateBlock = (id: string, patch: Partial<TextBlock | ImageBlock | VideoBlock>) => {
    setBlocks(prev =>
      prev.map(b => {
        if (b.id !== id) return b
        if (b.type === 'text') return { ...b, ...(patch as Partial<TextBlock>) }
        if (b.type === 'image') return { ...b, ...(patch as Partial<ImageBlock>) }
        if (b.type === 'video') return { ...b, ...(patch as Partial<VideoBlock>) }
        return b
      })
    )
  }

  const addBlock = async (
    type: Block['type'],
    opts?: TextOptions,
    file?: File,
  ): Promise<string> => {
    try {
      if (type === 'text') {
        const created = await createItemBlock(itemId, {
          type: 'text',
          text: '',
          style: opts ?? {},
        })
        setBlocks(prev => [
          ...prev,
          { id: created.id, type: 'text', content: '', opts },
        ])
        return created.id
      }

      if (type === 'image' || type === 'video') {
        if (!file) throw new Error('File is required for media block')

        const created = await uploadItemBlock(itemId, file)

        if (created.type === 'image') {
          setBlocks(prev => [
            ...prev,
            {
              id: created.id,
              type: 'image',
              mediaId: created.mediaId,
              url: created.url,
              caption: created.caption ?? file.name,
            },
          ])
        } else if (created.type === 'video') {
          setBlocks(prev => [
            ...prev,
            {
              id: created.id,
              type: 'video',
              mediaId: created.mediaId,
              url: created.url,
              caption: created.caption ?? file.name,
            },
          ])
        } else {
          console.error('Unexpected block type from upload', created)
        }

        return created.id
      }

      throw new Error('Unsupported block type in addBlock()')
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message || e?.message || 'Fail to Create Block',
      )
      throw e
    }
  }

  // autosave: text & style
  const debouncedUpdateText = useMemo(
    () =>
      debounce(async (blockId: string, text: string) => {
        try {
          await updateItemBlock(itemId, blockId, { type: 'text', text })
        } catch {
          toast.error('Fail to save text')
        }
      }, 400),
    [itemId],
  )

  const debouncedUpdateStyle = useMemo(
    () =>
      debounce(async (blockId: string, text: string, style?: any) => {
        try {
          await updateItemBlock(itemId, blockId, { type: 'text', text, style })
        } catch {
          toast.error('Fail to save style')
        }
      }, 400),
    [itemId],
  )

  const removeBlock = async (id: string) => {
    try {
      await deleteItemBlock(itemId, id)
      const next = blocks.filter(b => b.id !== id)
      setBlocks(next)
      if (selectedBlockId === id) setSelectedBlockId(null)
      if (next.length) {
        await reorderItemBlocks(itemId, next.map(b => b.id))
      }
    } catch (e: any) {
      toast.error(e?.response?.data?.message || e?.message || 'Fail to delete')
    }
  }

  const moveBlock = async (id: string, direction: 'up' | 'down') => {
    setBlocks(prev => {
      const idx = prev.findIndex(b => b.id === id)
      if (idx === -1) return prev

      const targetIndex = direction === 'up' ? idx - 1 : idx + 1
      if (targetIndex < 0 || targetIndex >= prev.length) return prev

      const next = [...prev]
      const tmp = next[idx]
      next[idx] = next[targetIndex]
      next[targetIndex] = tmp

      reorderItemBlocks(itemId, next.map(b => b.id)).catch((e: any) => {
        console.error('reorder failed', e)
        toast.error(e?.response?.data?.message || e?.message || 'Cant rearrange')
      })

      return next
    })
  }

  return (
    <div className="ml-40 flex h-screen bg-background text-foreground ">
      {/* Toolbar */}
      <div>
        <InsertBlockToolbar
          selectedBlockId={selectedBlockId}
          externalView={
            selectedBlock?.type === 'text'
              ? 'text'
              : selectedBlock?.type === 'image'
              ? 'menu'
              : selectedBlock?.type === 'video'
              ? 'menu'
              : 'menu'
          }
          initialText={selectedBlock?.type === 'text' ? selectedBlock.opts ?? null : null}
          onInsertText={async (opts) => {
            const id = await addBlock('text', opts)
            setSelectedBlockId(id)
          }}
          onInsertImage={async (file) => {
            const id = await addBlock('image', undefined, file)
            setSelectedBlockId(id)
          }}
          onInsertVideo={async (file) => {
            const id = await addBlock('video', undefined, file)
            setSelectedBlockId(id)
          }}
          onLiveChangeText={(opts) => {
            if (!selectedBlockId) return

            setBlocks(prev => {
              let currentText = ''
              let mergedStyle: TextOptions | undefined

              const next = prev.map(b => {
                if (b.id !== selectedBlockId || b.type !== 'text') return b
                mergedStyle = { ...(b.opts ?? {}), ...(opts ?? {}) }
                currentText = b.content
                return { ...b, opts: mergedStyle }
              })

              if (mergedStyle) {
                debouncedUpdateStyle(selectedBlockId, currentText, mergedStyle)
              }

              return next
            })
          }}
          onCloseRequested={() => setSelectedBlockId(null)}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex w-full justify-center">
          <div className="w-full max-w-[1250px] px-8">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/70">
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => nav(-1)} className="rounded-full px-4">
                  CANCEL
                </Button>
              </div>
              <div className="truncate px-2 text-sm text-muted-foreground">
                {title || 'Add title…'}
              </div>
              <Button
                onClick={() => setShowBasicModal(true)}
                className="rounded-full border border-border bg-black px-5 text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
              >
                CONTINUE
              </Button>
            </div>

            {/* Body */}
            <div className="py-6">
              {/* Title */}
              <div className="mb-6">
                <input
                  className="w-full border-b border-border bg-transparent px-2 py-3 text-2xl font-semibold outline-none placeholder:text-muted-foreground"
                  placeholder="Add title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Blocks */}
              <div className="space-y-4">
                {blocks.map((b) => (
                  <div
                    key={b.id}
                    className={`cursor-pointer rounded-xl border border-border p-4 ${selectedBlockId === b.id ? 'ring-2 ring-ring' : ''}`}
                    onClick={() => setSelectedBlockId(b.id)}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs uppercase text-muted-foreground">{b.type}</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            moveBlock(b.id, 'up')
                          }}
                          className="p-1 rounded-md hover:bg-muted"
                        >
                          <ArrowUp className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            moveBlock(b.id, 'down')
                          }}
                          className="p-1 rounded-md hover:bg-muted"
                        >
                          <ArrowDown className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        </button>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeBlock(b.id) }}
                        className="p-1 rounded-md hover:bg-red-500/10"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>

                    {b.type === 'text' && (
                      <textarea
                        className="w-full min-h-[160px] rounded-lg border border-border bg-background p-3 outline-none placeholder:text-muted-foreground"
                        placeholder="Write something…"
                        value={b.content}
                        onChange={(e) => {
                          const val = e.target.value
                          updateBlock(b.id, { content: val })
                          debouncedUpdateText(b.id, val)
                        }}
                        style={{
                          fontFamily: b.opts?.font,
                          fontStyle: b.opts?.italic ? 'italic' : 'normal',
                          textDecoration: b.opts?.underline ? 'underline' : 'none',
                          fontWeight: b.opts?.weight as any,
                          fontSize: b.opts?.size ? `${b.opts?.size}px` : undefined,
                          color: b.opts?.color,
                          textAlign: b.opts?.align || 'left',
                        }}
                      />
                    )}

                    {b.type === 'image' && (
                      <div className="flex flex-col items-center gap-2">
                        {b.url ? (
                          <img
                            src={b.url}
                            alt={b.caption || ''}
                            className="max-h-80 w-auto rounded-lg border border-border object-contain"
                          />
                        ) : (
                          <div className="flex h-40 w-full items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
                            Uploading…
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          {b.caption || 'Image'}
                        </div>
                      </div>
                    )}

                    {b.type === 'video' && (
                      <div className="rounded-lg border border-dashed border-border p-4">
                        {b.url ? (
                          <video
                            src={b.url}
                            controls
                            className="mx-auto mb-2 max-h-96"
                          />
                        ) : (
                          <div className="flex h-40 w-full items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
                            Uploading…
                          </div>
                        )}
                        {b.caption && (
                          <div className="text-center text-sm text-muted-foreground">
                            {b.caption || 'Video'}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <BasicInfoModal
        itemId={itemId}
        open={showBasicModal}
        onClose={() => setShowBasicModal(false)}
        onSaved={(updated: ItemDto) => {
          if (updated.title !== undefined) setTitle(updated.title)
          {nav(-1)}
        }}
      />
    </div>
  )
}
