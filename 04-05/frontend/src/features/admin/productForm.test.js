import assert from 'node:assert/strict'
import test from 'node:test'
import {
  createEmptyProductForm,
  productToForm,
  toProductPayload,
  validateProductForm,
} from './productForm.js'

test('boş ürün formu beklenen alanları içerir', () => {
  assert.deepEqual(createEmptyProductForm(), {
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
  })
})

test('geçerli ürün formu hata üretmez', () => {
  const errors = validateProductForm({
    ...createEmptyProductForm(),
    name: 'Kulaklık',
    price: '1250',
    category: 'Elektronik',
  })

  assert.deepEqual(errors, {})
})

test('zorunlu alanlar ve geçersiz fiyat alan bazlı hata üretir', () => {
  assert.deepEqual(validateProductForm(createEmptyProductForm()), {
    name: 'Ürün adı zorunludur.',
    price: 'Fiyat sıfırdan büyük bir sayı olmalıdır.',
    category: 'Kategori zorunludur.',
  })
})

test('negatif ve metin fiyat reddedilir', () => {
  const base = {
    ...createEmptyProductForm(),
    name: 'Ürün',
    category: 'Test',
  }

  assert.ok(validateProductForm({ ...base, price: '-1' }).price)
  assert.ok(validateProductForm({ ...base, price: 'fiyat' }).price)
})

test('API payload metinleri kırpar ve fiyatı sayıya dönüştürür', () => {
  assert.deepEqual(
    toProductPayload({
      name: '  Kulaklık ',
      description: ' Açıklama ',
      price: '1250.5',
      category: ' Elektronik ',
      imageUrl: ' https://example.com/image.png ',
    }),
    {
      name: 'Kulaklık',
      description: 'Açıklama',
      price: 1250.5,
      category: 'Elektronik',
      imageUrl: 'https://example.com/image.png',
    },
  )
})

test('ürün bilgisi düzenleme formuna dönüştürülür', () => {
  assert.deepEqual(
    productToForm({
      name: 'Kulaklık',
      price: 1250,
      category: 'Elektronik',
    }),
    {
      name: 'Kulaklık',
      description: '',
      price: '1250',
      category: 'Elektronik',
      imageUrl: '',
    },
  )
})
