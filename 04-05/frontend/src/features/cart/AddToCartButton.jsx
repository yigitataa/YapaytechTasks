import InlineCartControl from './InlineCartControl.jsx'
import { useCart } from './useCart.js'

function AddToCartButton({ product }) {
  const { items } = useCart()
  const cartItem = items.find((item) => item.product.id === product.id)
  const quantity = cartItem?.quantity ?? 0

  return (
    <div className="add-to-cart component-enter component-enter--price">
      <InlineCartControl product={product} variant="detail" />
      <p className="add-to-cart__hint">
        {quantity > 0
          ? 'Soldaki çöp kutusu ürünü kaldırır, artı düğmesi adedi artırır.'
          : 'Aynı ürün tekrar eklenirse adedi artar.'}
      </p>
    </div>
  )
}

export default AddToCartButton
