function LoadingState({ variant = 'list' }) {
  if (variant === 'detail') {
    return (
      <section
        className="detail-skeleton component-enter component-enter--detail"
        role="status"
        aria-live="polite"
        aria-busy="true"
        aria-label="Ürün detayı yükleniyor"
      >
        <div className="skeleton detail-skeleton__image" />
        <div className="detail-skeleton__content">
          <div className="skeleton skeleton--short" />
          <div className="skeleton skeleton--title" />
          <div className="skeleton skeleton--price" />
          <div className="skeleton skeleton--line" />
          <div className="skeleton skeleton--line" />
          <div className="skeleton skeleton--medium" />
          <div className="skeleton skeleton--button" />
          <div className="skeleton skeleton--meta" />
        </div>
        <span className="sr-only">Ürün detayı yükleniyor</span>
      </section>
    )
  }

  return (
    <div
      className="product-grid"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Ürünler yükleniyor"
    >
      {Array.from({ length: 8 }, (_, index) => (
        <div
          className="product-card product-card--skeleton component-enter component-enter--card"
          key={index}
          aria-hidden="true"
          style={{ '--reveal-index': index }}
        >
          <div className="skeleton product-card__image-skeleton" />
          <div className="product-card__body">
            <div className="skeleton skeleton--short" />
            <div className="skeleton skeleton--title" />
            <div className="skeleton skeleton--line" />
          </div>
          <div className="product-card__footer product-card__footer--skeleton">
            <div className="skeleton skeleton--price" />
            <div className="skeleton skeleton--quick-action" />
          </div>
        </div>
      ))}
      <span className="sr-only">Ürünler yükleniyor</span>
    </div>
  )
}

export default LoadingState
