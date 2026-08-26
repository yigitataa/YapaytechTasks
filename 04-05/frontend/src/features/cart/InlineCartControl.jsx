import { useState } from 'react'
import { useCart } from './useCart.js'

function TrashIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5" />
    </svg>
  )
}

function InlineCartControl({ product, variant }) {
  const {
    addItem,
    increaseQuantity,
    items,
    removeItem,
    totalQuantity,
  } = useCart()
  const [announcement, setAnnouncement] = useState('')
  const cartItem = items.find((item) => item.product.id === product.id)
  const quantity = cartItem?.quantity ?? 0

  function handleAdd() {
    addItem(product)
    setAnnouncement(`${product.name} sepete eklendi.`)
  }

  function handleIncrease() {
    increaseQuantity(product.id)
    setAnnouncement(`${product.name} adedi ${quantity + 1} oldu.`)
  }

  function handleRemove() {
    removeItem(product.id)
    setAnnouncement(`${product.name} sepetten kaldırıldı.`)
  }

  if (quantity === 0) {
    return (
      <>
        <button
          className={
            variant === 'detail'
              ? 'button button--primary add-to-cart__button'
              : 'product-card__quick-add'
          }
          type="button"
          onClick={handleAdd}
          aria-label={`${product.name} ürününü sepete ekle`}
        >
          <span aria-hidden="true">+</span>
          <span>Sepete ekle</span>
        </button>
        <span className="sr-only" role="status" aria-live="polite">
          {announcement
            ? `${announcement} Sepette toplam ${totalQuantity} ürün var.`
            : ''}
        </span>
      </>
    )
  }

  return (
    <>
      <div
        className={`inline-cart-control inline-cart-control--${variant}`}
        role="group"
        aria-label={`${product.name} sepet adedi`}
      >
        <button
          className="inline-cart-control__remove"
          type="button"
          onClick={handleRemove}
          aria-label={`${product.name} ürününü sepetten kaldır`}
        >
          <TrashIcon />
        </button>
        <output aria-label={`${quantity} adet`}>{quantity}</output>
        <button
          className="inline-cart-control__increase"
          type="button"
          onClick={handleIncrease}
          aria-label={`${product.name} ürününün adedini artır`}
        >
          +
        </button>
      </div>
      <span className="sr-only" role="status" aria-live="polite">
        {announcement
          ? `${announcement} Sepette toplam ${totalQuantity} ürün var.`
          : ''}
      </span>
    </>
  )
}

export default InlineCartControl
