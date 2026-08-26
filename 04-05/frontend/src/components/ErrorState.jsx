function ErrorState({
  message = 'Lütfen bağlantını kontrol edip yeniden dene.',
  onRetry,
  title = 'Ürünleri şu anda gösteremiyoruz',
  headingLevel = 'h2',
}) {
  const Heading = headingLevel === 'h1' ? 'h1' : 'h2'

  return (
    <section
      className="status-panel status-panel--error component-enter component-enter--status"
      role="alert"
      aria-labelledby="request-error-title"
      aria-describedby="request-error-description"
    >
      <span className="status-panel__icon status-panel__icon--error" aria-hidden="true">
        !
      </span>
      <p className="eyebrow">Bağlantı sorunu</p>
      <Heading id="request-error-title">{title}</Heading>
      <p id="request-error-description">{message}</p>
      <button className="button button--primary" type="button" onClick={onRetry}>
        Yeniden dene
      </button>
    </section>
  )
}

export default ErrorState
