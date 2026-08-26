import { Link } from 'react-router'

function NotFoundPage({ productNotFound = false }) {
  return (
    <div className="container not-found-page page-view">
      <section className="status-panel status-panel--not-found component-enter component-enter--status">
        <span className="not-found-code" aria-hidden="true">
          404
        </span>
        <p className="eyebrow">Aradığınız içerik burada değil</p>
        <h1>{productNotFound ? 'Ürün bulunamadı' : 'Sayfa bulunamadı'}</h1>
        <p>
          {productNotFound
            ? 'Bu ürün kaldırılmış veya ürün kimliği yanlış yazılmış olabilir.'
            : 'Adres yanlış yazılmış veya sayfa taşınmış olabilir.'}
        </p>
        <Link className="button button--primary" to="/">
          Ürünlere dön
        </Link>
      </section>
    </div>
  )
}

export default NotFoundPage
