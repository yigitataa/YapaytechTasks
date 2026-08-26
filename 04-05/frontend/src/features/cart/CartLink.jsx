import { Link } from 'react-router'
import CartBadge from './CartBadge.jsx'
import { useCart } from './useCart.js'

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 4h2l1.5 10h10.8l1.7-7H7" />
      <circle cx="9" cy="19" r="1.25" />
      <circle cx="17" cy="19" r="1.25" />
    </svg>
  )
}

function CartLink() {
  const { totalQuantity } = useCart()

  return (
    <Link
      className="cart-link"
      to="/cart"
      aria-label={`Sepet, ${totalQuantity} ürün`}
    >
      <CartIcon />
      <span>Sepet</span>
      <CartBadge count={totalQuantity} />
    </Link>
  )
}

export default CartLink
