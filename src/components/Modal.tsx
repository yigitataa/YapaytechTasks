import { useEffect, type ReactNode } from 'react'

interface ModalProps {
  title: string
  description?: string
  onClose: () => void
  children: ReactNode
}

export function Modal({ title, description, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby={description ? 'modal-description' : undefined}>
        <button className="modal-close" type="button" onClick={onClose} aria-label="Pencereyi kapat">×</button>
        <div className="modal-card__heading">
          <span className="modal-card__eyebrow">Yatatodo AI</span>
          <h2 id="modal-title">{title}</h2>
          {description && <p id="modal-description">{description}</p>}
        </div>
        {children}
      </section>
    </div>
  )
}
