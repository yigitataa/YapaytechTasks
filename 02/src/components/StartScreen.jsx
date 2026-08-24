import { useRef, useState } from 'react';

export default function StartScreen({ fileName, questionCount, error, onFileSelect, onStart }) {
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
          Sorularını JSON dosyasıyla ekle ve sınavı başlat.
        </p>

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
          className={`upload-zone ${isDragging ? 'is-dragging' : ''} ${questionCount ? 'has-file' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragEnter={(event) => { event.preventDefault(); setIsDragging(true); }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <span className="upload-icon" aria-hidden="true">{questionCount ? '✓' : '↑'}</span>
          <strong>{questionCount ? fileName : 'JSON dosyasını buraya sürükle'}</strong>
          <span>{questionCount ? `${questionCount} soru kullanıma hazır` : 'veya bilgisayarından seçmek için tıkla'}</span>
          <small>Yalnızca .json</small>
        </button>

        {error && <p className="file-error" role="alert">{error}</p>}

        <div className="start-footer">
          <div className="quiz-facts" aria-label="Sınav bilgileri">
            <span><b>30 sn</b> / soru</span>
            <span><b>{questionCount || 0} soru</b> yüklendi</span>
          </div>
          <button type="button" className="primary-button" onClick={onStart} disabled={!questionCount}>
            Sınava başla <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    </main>
  );
}
