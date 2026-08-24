import type { TodoFilter } from '../domain/todo'

const messages: Record<TodoFilter, string> = {
  all: 'Henüz görev yok.',
  active: 'Her şey tamam.',
  completed: 'Tamamlanan yok.',
}

export function EmptyState({ filter, dateFiltered = false }: { filter: TodoFilter; dateFiltered?: boolean }) {
  return (
    <div className="empty-state">
      <div className="empty-state__mark" aria-hidden="true"><span /><span /><span /></div>
      <h2>{dateFiltered ? 'Bu tarihte görev yok.' : messages[filter]}</h2>
    </div>
  )
}
