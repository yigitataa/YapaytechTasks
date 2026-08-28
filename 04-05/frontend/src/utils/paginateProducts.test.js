import assert from 'node:assert/strict'
import { test } from 'node:test'
import { paginateProducts } from './paginateProducts.js'

const products = Array.from({ length: 10 }, (_value, index) => ({ id: `p-${index + 1}` }))

test('first page returns the requested number of products', () => {
  const result = paginateProducts(products, 1, 4)

  assert.deepEqual(result.items.map((product) => product.id), ['p-1', 'p-2', 'p-3', 'p-4'])
  assert.equal(result.totalPages, 3)
})

test('last page returns the remaining products', () => {
  const result = paginateProducts(products, 3, 4)

  assert.deepEqual(result.items.map((product) => product.id), ['p-9', 'p-10'])
})

test('page beyond the last page is clamped safely', () => {
  const result = paginateProducts(products, 99, 4)

  assert.equal(result.page, 3)
  assert.deepEqual(result.items.map((product) => product.id), ['p-9', 'p-10'])
})

test('empty collection has a stable first page', () => {
  const result = paginateProducts([], 2, 4)

  assert.equal(result.page, 1)
  assert.equal(result.totalPages, 1)
  assert.deepEqual(result.items, [])
})

test('pagination does not mutate the source array', () => {
  const originalIds = products.map((product) => product.id)

  paginateProducts(products, 2, 4)

  assert.deepEqual(products.map((product) => product.id), originalIds)
})
