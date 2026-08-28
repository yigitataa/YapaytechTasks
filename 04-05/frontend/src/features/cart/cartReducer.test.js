import assert from 'node:assert/strict'
import { test } from 'node:test'
import { CART_ACTIONS, cartReducer, initialCartState } from './cartReducer.js'
import {
  selectCartSubtotal,
  selectLineTotal,
  selectTotalQuantity,
} from './cartSelectors.js'

const firstProduct = {
  id: 'p-1',
  name: 'Birinci Ürün',
  price: 100,
  category: 'Test',
  imageUrl: '',
}
const secondProduct = {
  id: 'p-2',
  name: 'İkinci Ürün',
  price: 75,
  category: 'Test',
  imageUrl: '',
}

function dispatch(state, type, payload) {
  return cartReducer(state, { type, payload })
}

function add(state, product) {
  return dispatch(state, CART_ACTIONS.ADD_ITEM, product)
}

test('first add creates an item with quantity 1', () => {
  const state = add(initialCartState, firstProduct)

  assert.equal(state.items.length, 1)
  assert.equal(state.items[0].quantity, 1)
})

test('adding the same product increases its quantity', () => {
  const state = add(add(initialCartState, firstProduct), firstProduct)

  assert.equal(state.items.length, 1)
  assert.equal(state.items[0].quantity, 2)
})

test('different products remain in separate rows', () => {
  const state = add(add(initialCartState, firstProduct), secondProduct)

  assert.deepEqual(state.items.map((item) => item.product.id), ['p-1', 'p-2'])
})

test('increase action increments only the target item', () => {
  const initial = add(add(initialCartState, firstProduct), secondProduct)
  const state = dispatch(initial, CART_ACTIONS.INCREASE_QUANTITY, 'p-1')

  assert.deepEqual(state.items.map((item) => item.quantity), [2, 1])
})

test('decrease action reduces a quantity greater than 1', () => {
  const initial = add(add(initialCartState, firstProduct), firstProduct)
  const state = dispatch(initial, CART_ACTIONS.DECREASE_QUANTITY, 'p-1')

  assert.equal(state.items[0].quantity, 1)
})

test('decreasing quantity 1 removes the item', () => {
  const initial = add(initialCartState, firstProduct)
  const state = dispatch(initial, CART_ACTIONS.DECREASE_QUANTITY, 'p-1')

  assert.deepEqual(state.items, [])
})

test('remove action deletes only the target item', () => {
  const initial = add(add(initialCartState, firstProduct), secondProduct)
  const state = dispatch(initial, CART_ACTIONS.REMOVE_ITEM, 'p-1')

  assert.deepEqual(state.items.map((item) => item.product.id), ['p-2'])
})

test('quantity never becomes negative', () => {
  const initial = add(initialCartState, firstProduct)
  const removed = dispatch(initial, CART_ACTIONS.DECREASE_QUANTITY, 'p-1')
  const state = dispatch(removed, CART_ACTIONS.DECREASE_QUANTITY, 'p-1')

  assert.equal(state.items.some((item) => item.quantity < 0), false)
})

test('total quantity sums all item quantities', () => {
  const items = [
    { product: firstProduct, quantity: 2 },
    { product: secondProduct, quantity: 1 },
  ]

  assert.equal(selectTotalQuantity(items), 3)
})

test('line total multiplies price by quantity', () => {
  assert.equal(selectLineTotal({ product: firstProduct, quantity: 2 }), 200)
})

test('cart subtotal sums every line total', () => {
  const items = [
    { product: firstProduct, quantity: 2 },
    { product: secondProduct, quantity: 1 },
  ]

  assert.equal(selectCartSubtotal(items), 275)
})

test('invalid price or quantity cannot produce NaN', () => {
  const items = [
    { product: { ...firstProduct, price: 'geçersiz' }, quantity: 2 },
    { product: secondProduct, quantity: Number.NaN },
  ]

  assert.equal(Number.isNaN(selectTotalQuantity(items)), false)
  assert.equal(Number.isNaN(selectLineTotal(items[0])), false)
  assert.equal(Number.isNaN(selectCartSubtotal(items)), false)
  assert.equal(selectCartSubtotal(items), 0)
})
