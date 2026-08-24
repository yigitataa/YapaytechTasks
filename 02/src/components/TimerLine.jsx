export default function TimerLine({ timeLeft, duration }) {
  const ratio = Math.max(0, timeLeft / duration);
  const color = `hsl(${Math.round(ratio * 120)} 78% 52%)`;

  return (
    <div className="timer" aria-label={`Kalan süre ${timeLeft} saniye`}>
      <div className="timer-meta">
        <span>Kalan süre</span>
        <strong>{String(timeLeft).padStart(2, '0')} sn</strong>
      </div>
      <div className="timer-track">
        <div
          className="timer-fill"
          style={{ width: `${ratio * 100}%`, backgroundColor: color, boxShadow: `0 0 14px ${color}55` }}
        />
      </div>
    </div>
  );
}
