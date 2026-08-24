import type { CSSProperties } from 'react'
import type { DailyPlan } from '../services/geminiPlanner'

interface PlanTimelineProps {
  plan: DailyPlan
  onClear: () => void
}

const colors = ['#6aa8ff', '#7d70ff', '#a767ee', '#d0a9ff', '#62d1ef', '#8e87ff']

function formatDuration(minutes: number) {
  if (minutes === 0) return 'Plan dışı'
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours && rest) return `${hours} sa ${rest} dk`
  if (hours) return `${hours} sa`
  return `${rest} dk`
}

export function PlanTimeline({ plan, onClear }: PlanTimelineProps) {
  const scheduledItems = plan.items.filter((item) => item.minutes > 0)
  const denominator = Math.max(plan.availableMinutes, 1)

  return (
    <section className="daily-plan" aria-labelledby="daily-plan-title">
      <div className="daily-plan__header">
        <div>
          <span className="daily-plan__eyebrow">AI günlük akış</span>
          <h2 id="daily-plan-title">Planın hazır</h2>
        </div>
        <div className="daily-plan__header-actions">
          <span className="model-pill">{plan.modelUsed}</span>
          <button type="button" onClick={onClear}>Kapat</button>
        </div>
      </div>
      <p className="daily-plan__summary">{plan.summary}</p>

      <div className="timeline" aria-label={`Toplam ${formatDuration(plan.allocatedMinutes)} görev süresi`}>
        {scheduledItems.map((item, index) => (
          <div
            key={item.todoId}
            className="timeline__segment"
            style={{ width: `${(item.minutes / denominator) * 100}%`, '--segment-color': colors[index % colors.length] } as CSSProperties}
            title={`${item.title}: ${formatDuration(item.minutes)}`}
          />
        ))}
        {plan.allocatedMinutes < plan.availableMinutes && (
          <div className="timeline__free" style={{ width: `${((plan.availableMinutes - plan.allocatedMinutes) / denominator) * 100}%` }} title="Ayrılmamış süre" />
        )}
      </div>

      <div className="plan-chart" aria-label="Görev süre grafiği">
        {plan.items.map((item, index) => (
          <article className="plan-row" key={item.todoId}>
            <span className="plan-row__order">{index + 1}</span>
            <div className="plan-row__content">
              <div className="plan-row__label">
                <strong>{item.title}</strong>
                <span>{formatDuration(item.minutes)}</span>
              </div>
              <div className="plan-row__track">
                <span style={{ width: `${(item.minutes / denominator) * 100}%`, background: colors[index % colors.length] }} />
              </div>
              {item.reason && <p>{item.reason}</p>}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
