import assert from 'node:assert/strict'
import { after, before, beforeEach, test } from 'node:test'
import app from '../src/app.js'
import { resetProductsForTests } from '../src/services/productService.js'

let baseUrl
let server

before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, '127.0.0.1', () => {
      const address = server.address()
      baseUrl = `http://127.0.0.1:${address.port}`
      resolve()
    })
  })
})

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()))
  })
})

beforeEach(() => {
  resetProductsForTests()
})

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options)
  const text = await response.text()

  return {
    body: text ? JSON.parse(text) : null,
    contentType: response.headers.get('content-type'),
    status: response.status,
    text,
  }
}

function jsonOptions(method, body) {
  return {
    method,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }
}

test('health endpoint returns 200 and the expected JSON', async () => {
  const response = await request('/api/health')

  assert.equal(response.status, 200)
  assert.deepEqual(response.body, { status: 'ok' })
})

test('product list returns the clean initial collection', async () => {
  const response = await request('/api/products')

  assert.equal(response.status, 200)
  assert.equal(Array.isArray(response.body), true)
  assert.equal(response.body.length, 10)
})

test('a valid product id returns the matching product', async () => {
  const response = await request('/api/products/p-001')

  assert.equal(response.status, 200)
  assert.equal(response.body.id, 'p-001')
  assert.equal(response.body.name, 'Kablosuz Kulaklık')
})

test('an unknown product id returns a controlled 404', async () => {
  const response = await request('/api/products/bilinmeyen-id')

  assert.equal(response.status, 404)
  assert.deepEqual(response.body, { message: 'Ürün bulunamadı' })
})

test('a valid product can be created with a backend id', async () => {
  const response = await request(
    '/api/products',
    jsonOptions('POST', {
      name: 'Test Ürünü',
      price: 125,
      category: 'Test',
    }),
  )

  assert.equal(response.status, 201)
  assert.equal(typeof response.body.id, 'string')
  assert.notEqual(response.body.id, '')
  assert.equal(response.body.name, 'Test Ürünü')
})

test('an invalid product create request returns 400', async () => {
  const response = await request(
    '/api/products',
    jsonOptions('POST', { price: -1, category: 'Test' }),
  )

  assert.equal(response.status, 400)
  assert.equal(response.body.message, 'Geçersiz ürün verisi')
  assert.equal(typeof response.body.details.name, 'string')
  assert.equal(typeof response.body.details.price, 'string')
})

test('PATCH changes only the submitted product field', async () => {
  const beforeUpdate = await request('/api/products/p-001')
  const response = await request(
    '/api/products/p-001',
    jsonOptions('PATCH', { price: 1999 }),
  )

  assert.equal(response.status, 200)
  assert.equal(response.body.price, 1999)
  assert.equal(response.body.name, beforeUpdate.body.name)
  assert.equal(response.body.category, beforeUpdate.body.category)
  assert.equal(response.body.description, beforeUpdate.body.description)
  assert.equal(response.body.imageUrl, beforeUpdate.body.imageUrl)
})

test('PATCH for an unknown product returns 404', async () => {
  const response = await request(
    '/api/products/bilinmeyen-id',
    jsonOptions('PATCH', { price: 100 }),
  )

  assert.equal(response.status, 404)
  assert.deepEqual(response.body, { message: 'Ürün bulunamadı' })
})

test('a deleted product returns 404 on the next GET', async () => {
  const deleteResponse = await request('/api/products/p-001', {
    method: 'DELETE',
  })
  const getResponse = await request('/api/products/p-001')

  assert.equal(deleteResponse.status, 204)
  assert.equal(deleteResponse.text, '')
  assert.equal(getResponse.status, 404)
  assert.deepEqual(getResponse.body, { message: 'Ürün bulunamadı' })
})

test('an unknown API route returns JSON 404', async () => {
  const response = await request('/api/bilinmeyen-route')

  assert.equal(response.status, 404)
  assert.match(response.contentType, /^application\/json/)
  assert.deepEqual(response.body, { message: 'Endpoint bulunamadı' })
})

test('each test receives the initial in-memory products', async () => {
  const response = await request('/api/products')

  assert.equal(response.body.length, 10)
  assert.equal(response.body.some((product) => product.id === 'p-001'), true)
})
