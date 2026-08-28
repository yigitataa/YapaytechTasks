import { Link, useLocation } from 'react-router'
import CartLink from '../features/cart/CartLink.jsx'
import FavoriteLink from '../features/favorites/FavoriteLink.jsx'

function SiteHeader() {
  const location = useLocation()
  const productsAreCurrent =
    location.pathname === '/' || location.pathname.startsWith('/products/')

  return (
    <header className="site-header component-enter component-enter--header">
      <div className="container site-header__inner">
        <Link className="brand" to="/" aria-label="Yata Market ana sayfa">
          <span className="brand__mark" aria-hidden="true">
            Y
          </span>
          <span>Yata Market</span>
        </Link>

        <nav className="site-navigation" aria-label="Ana menü">
          <Link
            className="nav-link"
            to="/"
            aria-current={productsAreCurrent ? 'page' : undefined}
          >
            Ürünler
          </Link>
          <FavoriteLink />
          <Link
            className="nav-link nav-link--management"
            to="/manage-products"
            aria-current={location.pathname === '/manage-products' ? 'page' : undefined}
          >
            Yönetim
          </Link>
          <CartLink />
        </nav>
      </div>
    </header>
  )
}

export default SiteHeader
