import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.jsx'
import CartProvider from './features/cart/CartProvider.jsx'
import FavoriteProvider from './features/favorites/FavoriteProvider.jsx'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <FavoriteProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </FavoriteProvider>
    </BrowserRouter>
  </StrictMode>,
)
