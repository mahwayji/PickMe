import { useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, Droplets } from 'lucide-react'

export type TextOptions = {
  font?: string
  weight?: string | number
  size?: number
  color?: string
  align?: 'left' | 'center' | 'right'
  italic?: boolean
  underline?: boolean
}

type View = 'menu' | 'text' | 'image' | 'video'

type Props = {
  // insert
  onInsertText: (opts: TextOptions) => void
  onInsertImage: (file: File) => void
  onInsertVideo: (file: File) => void

  // control from parent
  selectedBlockId: string | null
  externalView?: View | null
  initialText?: TextOptions | null

  // live update
  onLiveChangeText?: (opts: TextOptions) => void

  onCloseRequested?: () => void
}

export default function InsertBlockToolbar({
  onInsertText, onInsertImage, onInsertVideo,
  selectedBlockId, externalView, initialText,
  onLiveChangeText, onCloseRequested,
}: Props) {
  const [view, setView] = useState<View>('menu')

  // local text state
  const [font, setFont] = useState('Inter')
  const [weight, setWeight] = useState('400')
  const [size, setSize] = useState('20')
  const [color, setColor] = useState('000000')
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('left')
  const [italic, setItalic] = useState(false)
  const [underline, setUnderline] = useState(false)

  const lastSelectedIdRef = useRef<string | null>(null)

  useEffect(() => {
    if (externalView) setView(externalView)
  }, [externalView])

  const normalizeWeight = (w?: string | number): string => {
    const s = String(w ?? '400')
    const namedMap: Record<string, string> = {
      light: '300',
      regular: '400',
      bold: '700',
    }
    const key = s.toLowerCase()
    if (namedMap[key]) return namedMap[key]
    const n = parseInt(s, 10)
    if ([300,400,700].includes(n)) return String(n)
    return '400'
  }

  useEffect(() => {
    if (selectedBlockId && selectedBlockId !== lastSelectedIdRef.current) {
      lastSelectedIdRef.current = selectedBlockId
      if (initialText) {
        setFont(initialText.font ?? 'Inter')
        setWeight(normalizeWeight(initialText.weight))
        setSize(String(initialText.size ?? '20'))
        setColor((initialText.color ?? '#000000').replace('#',''))
        setAlign(initialText.align ?? 'left')
        setItalic(!!initialText.italic)
        setUnderline(!!initialText.underline)
      } else {
        setFont('Inter'); setWeight('400'); setSize('20'); setColor('000000')
        setAlign('left'); setItalic(false); setUnderline(false)
      }
    }
    if (!selectedBlockId) {
      lastSelectedIdRef.current = null
    }
  }, [selectedBlockId, initialText])

  const weightOptions = [
    { label: 'Light',      value: '300' },
    { label: 'Regular',    value: '400' },
    { label: 'Bold',       value: '700' },
  ]
  const sizeOptions = ['12','14','16','18','20','24','28','32','36','48','64']
  const fontOptions = ['Inter','Prompt','Kanit','Sarabun','Roboto','Poppins','Noto Sans Thai']

  const composedText = useMemo<TextOptions>(() => ({
    font,
    weight,
    size: Number(size),
    color: color?.startsWith('#') ? color : `#${color}`,
    align,
    italic,
    underline,
  }), [font, weight, size, color, align, italic, underline])

  useEffect(() => {
    if (view === 'text') onLiveChangeText?.(composedText)
  }, [view, composedText, onLiveChangeText])

  const backToMenu = () => { onCloseRequested?.(); setView('menu') }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[340px] border-r border-border bg-background px-6 pt-6 text-foreground">
      {view === 'menu' && (
        <div className="space-y-6">
          <div className="text-sm font-medium">Insert Block</div>

          <button
            className="block text-left text-base transition-transform hover:scale-[1.05]"
            onClick={() => { onInsertText(composedText); setView('text') }}
          >
            ▸ Text
          </button>

          <button
            className="block text-left text-base transition-transform hover:scale-[1.05]"
            onClick={() => document.getElementById('pm-image-input')?.click()}
          >
            ▸ Image
          </button>
          <input
            id="pm-image-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onInsertImage(f); (e.currentTarget.value = '') }}
          />

          <button
            className="block text-left text-base transition-transform hover:scale-[1.05]"
            onClick={() => document.getElementById('pm-video-input')?.click()}
          >
            ▸ Video
          </button>
          <input
            id="pm-video-input"
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onInsertVideo(f); (e.currentTarget.value = '') }}
          />
        </div>
      )}

      {view === 'text' && (
        <div className="space-y-5">
          <button
            onClick={backToMenu}
            className="inline-flex items-center gap-2 text-sm hover:underline"
          >
            <ChevronLeft className="h-4 w-4" /> Text Edit
          </button>

          {/* Font family */}
          <select
            className="w-full rounded-2xl border border-border bg-background p-2 outline-none"
            value={font}
            onChange={(e)=>setFont(e.target.value)}
          >
            {fontOptions.map(f => <option key={f} value={f}>{f}</option>)}
          </select>

          {/* Weight + Size */}
          <div className="grid grid-cols-2 gap-3">
            <select
              className="w-full rounded-2xl border border-border bg-background p-2 outline-none"
              value={weight}
              onChange={(e)=>setWeight(normalizeWeight(e.target.value))}
            >
              {weightOptions.map(w => (
                <option key={w.value} value={w.value}>{w.label}</option>
              ))}
            </select>

            <select
              className="w-full rounded-2xl border border-border bg-background p-2 outline-none"
              value={size}
              onChange={(e)=>setSize(e.target.value)}
            >
              {sizeOptions.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Color */}
          <div className="flex items-center rounded-2xl border border-border bg-background">
            <div className="px-3 text-muted-foreground"><Droplets className="h-4 w-4" /></div>
            <input
              className="flex-1 bg-transparent p-2 outline-none"
              placeholder="000000"
              value={color}
              onChange={(e)=> setColor(e.target.value.replace(/[^0-9a-fA-F#]/g,''))}
            />
          </div>

          {/* Align */}
          <div className="inline-flex overflow-hidden rounded-2xl border border-border">
            {(['left','center','right'] as const).map(a => (
              <button
                key={a}
                className={`px-4 py-2 text-sm ${align===a ? 'bg-muted' : 'hover:bg-muted'}`}
                onClick={()=>setAlign(a)}
              >
                {a === 'left' ? '≡' : a === 'center' ? '≣' : '≡'}
              </button>
            ))}
          </div>

          {/* Decorations */}
          <div className="inline-flex overflow-hidden rounded-2xl border border-border">
            <button
              className={`px-4 py-2 text-sm italic ${italic ? 'bg-muted' : 'hover:bg-muted'}`}
              onClick={()=>setItalic(v=>!v)}
            >
              I
            </button>
            <button
              className={`px-4 py-2 text-sm ${underline ? 'bg-muted' : 'hover:bg-muted'}`}
              onClick={()=>setUnderline(v=>!v)}
            >
              Aa
            </button>
          </div>
        </div>
      )}

      {view === 'image' && (
        <div className="space-y-4">
          <button
            onClick={() => { onCloseRequested?.(); setView('menu') }}
            className="inline-flex items-center gap-2 text-sm hover:underline"
          >
            <ChevronLeft className="h-4 w-4" /> Insert Image
          </button>
          <input
            type="file"
            accept="image/*"
            className="block w-full text-sm"
            onChange={(e)=>{ const f = e.target.files?.[0]; if (f) onInsertImage(f) }}
          />
        </div>
      )}

      {view === 'video' && (
        <div className="space-y-4">
          <button
            onClick={() => { onCloseRequested?.(); setView('menu') }}
            className="inline-flex items-center gap-2 text-sm hover:underline"
          >
            <ChevronLeft className="h-4 w-4" /> Insert Video
          </button>
          <input
            type="file"
            accept="video/*"
            className="block w-full text-sm"
            onChange={(e)=>{ const f = e.target.files?.[0]; if (f) onInsertVideo(f) }}
          />
        </div>
      )}
    </aside>
  )
}
