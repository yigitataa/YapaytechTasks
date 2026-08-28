import { useContext } from 'react'
import { FavoriteContext } from './favoriteContext.js'

export function useFavorites() {
  const context = useContext(FavoriteContext)

  if (!context) {
    throw new Error('useFavorites yalnız FavoriteProvider içinde kullanılabilir.')
  }

  return context
}
