function PageLoader() {
  return (
    <div className="page-loader" role="status" aria-live="polite">
      <div className="page-loader__content">
        <span className="page-loader__logo" aria-hidden="true">
          Y
        </span>
        <span className="page-loader__brand">Yata Market</span>
        <span className="page-loader__track" aria-hidden="true">
          <span />
        </span>
        <span className="sr-only">Yata Market sayfası yükleniyor</span>
      </div>
    </div>
  )
}

export default PageLoader
