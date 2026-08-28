export function createEmptyProductForm() {
  return {
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
  }
}

export function productToForm(product) {
  return {
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price === undefined ? '' : String(product.price),
    category: product?.category ?? '',
    imageUrl: product?.imageUrl ?? '',
  }
}

export function validateProductForm(values) {
  const errors = {}

  if (values.name.trim() === '') {
    errors.name = 'Ürün adı zorunludur.'
  }

  const numericPrice = Number(values.price)
  if (values.price === '' || !Number.isFinite(numericPrice) || numericPrice <= 0) {
    errors.price = 'Fiyat sıfırdan büyük bir sayı olmalıdır.'
  }

  if (values.category.trim() === '') {
    errors.category = 'Kategori zorunludur.'
  }

  return errors
}

export function toProductPayload(values) {
  return {
    name: values.name.trim(),
    description: values.description.trim(),
    price: Number(values.price),
    category: values.category.trim(),
    imageUrl: values.imageUrl.trim(),
  }
}
