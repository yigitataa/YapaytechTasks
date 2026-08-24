import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Todo } from '../domain/todo'
import { createDailyPlan, PlannerCancelledError, REQUEST_TIMEOUT_MS } from './geminiPlanner'

const tasks: Todo[] = [
  {
    id: 'task-1',
    title: 'Sunumu hazırla',
    priority: 'high',
    dueDate: '2026-08-24',
    completed: false,
    createdAt: '2026-08-24T08:00:00.000Z',
    updatedAt: '2026-08-24T08:00:00.000Z',
  },
]

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('Gemini planner', () => {
  it('kota dolduğunda sıradaki Flash modeline geçer', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify({
        error: { code: 429, status: 'RESOURCE_EXHAUSTED', message: 'Quota exceeded' },
      }), { status: 429, headers: { 'Content-Type': 'application/json' } }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: JSON.stringify({
          summary: 'Önce sunuma odaklan.',
          items: [{ todoId: 'task-1', title: 'Sunumu hazırla', minutes: 90, order: 1, reason: 'Yüksek öncelikli.' }],
        }) }] } }],
      }), { status: 200, headers: { 'Content-Type': 'application/json' } }))

    const plan = await createDailyPlan({ apiKey: 'test-key', availableMinutes: 120, tasks })

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock.mock.calls[0][0]).toContain('gemini-3.7-flash')
    expect(fetchMock.mock.calls[1][0]).toContain('gemini-3.6-flash')
    expect(plan.modelUsed).toBe('gemini-3.6-flash')
    expect(plan.allocatedMinutes).toBe(90)
    const requestBody = JSON.parse(String((fetchMock.mock.calls[1][1] as RequestInit).body))
    expect(requestBody.generationConfig.thinkingConfig).toEqual({ thinkingLevel: 'low' })
  })

  it('30 saniyede yanıt vermeyen modeli iptal edip sıradakine geçer', async () => {
    vi.useFakeTimers()
    const fetchMock = vi.spyOn(globalThis, 'fetch')
      .mockImplementationOnce((_input, init) => new Promise((_resolve, reject) => {
        init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
      }))
      .mockResolvedValueOnce(new Response(JSON.stringify({
        candidates: [{ content: { parts: [{ text: JSON.stringify({
          summary: 'Kısa plan.',
          items: [{ todoId: 'task-1', title: 'Sunumu hazırla', minutes: 60, order: 1, reason: 'Öncelikli.' }],
        }) }] } }],
      }), { status: 200, headers: { 'Content-Type': 'application/json' } }))

    const planPromise = createDailyPlan({ apiKey: 'test-key', availableMinutes: 120, tasks })
    await vi.advanceTimersByTimeAsync(REQUEST_TIMEOUT_MS)
    const plan = await planPromise

    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect(fetchMock.mock.calls[0][0]).toContain('gemini-3.7-flash')
    expect(fetchMock.mock.calls[1][0]).toContain('gemini-3.6-flash')
    expect(plan.modelUsed).toBe('gemini-3.6-flash')
  })

  it('kullanıcı iptalinde çalışan isteği sonlandırır', async () => {
    const controller = new AbortController()
    vi.spyOn(globalThis, 'fetch').mockImplementation((_input, init) => new Promise((_resolve, reject) => {
      init?.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
    }))

    const planPromise = createDailyPlan({ apiKey: 'test-key', availableMinutes: 120, tasks, signal: controller.signal })
    controller.abort()

    await expect(planPromise).rejects.toBeInstanceOf(PlannerCancelledError)
  })

  it('kota dışı hatada model değiştirmeden hatayı gösterir', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({
      error: { code: 400, status: 'INVALID_ARGUMENT', message: 'API key not valid' },
    }), { status: 400, headers: { 'Content-Type': 'application/json' } }))

    await expect(createDailyPlan({ apiKey: 'wrong-key', availableMinutes: 120, tasks }))
      .rejects.toThrow('API key not valid')
    expect(fetchMock).toHaveBeenCalledOnce()
  })
})
