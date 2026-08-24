import { useEffect, useReducer } from 'react'
import { parseStoredTodos, todoReducer } from '../domain/todo'

const STORAGE_KEY = 'yatatodo.todos.v1'
const LEGACY_STORAGE_KEY = 'odak.todos.v1'

function loadTodos() {
  if (typeof window === 'undefined') return []
  return parseStoredTodos(
    window.localStorage.getItem(STORAGE_KEY) ?? window.localStorage.getItem(LEGACY_STORAGE_KEY),
  )
}

export function usePersistentTodos() {
  const [todos, dispatch] = useReducer(todoReducer, undefined, loadTodos)

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  return { todos, dispatch }
}
