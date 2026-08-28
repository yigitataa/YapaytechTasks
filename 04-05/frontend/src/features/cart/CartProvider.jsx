import { useCallback, useEffect, useMemo, useReducer } from 'react'
import { CartContext } from './cartContext.js'
import { CART_ACTIONS, cartReducer, initialCartState } from './cartReducer.js'
import { selectCartSubtotal, selectTotalQuantity } from './cartSelectors.js'
import { loadCartState, saveCartState } from './cartStorage.js'

function CartProvider({ children }) {
  const [state, dispatch] = useReducer(
    cartReducer,
    initialCartState,
    () => loadCartState(),
  )

  useEffect(() => {
    saveCartState(state)
  }, [state])

  const addItem = useCallback((product) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: product })
  }, [])

  const increaseQuantity = useCallback((productId) => {
    dispatch({ type: CART_ACTIONS.INCREASE_QUANTITY, payload: productId })
  }, [])

  const decreaseQuantity = useCallback((productId) => {
    dispatch({ type: CART_ACTIONS.DECREASE_QUANTITY, payload: productId })
  }, [])

  const removeItem = useCallback((productId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: productId })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART })
  }, [])

  const value = useMemo(
    () => ({
      items: state.items,
      totalQuantity: selectTotalQuantity(state.items),
      subtotal: selectCartSubtotal(state.items),
      addItem,
      increaseQuantity,
      decreaseQuantity,
      removeItem,
      clearCart,
    }),
    [
      state.items,
      addItem,
      increaseQuantity,
      decreaseQuantity,
      removeItem,
      clearCart,
    ],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export default CartProvider
