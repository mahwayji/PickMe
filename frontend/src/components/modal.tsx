import { useEffect } from 'react'
import { createPortal } from 'react-dom'

type Props = { open: boolean; onClose: () => void; children: React.ReactNode }

export default function Modal({ open, onClose, children }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[1000]">
      <div className="absolute inset-0 bg-black/60 dark:bg-black/70" onClick={onClose} />
      <div className="absolute inset-0 flex items-start justify-center p-4 sm:p-8">
        <div
          className="relative w-full max-w-2xl rounded-3xl border border-border bg-background text-foreground shadow-2xl"
          role="dialog"
          aria-modal="true"
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
