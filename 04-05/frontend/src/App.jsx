import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import PageLoader from './components/PageLoader.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import CartPage from './pages/CartPage.jsx'
import FavoritesPage from './pages/FavoritesPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import ProductListPage from './pages/ProductListPage.jsx'
import ProductManagementPage from './pages/ProductManagementPage.jsx'

function App() {
  const [isPageLoading, setIsPageLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const timer = window.setTimeout(
      () => setIsPageLoading(false),
      reduceMotion ? 0 : 720,
    )

    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname])

  return (
    <div className="app-shell">
      {isPageLoading ? <PageLoader /> : null}

      <a className="skip-link" href="#main-content">
        Ana içeriğe geç
      </a>

      <div className="theme-orbs" aria-hidden="true">
        <span className="theme-orb theme-orb--blue" />
        <span className="theme-orb theme-orb--purple" />
        <span className="theme-orb theme-orb--pink" />
      </div>

      <SiteHeader />

      <main id="main-content" className="main-content" tabIndex="-1">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/manage-products" element={<ProductManagementPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="site-footer component-enter component-enter--footer">
        <div className="container site-footer__inner">
          <span>Yata Market</span>
          <span>Ürün verileri Express API üzerinden gelir.</span>
        </div>
      </footer>
    </div>
  )
}

export default App
