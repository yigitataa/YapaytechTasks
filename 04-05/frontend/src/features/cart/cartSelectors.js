function toMinorUnits(value) {
  return Math.round(value * 100)
}

export function selectTotalQuantity(items) {
  return items.reduce((total, item) => total + item.quantity, 0)
}

export function selectLineTotal(item) {
  return (toMinorUnits(item.product.price) * item.quantity) / 100
}

export function selectCartSubtotal(items) {
  const subtotalInMinorUnits = items.reduce(
    (total, item) => total + toMinorUnits(item.product.price) * item.quantity,
    0,
  )

  return subtotalInMinorUnits / 100
}
