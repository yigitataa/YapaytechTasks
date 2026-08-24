import type { TodoFilter } from '../domain/todo'

interface TodoFiltersProps {
  filter: TodoFilter
  counts: { all: number; active: number; completed: number }
  onChange: (filter: TodoFilter) => void
  onClearCompleted: () => void
}

const labels: Record<TodoFilter, string> = { all: 'Tümü', active: 'Açık', completed: 'Bitti' }

export function TodoFilters({ filter, counts, onChange, onClearCompleted }: TodoFiltersProps) {
  return (
    <div className="filters-row">
      <div className="filters" role="group" aria-label="Görevleri filtrele">
        {(Object.keys(labels) as TodoFilter[]).map((value) => (
          <button
            key={value}
            className={filter === value ? 'is-active' : ''}
            type="button"
            onClick={() => onChange(value)}
            aria-pressed={filter === value}
          >
            {labels[value]} <span>{counts[value]}</span>
          </button>
        ))}
      </div>
      {counts.completed > 0 && (
        <button className="clear-button" type="button" onClick={onClearCompleted}>Temizle</button>
      )}
    </div>
  )
}
