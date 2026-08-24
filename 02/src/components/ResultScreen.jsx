function optionLetter(index) {
  return String.fromCharCode(65 + index);
}

export default function ResultScreen({ questions, answers, onRestart, onHome }) {
  const correct = questions.reduce(
    (score, question, index) => score + (answers[index] === question.answer ? 1 : 0),
    0,
  );
  const unanswered = answers.filter((answer) => answer === null).length;
  const wrong = questions.length - correct - unanswered;
  const percent = Math.round((correct / questions.length) * 100);
  const scoreHue = Math.round(percent * 1.2);
  const scoreColor = `hsl(${scoreHue} 78% 52%)`;
  const resultTitle = percent >= 75
    ? 'Harika iş.'
    : percent >= 50
      ? 'İyi bir başlangıç.'
      : 'Bir tur daha?';

  const stats = [
    { label: 'Doğru', value: correct, symbol: '✓', tone: 'correct' },
    { label: 'Yanlış', value: wrong, symbol: '×', tone: 'wrong' },
    { label: 'Boş', value: unanswered, symbol: '−', tone: 'empty' },
  ];

  return (
    <main className="screen screen-result">
      <section className="result-card panel" aria-labelledby="result-title">
        <div className="result-hero">
          <div
            className="score-ring"
            style={{ '--score-progress': 100 - percent, '--score-color': scoreColor }}
            aria-label={`Puan ${percent} / 100`}
          >
            <svg viewBox="0 0 128 128" aria-hidden="true">
              <circle className="score-track" cx="64" cy="64" r="54" pathLength="100" />
              <circle className="score-progress" cx="64" cy="64" r="54" pathLength="100" />
            </svg>
            <div className="score-value">
              <strong>{percent}</strong>
              <span>/ 100</span>
            </div>
          </div>

          <div className="result-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> SINAV TAMAMLANDI</div>
            <h1 id="result-title">{resultTitle}</h1>
            <p>{questions.length} soruda <strong>{correct} doğru</strong> cevap verdin.</p>
          </div>
        </div>

        <div className="result-stats" aria-label="Sınav istatistikleri">
          {stats.map((stat, index) => (
            <div
              className={`result-stat is-${stat.tone}`}
              style={{ '--stat-index': index }}
              key={stat.label}
            >
              <span className="stat-symbol" aria-hidden="true">{stat.symbol}</span>
              <div><strong>{stat.value}</strong><span>{stat.label}</span></div>
            </div>
          ))}
        </div>

        <div className="review-heading">
          <div>
            <span className="section-label">DETAYLI SONUÇLAR</span>
            <h2>Cevap özeti</h2>
          </div>
          <span className="review-score">{correct}/{questions.length} doğru</span>
        </div>

        <div className="answer-review">
          {questions.map((question, index) => {
            const isCorrect = answers[index] === question.answer;
            const isEmpty = answers[index] === null;
            const status = isCorrect ? 'Doğru' : isEmpty ? 'Boş' : 'Yanlış';

            return (
              <details
                className={`review-item ${isCorrect ? 'is-correct' : isEmpty ? 'is-empty' : 'is-wrong'}`}
                style={{ '--item-index': index }}
                key={question.id}
              >
                <summary>
                  <span className="review-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="review-question">{question.question}</span>
                  <b>{status}</b>
                </summary>
                <div className="review-detail">
                  <p>Senin cevabın: <strong>{isEmpty ? 'Cevaplanmadı' : `${optionLetter(answers[index])}. ${question.options[answers[index]]}`}</strong></p>
                  {!isCorrect && <p>Doğru cevap: <strong>{optionLetter(question.answer)}. {question.options[question.answer]}</strong></p>}
                  {question.explanation && <small>{question.explanation}</small>}
                </div>
              </details>
            );
          })}
        </div>

        <div className="result-actions">
          <button type="button" className="text-button" onClick={onHome}>Ana menü</button>
          <button type="button" className="primary-button" onClick={onRestart}>Tekrar başlat <span aria-hidden="true">↻</span></button>
        </div>
      </section>
    </main>
  );
}
