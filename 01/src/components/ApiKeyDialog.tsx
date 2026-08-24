import { useEffect, useState, type FormEvent } from 'react'
import { Modal } from './Modal'

interface ApiKeyDialogProps {
  currentKey: string
  onSave: (key: string) => void
  onClose: () => void
}

export function ApiKeyDialog({ currentKey, onSave, onClose }: ApiKeyDialogProps) {
  const [value, setValue] = useState(currentKey)

  useEffect(() => setValue(currentKey), [currentKey])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSave(value)
  }

  return (
    <Modal title="Gemini API anahtarı" description="Planlama isteğini Gemini Flash modellerine göndermek için anahtarını kaydet." onClose={onClose}>
      <form className="modal-form" onSubmit={handleSubmit}>
        <label className="modal-field">
          <span>API key</span>
          <input
            type="password"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="AIza..."
            autoComplete="off"
            autoFocus
          />
        </label>
        <p className="modal-note">Anahtar yalnızca bu tarayıcıda saklanır. Tarayıcı tabanlı bir uygulamada tamamen gizlenemez; üretimde alan adı ve kota kısıtı kullan.</p>
        <div className="modal-actions">
          {currentKey && <button className="button button--ghost" type="button" onClick={() => onSave('')}>Anahtarı sil</button>}
          <button className="button button--primary" type="submit" disabled={!value.trim()}>Kaydet</button>
        </div>
      </form>
    </Modal>
  )
}
