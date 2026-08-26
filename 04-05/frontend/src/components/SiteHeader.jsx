import { Link } from 'react-router'
import CartLink from '../features/cart/CartLink.jsx'

function SiteHeader() {
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
          <Link className="nav-link" to="/">
            Ürünler
          </Link>
          <CartLink />
        </nav>
      </div>
    </header>
  )
}

export default SiteHeader
