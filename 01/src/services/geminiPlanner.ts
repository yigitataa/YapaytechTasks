import type { Priority, Todo } from '../domain/todo'

export const FLASH_MODELS = [
  'gemini-3.7-flash',
  'gemini-3.6-flash',
  'gemini-3.5-flash',
] as const

export const REQUEST_TIMEOUT_MS = 30_000

export type FlashModel = typeof FLASH_MODELS[number]

export interface PlanItem {
  todoId: string
  title: string
  minutes: number
  order: number
  reason: string
}

export interface DailyPlan {
  summary: string
  availableMinutes: number
  allocatedMinutes: number
  modelUsed: FlashModel
  items: PlanItem[]
}

interface GeminiPlannerInput {
  apiKey: string
  availableMinutes: number
  tasks: Todo[]
  signal?: AbortSignal
  onModelChange?: (model: FlashModel) => void
}

interface GeminiApiError {
  error?: {
    code?: number
    message?: string
    status?: string
  }
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>
    }
  }>
}

const priorityLabels: Record<Priority, string> = {
  high: 'yüksek',
  medium: 'orta',
  low: 'düşük',
}

const responseSchema = {
  type: 'object',
  properties: {
    summary: {
      type: 'string',
      description: 'Planı tek kısa Türkçe cümleyle özetle.',
    },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          todoId: { type: 'string' },
          title: { type: 'string' },
          minutes: { type: 'integer', minimum: 0 },
          order: { type: 'integer', minimum: 1 },
          reason: { type: 'string' },
        },
        required: ['todoId', 'title', 'minutes', 'order', 'reason'],
      },
    },
  },
  required: ['summary', 'items'],
}

function isQuotaError(status: number, body: GeminiApiError) {
  const apiStatus = body.error?.status?.toLowerCase() ?? ''
  const message = body.error?.message?.toLowerCase() ?? ''
  return status === 429 || body.error?.code === 429 || apiStatus === 'resource_exhausted' || /quota|rate.?limit|resource.?exhausted/.test(message)
}

function isTransientError(status: number) {
  return [500, 502, 503, 504].includes(status)
}

export class PlannerCancelledError extends Error {
  constructor() {
    super('Planlama iptal edildi.')
    this.name = 'AbortError'
  }
}

function parseResponse(body: GeminiResponse, tasks: Todo[], availableMinutes: number) {
  const text = body.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? '')
    .join('')
    .trim()

  if (!text) throw new Error('Gemini boş bir plan döndürdü. Lütfen yeniden deneyin.')

  let parsed: unknown
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('Gemini planı okunabilir JSON biçiminde döndürmedi.')
  }

  if (!parsed || typeof parsed !== 'object') throw new Error('Gemini planı geçersiz biçimde döndürdü.')
  const result = parsed as { summary?: unknown; items?: unknown }
  if (!Array.isArray(result.items)) throw new Error('Gemini planında görev listesi bulunamadı.')

  const taskById = new Map(tasks.map((task) => [task.id, task]))
  const seen = new Set<string>()
  const validItems = result.items.flatMap((item, index): PlanItem[] => {
    if (!item || typeof item !== 'object') return []
    const candidate = item as Record<string, unknown>
    const todoId = typeof candidate.todoId === 'string' ? candidate.todoId : ''
    const task = taskById.get(todoId)
    if (!task || seen.has(todoId)) return []
    seen.add(todoId)
    return [{
      todoId,
      title: task.title,
      minutes: Math.max(0, Math.round(Number(candidate.minutes) || 0)),
      order: Math.max(1, Math.round(Number(candidate.order) || index + 1)),
      reason: typeof candidate.reason === 'string' ? candidate.reason.trim() : '',
    }]
  })

  for (const task of tasks) {
    if (!seen.has(task.id)) {
      validItems.push({
        todoId: task.id,
        title: task.title,
        minutes: 0,
        order: validItems.length + 1,
        reason: 'Bu süre içinde plana alınamadı.',
      })
    }
  }

  validItems.sort((left, right) => left.order - right.order)
  const rawTotal = validItems.reduce((total, item) => total + item.minutes, 0)
  if (rawTotal > availableMinutes && rawTotal > 0) {
    const ratio = availableMinutes / rawTotal
    let remaining = availableMinutes
    validItems.forEach((item, index) => {
      const minutes = index === validItems.length - 1
        ? remaining
        : Math.min(remaining, Math.round(item.minutes * ratio))
      item.minutes = minutes
      remaining -= minutes
    })
  }

  return {
    summary: typeof result.summary === 'string' && result.summary.trim()
      ? result.summary.trim()
      : 'Önceliklerine göre dengeli bir günlük plan hazırlandı.',
    items: validItems,
  }
}

function createPrompt(tasks: Todo[], availableMinutes: number) {
  const taskLines = tasks.map((task) => ({
    todoId: task.id,
    title: task.title,
    priority: priorityLabels[task.priority],
  }))

  return [
    'Sen günlük odak planı hazırlayan bir asistansın.',
    `Kullanıcının bugün ayırabileceği toplam süre ${availableMinutes} dakikadır.`,
    'Görevleri önce önem, sonra mantıklı çalışma akışı açısından sırala.',
    'Her todoId tam bir kez yer alsın. Toplam minutes ayrılabilir süreyi aşmasın.',
    'Süre yetmiyorsa düşük öncelikli görevlere 0 dakika ver ve bunu reason alanında kısaca belirt.',
    'Başlıkları değiştirme. summary ve reason alanlarını Türkçe ve kısa yaz.',
    `Görevler: ${JSON.stringify(taskLines)}`,
  ].join('\n')
}

export async function createDailyPlan({ apiKey, availableMinutes, tasks, signal, onModelChange }: GeminiPlannerInput): Promise<DailyPlan> {
  if (!apiKey.trim()) throw new Error('Gemini API anahtarı eksik.')
  if (!Number.isFinite(availableMinutes) || availableMinutes <= 0) throw new Error('Planlama süresi geçersiz.')
  if (tasks.length === 0) throw new Error('Bugün planlanacak açık görev yok.')

  let fallbackReason: 'quota' | 'timeout' | 'service' | '' = ''

  for (const model of FLASH_MODELS) {
    if (signal?.aborted) throw new PlannerCancelledError()
    onModelChange?.(model)

    const requestController = new AbortController()
    let didTimeout = false
    const handleExternalAbort = () => requestController.abort()
    signal?.addEventListener('abort', handleExternalAbort, { once: true })
    const timeoutId = window.setTimeout(() => {
      didTimeout = true
      requestController.abort()
    }, REQUEST_TIMEOUT_MS)

    let response: Response
    let rawResponseBody = ''
    try {
      response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey.trim(),
        },
        signal: requestController.signal,
        body: JSON.stringify({
          contents: [{ parts: [{ text: createPrompt(tasks, availableMinutes) }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema,
            thinkingConfig: { thinkingLevel: 'low' },
            maxOutputTokens: 1024,
            temperature: 0.25,
          },
        }),
      })
      rawResponseBody = await response.text()
    } catch (error) {
      if (signal?.aborted) throw new PlannerCancelledError()
      if (didTimeout) {
        fallbackReason = 'timeout'
        continue
      }
      throw new Error(error instanceof Error
        ? `Gemini bağlantısı kurulamadı: ${error.message}`
        : 'Gemini bağlantısı kurulamadı.')
    } finally {
      window.clearTimeout(timeoutId)
      signal?.removeEventListener('abort', handleExternalAbort)
    }

    if (!response.ok) {
      let errorBody: GeminiApiError = {}
      try {
        errorBody = JSON.parse(rawResponseBody) as GeminiApiError
      } catch {
        // Bazı ağ geçitleri JSON olmayan hata gövdeleri döndürebilir.
      }
      if (isQuotaError(response.status, errorBody)) {
        fallbackReason = 'quota'
        continue
      }
      if (isTransientError(response.status)) {
        fallbackReason = response.status === 504 ? 'timeout' : 'service'
        continue
      }
      throw new Error(errorBody.error?.message ?? `Gemini isteği başarısız oldu (${response.status}).`)
    }

    let responseBody: GeminiResponse
    try {
      responseBody = JSON.parse(rawResponseBody) as GeminiResponse
    } catch {
      throw new Error('Gemini yanıtı okunabilir JSON biçiminde değildi.')
    }
    const plan = parseResponse(responseBody, tasks, availableMinutes)
    const allocatedMinutes = plan.items.reduce((total, item) => total + item.minutes, 0)
    return { ...plan, availableMinutes, allocatedMinutes, modelUsed: model }
  }

  if (fallbackReason === 'quota') {
    throw new Error('Tüm Gemini Flash modellerinin istek kotası dolu. Bir süre sonra yeniden deneyin.')
  }
  if (fallbackReason === 'timeout') {
    throw new Error('Tüm Gemini Flash modelleri 30 saniyelik süre sınırını aştı. Lütfen biraz sonra yeniden deneyin.')
  }
  if (fallbackReason === 'service') {
    throw new Error('Gemini Flash servisleri şu anda yanıt veremiyor. Lütfen biraz sonra yeniden deneyin.')
  }
  throw new Error('Kullanılabilir bir Gemini Flash modeli bulunamadı.')
}
