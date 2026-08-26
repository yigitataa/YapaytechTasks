export const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  INCREASE_QUANTITY: 'INCREASE_QUANTITY',
  DECREASE_QUANTITY: 'DECREASE_QUANTITY',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAR_CART: 'CLEAR_CART',
}

export const initialCartState = {
  items: [],
}

function createCartProduct(product) {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    category: product.category,
    imageUrl: product.imageUrl,
  }
}

export function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const product = action.payload
      const existingItem = state.items.find((item) => item.product.id === product.id)

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        }
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            product: createCartProduct(product),
            quantity: 1,
          },
        ],
      }
    }

    case CART_ACTIONS.INCREASE_QUANTITY:
      return {
        ...state,
        items: state.items.map((item) =>
          item.product.id === action.payload
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      }

    case CART_ACTIONS.DECREASE_QUANTITY:
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.product.id === action.payload
              ? { ...item, quantity: item.quantity - 1 }
              : item,
          )
          .filter((item) => item.quantity > 0),
      }

    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter((item) => item.product.id !== action.payload),
      }

    case CART_ACTIONS.CLEAR_CART:
      return initialCartState

    default:
      return state
  }
}
