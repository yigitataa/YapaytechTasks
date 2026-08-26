import { Link } from 'react-router'
import Price from '../../components/Price.jsx'
import ProductImage from '../../components/ProductImage.jsx'
import { selectLineTotal } from './cartSelectors.js'
import QuantityStepper from './QuantityStepper.jsx'

function CartItem({ item, onIncrease, onDecrease, onRemove, revealIndex }) {
  const { product, quantity } = item

  return (
    <article
      className="cart-item component-enter component-enter--card"
      style={{ '--reveal-index': revealIndex }}
    >
      <Link
        className="cart-item__media"
        to={`/products/${encodeURIComponent(product.id)}`}
        aria-label={`${product.name} ürün detayına git`}
      >
        <ProductImage src={product.imageUrl} alt={`${product.name} ürün görseli`} />
      </Link>

      <div className="cart-item__content">
        <div className="cart-item__heading">
          <div>
            <span className="cart-item__category">{product.category}</span>
            <h2>
              <Link to={`/products/${encodeURIComponent(product.id)}`}>
                {product.name}
              </Link>
            </h2>
          </div>
          <button
            className="cart-item__remove"
            type="button"
            aria-label={`${product.name} ürününü sepetten kaldır`}
            onClick={onRemove}
          >
            Kaldır
          </button>
        </div>

        <div className="cart-item__unit-price">
          Birim fiyat: <Price value={product.price} />
        </div>

        <div className="cart-item__footer">
          <QuantityStepper
            productName={product.name}
            quantity={quantity}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
          />
          <div className="cart-item__line-total">
            <span>Satır toplamı</span>
            <Price value={selectLineTotal(item)} />
          </div>
        </div>
      </div>
    </article>
  )
}

export default CartItem
