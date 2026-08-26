import { Link } from 'react-router'

function EmptyCartState() {
  return (
    <section
      className="status-panel empty-cart component-enter component-enter--status"
      role="status"
      aria-live="polite"
    >
      <span className="empty-cart__icon" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M3 4h2l1.5 10h10.8l1.7-7H7" />
          <circle cx="9" cy="19" r="1.25" />
          <circle cx="17" cy="19" r="1.25" />
        </svg>
      </span>
      <p className="eyebrow">Sepetin seni bekliyor</p>
      <h1>Sepetin şu anda boş</h1>
      <p>Yata Market’in renkli seçkisini keşfet ve beğendiğin ürünleri buraya ekle.</p>
      <Link className="button button--primary" to="/">
        Alışverişe başla
      </Link>
    </section>
  )
}

export default EmptyCartState
