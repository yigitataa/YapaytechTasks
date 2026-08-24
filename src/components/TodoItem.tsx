import { useState, type FormEvent } from 'react'
import type { Priority, Todo, TodoDraft } from '../domain/todo'
import { normalizeTitle } from '../domain/todo'
import { CalendarIcon, CheckIcon, EditIcon, TrashIcon } from './Icons'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onEdit: (id: string, draft: TodoDraft) => void
  onRemove: (id: string) => void
}

const priorityLabels: Record<Priority, string> = { low: 'Düşük', medium: 'Orta', high: 'Yüksek' }

function formatDate(date: string) {
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short' }).format(new Date(`${date}T00:00:00`))
}

export function TodoItem({ todo, onToggle, onEdit, onRemove }: TodoItemProps) {
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(todo.title)
  const [priority, setPriority] = useState(todo.priority)
  const [dueDate, setDueDate] = useState(todo.dueDate ?? '')
  const [error, setError] = useState('')

  const submitEdit = (event: FormEvent) => {
    event.preventDefault()
    if (!normalizeTitle(title)) {
      setError('Görev adı boş bırakılamaz.')
      return
    }
    onEdit(todo.id, { title, priority, dueDate: dueDate || null })
    setEditing(false)
    setError('')
  }

  const cancelEdit = () => {
    setTitle(todo.title)
    setPriority(todo.priority)
    setDueDate(todo.dueDate ?? '')
    setError('')
    setEditing(false)
  }

  if (editing) {
    return (
      <li className="todo-card todo-card--editing">
        <form className="edit-form" onSubmit={submitEdit}>
          <label className="sr-only" htmlFor={`edit-${todo.id}`}>Görevi düzenle</label>
          <input id={`edit-${todo.id}`} value={title} onChange={(event) => { setTitle(event.target.value); setError('') }} autoFocus maxLength={120} aria-invalid={Boolean(error)} />
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="edit-form__options">
            <select aria-label="Öncelik" value={priority} onChange={(event) => setPriority(event.target.value as Priority)}>
              <option value="low">Düşük</option><option value="medium">Orta</option><option value="high">Yüksek</option>
            </select>
            <input aria-label="Son tarih" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
            <div className="edit-form__actions">
              <button type="button" className="button button--ghost" onClick={cancelEdit}>Vazgeç</button>
              <button type="submit" className="button button--primary">Kaydet</button>
            </div>
          </div>
        </form>
      </li>
    )
  }

  return (
    <li className={`todo-card ${todo.completed ? 'is-completed' : ''}`}>
      <button className="check-button" type="button" onClick={() => onToggle(todo.id)} aria-label={todo.completed ? `${todo.title} görevini devam ediyor yap` : `${todo.title} görevini tamamla`} aria-pressed={todo.completed}>
        {todo.completed && <CheckIcon />}
      </button>
      <div className="todo-card__content">
        <p>{todo.title}</p>
        <div className="todo-card__meta">
          <span className={`priority priority--${todo.priority}`}><i />{priorityLabels[todo.priority]}</span>
          <span className={`todo-card__date ${todo.dueDate ? '' : 'is-empty'}`}><CalendarIcon />{todo.dueDate ? formatDate(todo.dueDate) : '—'}</span>
        </div>
      </div>
      <div className="todo-card__actions">
        <button type="button" onClick={() => setEditing(true)} aria-label={`${todo.title} görevini düzenle`}><EditIcon /></button>
        <button type="button" className="danger" onClick={() => onRemove(todo.id)} aria-label={`${todo.title} görevini sil`}><TrashIcon /></button>
      </div>
    </li>
  )
}
