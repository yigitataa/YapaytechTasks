import { useCallback, useMemo, useReducer } from 'react'
import { FavoriteContext } from './favoriteContext.js'
import {
  FAVORITE_ACTIONS,
  favoriteReducer,
  initialFavoriteState,
} from './favoriteReducer.js'

function FavoriteProvider({ children }) {
  const [state, dispatch] = useReducer(favoriteReducer, initialFavoriteState)

  const toggleFavorite = useCallback((productId) => {
    dispatch({ type: FAVORITE_ACTIONS.TOGGLE, payload: productId })
  }, [])

  const clearFavorites = useCallback(() => {
    dispatch({ type: FAVORITE_ACTIONS.CLEAR })
  }, [])

  const isFavorite = useCallback(
    (productId) => state.ids.includes(productId),
    [state.ids],
  )

  const value = useMemo(
    () => ({
      favoriteIds: state.ids,
      favoriteCount: state.ids.length,
      isFavorite,
      toggleFavorite,
      clearFavorites,
    }),
    [state.ids, isFavorite, toggleFavorite, clearFavorites],
  )

  return (
    <FavoriteContext.Provider value={value}>
      {children}
    </FavoriteContext.Provider>
  )
}

export default FavoriteProvider
