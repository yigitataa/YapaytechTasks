export type Priority = 'low' | 'medium' | 'high'
export type TodoFilter = 'all' | 'active' | 'completed'

export interface Todo {
  id: string
  title: string
  completed: boolean
  priority: Priority
  dueDate: string | null
  createdAt: string
  updatedAt: string
}

export interface TodoDraft {
  title: string
  priority: Priority
  dueDate: string | null
}

export type TodoAction =
  | { type: 'add'; payload: TodoDraft }
  | { type: 'toggle'; payload: { id: string } }
  | { type: 'edit'; payload: { id: string; draft: TodoDraft } }
  | { type: 'remove'; payload: { id: string } }
  | { type: 'clearCompleted' }

const priorities: Priority[] = ['low', 'medium', 'high']

export const normalizeTitle = (title: string) => title.trim().replace(/\s+/g, ' ')

export function createTodo(draft: TodoDraft): Todo {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    title: normalizeTitle(draft.title),
    completed: false,
    priority: draft.priority,
    dueDate: draft.dueDate || null,
    createdAt: now,
    updatedAt: now,
  }
}

export function todoReducer(state: Todo[], action: TodoAction): Todo[] {
  switch (action.type) {
    case 'add':
      return normalizeTitle(action.payload.title) ? [createTodo(action.payload), ...state] : state
    case 'toggle':
      return state.map((todo) =>
        todo.id === action.payload.id
          ? { ...todo, completed: !todo.completed, updatedAt: new Date().toISOString() }
          : todo,
      )
    case 'edit': {
      const title = normalizeTitle(action.payload.draft.title)
      if (!title) return state
      return state.map((todo) =>
        todo.id === action.payload.id
          ? {
              ...todo,
              title,
              priority: action.payload.draft.priority,
              dueDate: action.payload.draft.dueDate || null,
              updatedAt: new Date().toISOString(),
            }
          : todo,
      )
    }
    case 'remove':
      return state.filter((todo) => todo.id !== action.payload.id)
    case 'clearCompleted':
      return state.filter((todo) => !todo.completed)
    default:
      return state
  }
}

export function parseStoredTodos(value: string | null): Todo[] {
  if (!value) return []
  try {
    const parsed: unknown = JSON.parse(value)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item): item is Todo => {
      if (!item || typeof item !== 'object') return false
      const todo = item as Partial<Todo>
      return (
        typeof todo.id === 'string' &&
        typeof todo.title === 'string' &&
        Boolean(normalizeTitle(todo.title)) &&
        typeof todo.completed === 'boolean' &&
        priorities.includes(todo.priority as Priority) &&
        (todo.dueDate === null || typeof todo.dueDate === 'string') &&
        typeof todo.createdAt === 'string' &&
        typeof todo.updatedAt === 'string'
      )
    })
  } catch {
    return []
  }
}
