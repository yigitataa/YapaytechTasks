import Price from '../../components/Price.jsx'

function CartSummary({ totalQuantity, subtotal, onClear }) {
  return (
    <aside className="cart-summary component-enter component-enter--detail-copy" aria-labelledby="cart-summary-heading">
      <p className="eyebrow">Sipariş özeti</p>
      <h2 id="cart-summary-heading">Sepet toplamı</h2>

      <dl className="cart-summary__rows">
        <div>
          <dt>Toplam ürün adedi</dt>
          <dd>{totalQuantity}</dd>
        </div>
        <div className="cart-summary__total">
          <dt>Genel toplam</dt>
          <dd>
            <Price value={subtotal} />
          </dd>
        </div>
      </dl>

      <p className="cart-summary__note">
        Ödeme, kargo ve vergi hesapları bu proje kapsamında değildir.
      </p>
      <button className="button button--secondary cart-summary__clear" type="button" onClick={onClear}>
        Sepeti temizle
      </button>
    </aside>
  )
}

export default CartSummary
