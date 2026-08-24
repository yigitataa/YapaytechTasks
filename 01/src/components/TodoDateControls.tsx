import { CalendarIcon } from './Icons'

export type TodoSort = 'default' | 'dueAsc' | 'dueDesc'

interface TodoDateControlsProps {
  selectedDate: string
  sort: TodoSort
  onDateChange: (date: string) => void
  onSortChange: (sort: TodoSort) => void
}

export function TodoDateControls({ selectedDate, sort, onDateChange, onSortChange }: TodoDateControlsProps) {
  return (
    <div className="date-controls" aria-label="Tarih araçları">
      <label className="date-control date-control--sort">
        <span className="sr-only">Tarihe göre sırala</span>
        <select value={sort} onChange={(event) => onSortChange(event.target.value as TodoSort)}>
          <option value="default">Sıralama</option>
          <option value="dueAsc">Yakın tarih</option>
          <option value="dueDesc">Uzak tarih</option>
        </select>
      </label>
      <label className="date-control date-control--filter">
        <CalendarIcon />
        <span className="sr-only">Tarihe göre filtrele</span>
        <input type="date" value={selectedDate} onChange={(event) => onDateChange(event.target.value)} />
      </label>
      {selectedDate && (
        <button className="date-clear" type="button" onClick={() => onDateChange('')} aria-label="Tarih filtresini temizle">×</button>
      )}
    </div>
  )
}
