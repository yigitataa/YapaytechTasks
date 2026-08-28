import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  ALL_CATEGORIES,
  deriveProducts,
  SORT_OPTIONS,
} from './deriveProducts.js'

const products = [
  { id: 'p-1', name: 'Kablosuz Kulaklık', category: 'Elektronik', price: 300 },
  { id: 'p-2', name: 'Kaymaz Yoga Matı', category: 'Spor', price: 100 },
  { id: 'p-3', name: 'Çelik Matara', category: 'Spor', price: 200 },
]

test('search is case insensitive', () => {
  const result = deriveProducts(products, { searchTerm: 'KULAKLIK' })

  assert.deepEqual(result.map((product) => product.id), ['p-1'])
})

test('search ignores leading and trailing spaces', () => {
  const result = deriveProducts(products, { searchTerm: '  yoga  ' })

  assert.deepEqual(result.map((product) => product.id), ['p-2'])
})

test('category filter returns only matching products', () => {
  const result = deriveProducts(products, { selectedCategory: 'Spor' })

  assert.deepEqual(result.map((product) => product.id), ['p-2', 'p-3'])
})

test('all categories keeps every product', () => {
  const result = deriveProducts(products, { selectedCategory: ALL_CATEGORIES })

  assert.equal(result.length, products.length)
})

test('ascending price sort orders from low to high', () => {
  const result = deriveProducts(products, {
    sortBy: SORT_OPTIONS.PRICE_ASCENDING,
  })

  assert.deepEqual(result.map((product) => product.price), [100, 200, 300])
})

test('descending price sort orders from high to low', () => {
  const result = deriveProducts(products, {
    sortBy: SORT_OPTIONS.PRICE_DESCENDING,
  })

  assert.deepEqual(result.map((product) => product.price), [300, 200, 100])
})

test('search, category and sorting work together', () => {
  const result = deriveProducts(products, {
    searchTerm: 'mat',
    selectedCategory: 'Spor',
    sortBy: SORT_OPTIONS.PRICE_DESCENDING,
  })

  assert.deepEqual(result.map((product) => product.id), ['p-3', 'p-2'])
})

test('sorting does not mutate the source array', () => {
  const originalIds = products.map((product) => product.id)

  deriveProducts(products, { sortBy: SORT_OPTIONS.PRICE_ASCENDING })

  assert.deepEqual(products.map((product) => product.id), originalIds)
})

test('a search with no match returns an empty array', () => {
  const result = deriveProducts(products, { searchTerm: 'bulunmayan' })

  assert.deepEqual(result, [])
})
