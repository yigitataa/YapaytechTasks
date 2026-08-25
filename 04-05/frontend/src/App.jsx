function App() {
  return (
    <main className="app-shell">
      <section className="welcome-card" aria-labelledby="page-title">
        <p className="stage-label">Aşama 2 · Proje iskeleti</p>

        <div className="status" role="status">
          <span className="status-dot" aria-hidden="true" />
          Frontend çalışıyor
        </div>

        <h1 id="page-title">Full-Stack E-Ticaret Uygulaması</h1>

        <p className="intro">
          React kullanıcı arayüzü başarıyla hazırlandı. Ürün ve sepet
          özellikleri sonraki geliştirme aşamalarında eklenecek.
        </p>

        <div className="technology-list" aria-label="Kullanılan teknolojiler">
          <span>React</span>
          <span>Vite</span>
          <span>JavaScript</span>
        </div>
      </section>
    </main>
  )
}

export default App

