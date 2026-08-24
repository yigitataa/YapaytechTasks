const optionLetters = ['A', 'B', 'C', 'D'];

export default function ResultScreen({ questions, answers, onRestart, onHome }) {
  const correct = questions.reduce(
    (score, question, index) => score + (answers[index] === question.answer ? 1 : 0),
    0,
  );
  const unanswered = answers.filter((answer) => answer === null).length;
  const percent = Math.round((correct / questions.length) * 100);

  return (
    <main className="screen screen-result">
      <section className="result-card panel" aria-labelledby="result-title">
        <div className="result-hero">
          <div className="score-ring" style={{ '--score': `${percent * 3.6}deg` }}>
            <div><strong>{percent}</strong><span>/ 100</span></div>
          </div>
          <div>
            <div className="eyebrow"><span className="eyebrow-dot" /> SINAV TAMAMLANDI</div>
            <h1 id="result-title">{percent >= 75 ? 'Harika iş.' : percent >= 50 ? 'İyi bir başlangıç.' : 'Bir tur daha?'}</h1>
            <p>{questions.length} soruda {correct} doğru cevap verdin.</p>
          </div>
        </div>

        <div className="result-stats">
          <div><strong>{correct}</strong><span>Doğru</span></div>
          <div><strong>{questions.length - correct - unanswered}</strong><span>Yanlış</span></div>
          <div><strong>{unanswered}</strong><span>Boş</span></div>
        </div>

        <div className="review-heading">
          <h2>Cevap özeti</h2>
          <span>{correct}/{questions.length} doğru</span>
        </div>
        <div className="answer-review">
          {questions.map((question, index) => {
            const isCorrect = answers[index] === question.answer;
            const isEmpty = answers[index] === null;
            return (
              <details className={`review-item ${isCorrect ? 'is-correct' : 'is-wrong'}`} key={question.id}>
                <summary>
                  <span className="review-number">{String(index + 1).padStart(2, '0')}</span>
                  <span>{question.question}</span>
                  <b>{isCorrect ? 'Doğru' : isEmpty ? 'Boş' : 'Yanlış'}</b>
                </summary>
                <div className="review-detail">
                  <p>Senin cevabın: <strong>{isEmpty ? 'Cevaplanmadı' : `${optionLetters[answers[index]]}. ${question.options[answers[index]]}`}</strong></p>
                  {!isCorrect && <p>Doğru cevap: <strong>{optionLetters[question.answer]}. {question.options[question.answer]}</strong></p>}
                  <small>{question.explanation}</small>
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
