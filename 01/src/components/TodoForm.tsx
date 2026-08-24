import { useId, useState, type FormEvent } from 'react'
import type { Priority, TodoDraft } from '../domain/todo'
import { normalizeTitle } from '../domain/todo'
import { PlusIcon } from './Icons'

interface TodoFormProps {
  onAdd: (draft: TodoDraft) => void
}

function getToday() {
  const now = new Date()
  const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
  return localTime.toISOString().slice(0, 10)
}

export function TodoForm({ onAdd }: TodoFormProps) {
  const inputId = useId()
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState<Priority | ''>('')
  const [dueDate, setDueDate] = useState(getToday)
  const [error, setError] = useState<{ field: 'title' | 'priority'; message: string } | null>(null)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!normalizeTitle(title)) {
      setError({ field: 'title', message: 'Lütfen bir görev yazın.' })
      return
    }
    if (!priority) {
      setError({ field: 'priority', message: 'Lütfen öncelik seçin.' })
      return
    }
    onAdd({ title, priority, dueDate: dueDate || null })
    setTitle('')
    setPriority('')
    setDueDate(getToday())
    setError(null)
  }

  return (
    <form className="composer" onSubmit={handleSubmit} noValidate>
      <div className="composer__fields">
        <label className={`field-card field-card--task ${error?.field === 'title' ? 'is-invalid' : ''}`} htmlFor={inputId}>
          <input
            id={inputId}
            aria-label="Yeni görev"
            value={title}
            onChange={(event) => {
              setTitle(event.target.value)
              if (error?.field === 'title') setError(null)
            }}
            placeholder="Bir görev yaz..."
            aria-describedby={error?.field === 'title' ? `${inputId}-error` : undefined}
            aria-invalid={error?.field === 'title'}
            maxLength={120}
            autoComplete="off"
          />
        </label>
        <label className={`field-card field-card--priority ${error?.field === 'priority' ? 'is-invalid' : ''}`}>
          <select
            aria-label="Öncelik"
            aria-describedby={error?.field === 'priority' ? `${inputId}-error` : undefined}
            aria-invalid={error?.field === 'priority'}
            value={priority}
            onChange={(event) => {
              setPriority(event.target.value as Priority)
              if (error?.field === 'priority') setError(null)
            }}
          >
            <option value="" disabled hidden>Öncelik</option>
            <option value="low">Düşük</option>
            <option value="medium">Orta</option>
            <option value="high">Yüksek</option>
          </select>
        </label>
        <label className="field-card">
          <span className="field-card__label">Tarih</span>
          <input type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
        </label>
        <button className="button button--primary composer__submit" type="submit">
          <PlusIcon /> <span>Ekle</span>
        </button>
      </div>
      {error && <p className="form-error" id={`${inputId}-error`} role="alert">{error.message}</p>}
    </form>
  )
}
