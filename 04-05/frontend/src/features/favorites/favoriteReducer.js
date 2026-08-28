export const FAVORITE_ACTIONS = {
  TOGGLE: 'TOGGLE',
  CLEAR: 'CLEAR',
}

export const initialFavoriteState = {
  ids: [],
}

export function favoriteReducer(state, action) {
  switch (action.type) {
    case FAVORITE_ACTIONS.TOGGLE: {
      const productId = action.payload

      if (typeof productId !== 'string' || productId.trim() === '') {
        return state
      }

      return state.ids.includes(productId)
        ? { ids: state.ids.filter((id) => id !== productId) }
        : { ids: [...state.ids, productId] }
    }

    case FAVORITE_ACTIONS.CLEAR:
      return initialFavoriteState

    default:
      return state
  }
}
