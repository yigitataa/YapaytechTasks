import { Link } from 'react-router'
import QuickAddButton from '../features/cart/QuickAddButton.jsx'
import Price from './Price.jsx'
import ProductImage from './ProductImage.jsx'

function ProductCard({ product, eagerImage = false, revealIndex = 0 }) {
  return (
    <article
      className="product-card component-enter component-enter--card"
      style={{ '--reveal-index': revealIndex }}
    >
      <Link
        className="product-card__link"
        to={`/products/${encodeURIComponent(product.id)}`}
        aria-label={`${product.name} ürününü incele`}
      >
        <ProductImage
          src={product.imageUrl}
          alt={`${product.name} ürün görseli`}
          eager={eagerImage}
        />

        <div className="product-card__body">
          <span className="product-card__category">{product.category}</span>
          <h2>{product.name}</h2>
          <p>{product.description || 'Bu ürün için henüz açıklama eklenmedi.'}</p>
        </div>
      </Link>

      <div className="product-card__footer">
        <Price value={product.price} />
        <QuickAddButton product={product} />
      </div>
    </article>
  )
}

export default ProductCard
