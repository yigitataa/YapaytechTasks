import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  FAVORITE_ACTIONS,
  favoriteReducer,
  initialFavoriteState,
} from './favoriteReducer.js'

function toggle(state, productId) {
  return favoriteReducer(state, {
    type: FAVORITE_ACTIONS.TOGGLE,
    payload: productId,
  })
}

test('first toggle adds one unique favorite id', () => {
  assert.deepEqual(toggle(initialFavoriteState, 'p-1').ids, ['p-1'])
})

test('toggling the same product removes it instead of duplicating it', () => {
  const selected = toggle(initialFavoriteState, 'p-1')
  const cleared = toggle(selected, 'p-1')

  assert.deepEqual(cleared.ids, [])
})

test('different favorite products remain unique', () => {
  const state = toggle(toggle(initialFavoriteState, 'p-1'), 'p-2')

  assert.deepEqual(state.ids, ['p-1', 'p-2'])
})

test('clear removes all favorites', () => {
  const state = { ids: ['p-1', 'p-2'] }

  assert.deepEqual(
    favoriteReducer(state, { type: FAVORITE_ACTIONS.CLEAR }),
    initialFavoriteState,
  )
})

test('invalid product ids are ignored', () => {
  assert.equal(toggle(initialFavoriteState, '   '), initialFavoriteState)
})
