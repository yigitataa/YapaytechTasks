import { useEffect, useState } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import PageLoader from './components/PageLoader.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ProductDetailPage from './pages/ProductDetailPage.jsx'
import ProductListPage from './pages/ProductListPage.jsx'

function App() {
  const [isPageLoading, setIsPageLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const timer = window.setTimeout(() => setIsPageLoading(false), 720)

    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname])

  return (
    <div className="app-shell">
      {isPageLoading ? <PageLoader /> : null}

      <div className="theme-orbs" aria-hidden="true">
        <span className="theme-orb theme-orb--blue" />
        <span className="theme-orb theme-orb--purple" />
        <span className="theme-orb theme-orb--pink" />
      </div>

      <SiteHeader />

      <main id="main-content" className="main-content">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />
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
