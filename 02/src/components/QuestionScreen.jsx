import TimerLine from './TimerLine';

function optionLetter(index) {
  return String.fromCharCode(65 + index);
}

export default function QuestionScreen({
  question,
  index,
  total,
  answer,
  answers,
  timeLeft,
  duration,
  onAnswer,
  onPrevious,
  onNext,
  onExit,
}) {
  return (
    <main className="screen screen-question">
      <section className="question-card panel" aria-labelledby="question-title">
        <header className="question-header">
          <button type="button" className="icon-button" onClick={onExit} aria-label="Ana menüye dön">×</button>
          <div className="question-count">SORU {index + 1} <span>/ {total}</span></div>
          <div className="category-label">{question.category}</div>
        </header>

        <div className="question-dots" aria-label={`${index + 1}. sorudasınız`}>
          {Array.from({ length: total }, (_, dotIndex) => (
            <span
              className={`${dotIndex === index ? 'is-current' : ''} ${answers[dotIndex] !== null ? 'is-answered' : ''}`}
              key={dotIndex}
            />
          ))}
        </div>

        <TimerLine timeLeft={timeLeft} duration={duration} />

        <div className="question-body">
          <p className="question-kicker">Doğru seçeneği işaretle</p>
          <h2 id="question-title">{question.question}</h2>

          <div className="options" role="radiogroup" aria-label="Cevap seçenekleri">
            {question.options.map((option, optionIndex) => (
              <button
                type="button"
                className={`option-button ${answer === optionIndex ? 'is-selected' : ''}`}
                style={{ '--option-index': optionIndex }}
                key={option}
                role="radio"
                aria-checked={answer === optionIndex}
                onClick={() => onAnswer(optionIndex)}
              >
                <span className="option-key">{optionLetter(optionIndex)}</span>
                <span>{option}</span>
                <span className="option-mark" aria-hidden="true">{answer === optionIndex ? '✓' : ''}</span>
              </button>
            ))}
          </div>
        </div>

        <footer className="question-footer">
          <button type="button" className="text-button" onClick={onPrevious} disabled={index === 0}>
            ← Önceki
          </button>
          <button type="button" className="primary-button compact" onClick={onNext}>
            {index === total - 1 ? 'Sınavı bitir' : 'Sonraki'} <span aria-hidden="true">→</span>
          </button>
        </footer>
      </section>
    </main>
  );
}
