import { useRef, useState } from 'react';

export default function StartScreen({
  quizzes,
  activeQuizId,
  selectedQuizName,
  questionCount,
  answeredCount,
  hasProgress,
  error,
  onSelectQuiz,
  onFileSelect,
  onStart,
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    onFileSelect(event.dataTransfer.files[0]);
  }

  return (
    <main className="screen screen-start">
      <section className="start-card panel" aria-labelledby="app-title">
        <h1 className="brand-title" id="app-title">YataQuizing</h1>
        <p className="upload-intro">
          Hazır quizlerden birini seç veya kendi JSON dosyanı ekle.
        </p>

        <div className="library-heading">
          <div>
            <span className="section-label">QUIZ KÜTÜPHANESİ</span>
            <h2>Mevcut quizler</h2>
          </div>
          <span>{quizzes.length} quiz</span>
        </div>

        <div className="quiz-library" aria-label="Mevcut quizler">
          {quizzes.map((quiz, index) => {
            const isActive = quiz.id === activeQuizId;
            return (
              <button
                type="button"
                className={`quiz-library-card ${isActive ? 'is-active' : ''}`}
                style={{ '--quiz-index': Math.min(index, 8) }}
                onClick={() => onSelectQuiz(quiz.id)}
                aria-pressed={isActive}
                key={quiz.id}
              >
                <span className="quiz-file-icon" aria-hidden="true">{quiz.source === 'upload' ? '↑' : 'Q'}</span>
                <span className="quiz-card-copy">
                  <strong>{quiz.name}</strong>
                  <small>{quiz.questions.length} soru · {quiz.source === 'upload' ? 'Yüklenen' : 'Hazır'}</small>
                </span>
                <span className="quiz-selected" aria-hidden="true">{isActive ? '✓' : ''}</span>
              </button>
            );
          })}
        </div>

        <div className="upload-divider"><span>DIŞARIDAN EKLE</span></div>

        <input
          ref={inputRef}
          className="file-input"
          type="file"
          accept="application/json,.json"
          onChange={(event) => {
            onFileSelect(event.target.files[0]);
            event.target.value = '';
          }}
        />

        <button
          type="button"
          className={`upload-zone is-compact ${isDragging ? 'is-dragging' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <span className="upload-icon" aria-hidden="true">↑</span>
          <span className="upload-copy">
            <strong>JSON dosyasını sürükle veya seç</strong>
            <small>Yüklenen quiz bu tarayıcıda saklanır</small>
          </span>
        </button>

        {error && <p className="file-error" role="alert">{error}</p>}

        <div className="selected-quiz-summary">
          <div>
            <span>SEÇİLİ QUIZ</span>
            <strong>{selectedQuizName || 'Henüz seçim yapılmadı'}</strong>
          </div>
          {hasProgress && (
            <span className="resume-badge">{answeredCount}/{questionCount} cevaplandı</span>
          )}
        </div>

        <div className="start-footer">
          <div className="quiz-facts" aria-label="Sınav bilgileri">
            <span><b>30 sn</b> / soru</span>
            <span><b>{questionCount || 0} soru</b> toplam</span>
          </div>
          <button type="button" className="primary-button" onClick={onStart} disabled={!questionCount}>
            {hasProgress ? 'Kaldığın yerden devam et' : 'Sınava başla'} <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    </main>
  );
}
