import { useEffect, useRef, useState, type FormEvent } from 'react'
import type { Todo } from '../domain/todo'
import { PlannerCancelledError, type DailyPlan, type FlashModel } from '../services/geminiPlanner'
import { Modal } from './Modal'

interface PlanningDialogProps {
  tasks: Todo[]
  onCreate: (availableMinutes: number, signal: AbortSignal, onModelChange: (model: FlashModel) => void) => Promise<DailyPlan>
  onComplete: (plan: DailyPlan) => void
  onClose: () => void
}

export function PlanningDialog({ tasks, onCreate, onComplete, onClose }: PlanningDialogProps) {
  const [hours, setHours] = useState('4')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [activeModel, setActiveModel] = useState<FlashModel | null>(null)
  const requestController = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!isLoading) return
    const intervalId = window.setInterval(() => setElapsedSeconds((seconds) => seconds + 1), 1000)
    return () => window.clearInterval(intervalId)
  }, [isLoading])

  useEffect(() => () => requestController.current?.abort(), [])

  const handleClose = () => {
    requestController.current?.abort()
    onClose()
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const numericHours = Number(hours)
    if (!Number.isFinite(numericHours) || numericHours < 0.5 || numericHours > 16) {
      setError('0,5 ile 16 saat arasında bir süre girin.')
      return
    }
    setError('')
    setElapsedSeconds(0)
    setActiveModel(null)
    setIsLoading(true)
    const controller = new AbortController()
    requestController.current = controller
    try {
      const plan = await onCreate(Math.round(numericHours * 60), controller.signal, setActiveModel)
      onComplete(plan)
    } catch (caughtError) {
      if (!(caughtError instanceof PlannerCancelledError) && !controller.signal.aborted) {
        setError(caughtError instanceof Error ? caughtError.message : 'Plan oluşturulamadı.')
      }
    } finally {
      requestController.current = null
      setIsLoading(false)
    }
  }

  return (
    <Modal title="Bugünü planla" description={`${tasks.length} açık görevi önceliklerine göre sürelerine bölelim.`} onClose={handleClose}>
      <form className="modal-form" onSubmit={handleSubmit}>
        <label className="modal-field modal-field--hours">
          <span>Bugün kaç saat ayırabilirsin?</span>
          <div className="hours-input">
            <input
              type="number"
              min="0.5"
              max="16"
              step="0.5"
              inputMode="decimal"
              value={hours}
              onChange={(event) => setHours(event.target.value)}
              autoFocus
            />
            <span>saat</span>
          </div>
        </label>
        {tasks.length === 0 && <p className="modal-error" role="alert">Bugün planlanacak açık görev yok.</p>}
        {isLoading && (
          <div className="planner-progress" role="status" aria-live="polite">
            <span className="planner-progress__pulse" />
            <div>
              <strong>{activeModel ?? 'Flash modeli hazırlanıyor'}</strong>
              <span>{elapsedSeconds} sn · Her model için en fazla 30 sn</span>
            </div>
          </div>
        )}
        {error && <p className="modal-error" role="alert">{error}</p>}
        <div className="modal-actions">
          <button className="button button--ghost" type="button" onClick={handleClose}>{isLoading ? 'İptal et' : 'Vazgeç'}</button>
          <button className="button button--primary" type="submit" disabled={isLoading || tasks.length === 0}>
            {isLoading ? 'Gemini planlıyor…' : 'Planı oluştur'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
