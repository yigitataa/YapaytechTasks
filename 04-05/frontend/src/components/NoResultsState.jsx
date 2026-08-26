function NoResultsState({ searchTerm, onClear }) {
  const visibleSearchTerm = searchTerm.trim()

  return (
    <section
      className="status-panel status-panel--no-results component-enter component-enter--status"
      role="status"
    >
      <span className="status-panel__icon" aria-hidden="true">
        ?
      </span>
      <p className="eyebrow">Arama sonucu</p>
      <h2>Aramana uygun ürün bulunamadı</h2>
      <p>
        {visibleSearchTerm ? (
          <>
            “<strong>{visibleSearchTerm}</strong>” için farklı bir kelime deneyebilir veya
            seçimlerini temizleyebilirsin.
          </>
        ) : (
          'Bu kategori ve sıralama seçimiyle gösterilebilecek ürün yok.'
        )}
      </p>
      <button className="button button--primary" type="button" onClick={onClear}>
        Tüm ürünleri göster
      </button>
    </section>
  )
}

export default NoResultsState
