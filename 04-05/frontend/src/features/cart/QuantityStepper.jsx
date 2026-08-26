function QuantityStepper({ productName, quantity, onIncrease, onDecrease }) {
  const willRemove = quantity === 1

  return (
    <div
      className="quantity-stepper"
      role="group"
      aria-label={`${productName} ürün adedi`}
    >
      <button
        className={willRemove ? 'is-remove' : undefined}
        type="button"
        aria-label={
          willRemove
            ? `${productName} ürününü sepetten kaldır`
            : `${productName} ürününün adedini azalt`
        }
        onClick={onDecrease}
      >
        {willRemove ? (
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M4 7h16M9 7V4h6v3m-8 0 1 13h8l1-13M10 11v5m4-5v5" />
          </svg>
        ) : (
          '−'
        )}
      </button>
      <output aria-label={`${quantity} adet`}>{quantity}</output>
      <button
        type="button"
        aria-label={`${productName} ürününün adedini artır`}
        onClick={onIncrease}
      >
        +
      </button>
    </div>
  )
}

export default QuantityStepper
