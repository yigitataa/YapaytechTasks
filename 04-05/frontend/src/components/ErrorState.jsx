function ErrorState({
  message,
  onRetry,
  title = 'Ürünleri şu anda gösteremiyoruz',
}) {
  return (
    <section className="status-panel component-enter component-enter--status" role="alert">
      <span className="status-panel__icon status-panel__icon--error" aria-hidden="true">
        !
      </span>
      <p className="eyebrow">İstek tamamlanamadı</p>
      <h2>{title}</h2>
      <p>{message}</p>
      <button className="button button--primary" type="button" onClick={onRetry}>
        Tekrar dene
      </button>
    </section>
  )
}

export default ErrorState
