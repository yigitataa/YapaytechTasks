const categoryDetails = {
  Tümü: ['12 soru', 'Karma sınav'],
  JavaScript: ['4 soru', 'Dil temelleri'],
  React: ['4 soru', 'Bileşen & Hook'],
  Frontend: ['4 soru', 'HTML & CSS'],
};

export default function StartScreen({ category, onCategoryChange, onStart }) {
  return (
    <main className="screen screen-start">
      <section className="start-card panel" aria-labelledby="app-title">
        <div className="eyebrow"><span className="eyebrow-dot" /> FRONTEND BİLGİ SINAVI</div>
        <h1 id="app-title">Bilgini ölç.<br /><span>Odağını koru.</span></h1>
        <p className="intro">
          Her soru için 30 saniyen var. Bir alan seç, ritmini bul ve sonucu ayrıntılı olarak incele.
        </p>

        <div className="section-heading">
          <span>Kategori</span>
          <span>Bir seçim yap</span>
        </div>
        <div className="category-grid" role="radiogroup" aria-label="Quiz kategorisi">
          {Object.entries(categoryDetails).map(([name, [count, detail]]) => (
            <button
              type="button"
              className={`category-card ${category === name ? 'is-active' : ''}`}
              key={name}
              role="radio"
              aria-checked={category === name}
              onClick={() => onCategoryChange(name)}
            >
              <span className="category-check" aria-hidden="true">{category === name ? '✓' : ''}</span>
              <strong>{name}</strong>
              <small>{detail} · {count}</small>
            </button>
          ))}
        </div>

        <div className="start-footer">
          <div className="quiz-facts" aria-label="Sınav bilgileri">
            <span><b>30 sn</b> / soru</span>
            <span><b>{categoryDetails[category][0]}</b> toplam</span>
          </div>
          <button type="button" className="primary-button" onClick={onStart}>
            Sınava başla <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>
    </main>
  );
}
