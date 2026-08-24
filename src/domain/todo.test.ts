import { describe, expect, it, vi } from 'vitest'
import { normalizeTitle, parseStoredTodos, todoReducer, type Todo } from './todo'

const todo: Todo = {
  id: '1', title: 'Test yaz', completed: false, priority: 'medium', dueDate: null,
  createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z',
}

describe('todo domain', () => {
  it('başlıktaki gereksiz boşlukları temizler', () => {
    expect(normalizeTitle('  Bir   görev  ')).toBe('Bir görev')
  })

  it('boş görev eklemez', () => {
    expect(todoReducer([todo], { type: 'add', payload: { title: '   ', priority: 'low', dueDate: null } })).toEqual([todo])
  })

  it('görevin tamamlanma durumunu değiştirir', () => {
    vi.setSystemTime(new Date('2026-01-02'))
    const result = todoReducer([todo], { type: 'toggle', payload: { id: '1' } })
    expect(result[0].completed).toBe(true)
  })

  it('bozuk depolama verisini güvenle reddeder', () => {
    expect(parseStoredTodos('{bozuk')).toEqual([])
    expect(parseStoredTodos(JSON.stringify([{ id: 1 }]))).toEqual([])
  })
})
