import { useEffect, useMemo, useState } from 'react'
import { ApiKeyDialog } from './components/ApiKeyDialog'
import { EmptyState } from './components/EmptyState'
import { PlanTimeline } from './components/PlanTimeline'
import { PlanningDialog } from './components/PlanningDialog'
import { TodoFilters } from './components/TodoFilters'
import { TodoForm } from './components/TodoForm'
import { TodoItem } from './components/TodoItem'
import { TodoDateControls, type TodoSort } from './components/TodoDateControls'
import type { TodoFilter } from './domain/todo'
import { useGeminiApiKey } from './hooks/useGeminiApiKey'
import { usePersistentTodos } from './hooks/usePersistentTodos'
import { createDailyPlan, type DailyPlan } from './services/geminiPlanner'

function getToday() {
  const now = new Date()
  const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60_000)
  return localTime.toISOString().slice(0, 10)
}

export default function App() {
  const { todos, dispatch } = usePersistentTodos()
  const { apiKey, saveApiKey } = useGeminiApiKey()
  const [filter, setFilter] = useState<TodoFilter>('all')
  const [selectedDate, setSelectedDate] = useState('')
  const [sort, setSort] = useState<TodoSort>('default')
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false)
  const [isPlannerOpen, setIsPlannerOpen] = useState(false)
  const [openPlannerAfterKey, setOpenPlannerAfterKey] = useState(false)
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null)

  const todayTasks = useMemo(() => todos.filter((todo) => (
    !todo.completed && todo.dueDate === getToday()
  )), [todos])

  useEffect(() => setDailyPlan(null), [todos])

  const counts = useMemo(() => ({
    all: todos.length,
    active: todos.filter((todo) => !todo.completed).length,
    completed: todos.filter((todo) => todo.completed).length,
  }), [todos])

  const visibleTodos = useMemo(() => {
    const filtered = todos.filter((todo) => {
      if (selectedDate && todo.dueDate !== selectedDate) return false
      if (filter === 'active') return !todo.completed
      if (filter === 'completed') return todo.completed
      return true
    })

    if (sort === 'default') return filtered
    return [...filtered].sort((left, right) => {
      if (!left.dueDate && !right.dueDate) return 0
      if (!left.dueDate) return 1
      if (!right.dueDate) return -1
      return sort === 'dueAsc'
        ? left.dueDate.localeCompare(right.dueDate)
        : right.dueDate.localeCompare(left.dueDate)
    })
  }, [filter, selectedDate, sort, todos])

  const openPlanner = () => {
    if (!apiKey) {
      setOpenPlannerAfterKey(true)
      setIsApiKeyOpen(true)
      return
    }
    setIsPlannerOpen(true)
  }

  const handleSaveApiKey = (key: string) => {
    saveApiKey(key)
    setIsApiKeyOpen(false)
    if (key.trim() && openPlannerAfterKey) setIsPlannerOpen(true)
    setOpenPlannerAfterKey(false)
  }

  return (
    <div className="app-shell">
      <main id="main">
        <section className="hero" aria-labelledby="page-title">
          <div className="hero__identity">
            <div className="page-icon" aria-hidden="true">✓</div>
            <h1 id="page-title">Yatatodo</h1>
          </div>
          <div className="hero__actions">
            <button className="api-key-button" type="button" onClick={() => {
              setOpenPlannerAfterKey(false)
              setIsApiKeyOpen(true)
            }}>{apiKey ? 'API anahtarı kayıtlı' : 'API anahtarı'}</button>
            <button className="button button--primary planning-button" type="button" onClick={openPlanner}>
              <span>Bir planlama oluştur</span>
            </button>
          </div>
        </section>

        <section className="workspace" aria-label="Görev yönetimi">
          <aside className="task-entry-panel" aria-label="Yeni görev ekle">
            <TodoForm onAdd={(draft) => dispatch({ type: 'add', payload: draft })} />
          </aside>
          <div className="task-list-panel">
            <div className="task-toolbar">
              <TodoFilters filter={filter} counts={counts} onChange={setFilter} onClearCompleted={() => dispatch({ type: 'clearCompleted' })} />
              <TodoDateControls selectedDate={selectedDate} sort={sort} onDateChange={setSelectedDate} onSortChange={setSort} />
            </div>
            {visibleTodos.length > 0 ? (
              <ul className="todo-list">
                {visibleTodos.map((todo) => (
                  <TodoItem key={todo.id} todo={todo} onToggle={(id) => dispatch({ type: 'toggle', payload: { id } })} onEdit={(id, draft) => dispatch({ type: 'edit', payload: { id, draft } })} onRemove={(id) => dispatch({ type: 'remove', payload: { id } })} />
                ))}
              </ul>
            ) : <EmptyState filter={filter} dateFiltered={Boolean(selectedDate)} />}
            {dailyPlan && <PlanTimeline plan={dailyPlan} onClear={() => setDailyPlan(null)} />}
          </div>
        </section>
      </main>
      {isApiKeyOpen && (
        <ApiKeyDialog
          currentKey={apiKey}
          onSave={handleSaveApiKey}
          onClose={() => {
            setIsApiKeyOpen(false)
            setOpenPlannerAfterKey(false)
          }}
        />
      )}
      {isPlannerOpen && (
        <PlanningDialog
          tasks={todayTasks}
          onCreate={(availableMinutes, signal, onModelChange) => createDailyPlan({
            apiKey,
            availableMinutes,
            tasks: todayTasks,
            signal,
            onModelChange,
          })}
          onComplete={(plan) => {
            setDailyPlan(plan)
            setIsPlannerOpen(false)
          }}
          onClose={() => setIsPlannerOpen(false)}
        />
      )}
    </div>
  )
}
