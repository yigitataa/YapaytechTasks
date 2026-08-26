import { useState } from 'react'
import CartItem from '../features/cart/CartItem.jsx'
import CartSummary from '../features/cart/CartSummary.jsx'
import EmptyCartState from '../features/cart/EmptyCartState.jsx'
import { useCart } from '../features/cart/useCart.js'

function CartPage() {
  const {
    items,
    totalQuantity,
    subtotal,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
  } = useCart()
  const [announcement, setAnnouncement] = useState('')

  function handleIncrease(item) {
    increaseQuantity(item.product.id)
    setAnnouncement(`${item.product.name} adedi ${item.quantity + 1} oldu.`)
  }

  function handleDecrease(item) {
    decreaseQuantity(item.product.id)
    setAnnouncement(
      item.quantity === 1
        ? `${item.product.name} sepetten kaldırıldı.`
        : `${item.product.name} adedi ${item.quantity - 1} oldu.`,
    )
  }

  function handleRemove(item) {
    removeItem(item.product.id)
    setAnnouncement(`${item.product.name} sepetten kaldırıldı.`)
  }

  function handleClear() {
    clearCart()
    setAnnouncement('Sepet temizlendi.')
  }

  if (items.length === 0) {
    return (
      <div className="container cart-page page-view">
        <EmptyCartState />
        <span className="sr-only" role="status" aria-live="polite">
          {announcement}
        </span>
      </div>
    )
  }

  return (
    <div className="container cart-page page-view">
      <header className="cart-page__header component-enter component-enter--section">
        <div>
          <p className="eyebrow">Sepetim</p>
          <h1>Seçimlerini gözden geçir</h1>
          <p>{totalQuantity} ürün, her an güncellenen doğru toplamlarla burada.</p>
        </div>
      </header>

      <div className="cart-layout">
        <section className="cart-items" aria-label="Sepetteki ürünler">
          {items.map((item, index) => (
            <CartItem
              key={item.product.id}
              item={item}
              revealIndex={index}
              onIncrease={() => handleIncrease(item)}
              onDecrease={() => handleDecrease(item)}
              onRemove={() => handleRemove(item)}
            />
          ))}
        </section>

        <CartSummary
          totalQuantity={totalQuantity}
          subtotal={subtotal}
          onClear={handleClear}
        />
      </div>

      <span className="sr-only" role="status" aria-live="polite">
        {announcement}
      </span>
    </div>
  )
}

export default CartPage
