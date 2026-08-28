function toMinorUnits(value) {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.round(value * 100)
    : 0
}

function toValidQuantity(value) {
  return Number.isInteger(value) && value > 0 ? value : 0
}

export function selectTotalQuantity(items) {
  return items.reduce(
    (total, item) => total + toValidQuantity(item.quantity),
    0,
  )
}

export function selectLineTotal(item) {
  return (
    (toMinorUnits(item.product.price) * toValidQuantity(item.quantity)) / 100
  )
}

export function selectCartSubtotal(items) {
  const subtotalInMinorUnits = items.reduce(
    (total, item) =>
      total +
      toMinorUnits(item.product.price) * toValidQuantity(item.quantity),
    0,
  )

  return subtotalInMinorUnits / 100
}
