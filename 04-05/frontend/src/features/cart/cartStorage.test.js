import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  CART_STORAGE_KEY,
  loadCartState,
  saveCartState,
} from './cartStorage.js'

const validState = {
  items: [
    {
      product: {
        id: 'p-1',
        name: 'Test Ürünü',
        price: 125,
        category: 'Test',
        imageUrl: 'https://example.com/product.png',
      },
      quantity: 2,
    },
  ],
}

function createStorage(initialValue = null) {
  let value = initialValue

  return {
    getItem(key) {
      assert.equal(key, CART_STORAGE_KEY)
      return value
    },
    setItem(key, nextValue) {
      assert.equal(key, CART_STORAGE_KEY)
      value = nextValue
    },
    read() {
      return value
    },
  }
}

test('missing storage value loads an empty cart', () => {
  assert.deepEqual(loadCartState(createStorage()), { items: [] })
})

test('a valid stored cart is restored', () => {
  const storage = createStorage(JSON.stringify(validState))

  assert.deepEqual(loadCartState(storage), validState)
})

test('restored data is copied and unknown fields are removed', () => {
  const storedState = {
    items: [
      {
        ...validState.items[0],
        unexpected: true,
        product: { ...validState.items[0].product, description: 'Gizli alan' },
      },
    ],
  }
  const storage = createStorage(JSON.stringify(storedState))

  assert.deepEqual(loadCartState(storage), validState)
})

test('malformed JSON falls back to an empty cart', () => {
  assert.deepEqual(loadCartState(createStorage('{broken-json')), { items: [] })
})

test('invalid item data falls back to an empty cart', () => {
  const invalidStates = [
    { items: [{ ...validState.items[0], quantity: 0 }] },
    {
      items: [
        {
          ...validState.items[0],
          product: { ...validState.items[0].product, price: '125' },
        },
      ],
    },
    { items: [{ product: { id: 'p-1' }, quantity: 1 }] },
  ]

  for (const state of invalidStates) {
    assert.deepEqual(loadCartState(createStorage(JSON.stringify(state))), {
      items: [],
    })
  }
})

test('duplicate product rows fall back to an empty cart', () => {
  const duplicateState = {
    items: [validState.items[0], { ...validState.items[0] }],
  }

  assert.deepEqual(
    loadCartState(createStorage(JSON.stringify(duplicateState))),
    { items: [] },
  )
})

test('saving and loading preserves products and quantities', () => {
  const storage = createStorage()

  assert.equal(saveCartState(validState, storage), true)
  assert.deepEqual(loadCartState(storage), validState)
})

test('saving an empty cart updates storage with an empty item list', () => {
  const storage = createStorage(JSON.stringify(validState))

  assert.equal(saveCartState({ items: [] }, storage), true)
  assert.deepEqual(JSON.parse(storage.read()), { items: [] })
})

test('storage access errors do not escape to the application', () => {
  const unavailableStorage = {
    getItem() {
      throw new Error('Storage unavailable')
    },
    setItem() {
      throw new Error('Storage unavailable')
    },
  }

  assert.deepEqual(loadCartState(unavailableStorage), { items: [] })
  assert.equal(saveCartState(validState, unavailableStorage), false)
})

test('invalid application state is not persisted', () => {
  const storage = createStorage()

  assert.equal(saveCartState({ items: [{ quantity: -1 }] }, storage), false)
  assert.equal(storage.read(), null)
})
