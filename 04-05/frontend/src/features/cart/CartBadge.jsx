function CartBadge({ count }) {
  return (
    <span className="cart-badge" aria-hidden="true">
      {count > 99 ? '99+' : count}
    </span>
  )
}

export default CartBadge
