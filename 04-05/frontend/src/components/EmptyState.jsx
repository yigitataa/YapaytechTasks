function EmptyState() {
  return (
    <section
      className="status-panel component-enter component-enter--status"
      role="status"
      aria-live="polite"
    >
      <span className="status-panel__icon" aria-hidden="true">
        0
      </span>
      <p className="eyebrow">Katalog</p>
      <h2>Henüz ürün bulunmuyor</h2>
      <p>Yeni ürünler eklendiğinde burada listelenecek.</p>
    </section>
  )
}

export default EmptyState
