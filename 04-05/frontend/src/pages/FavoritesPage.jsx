import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { getProducts } from '../api/productsApi.js'
import ErrorState from '../components/ErrorState.jsx'
import LoadingState from '../components/LoadingState.jsx'
import ProductList from '../components/ProductList.jsx'
import { useFavorites } from '../features/favorites/useFavorites.js'

function FavoriteResults({ favoriteIds }) {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading')
  const [requestNumber, setRequestNumber] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadProducts() {
      setStatus('loading')

      try {
        setProducts(await getProducts({ signal: controller.signal }))
        setStatus('success')
      } catch (error) {
        if (error.name !== 'AbortError') {
          setStatus('error')
        }
      }
    }

    loadProducts()
    return () => controller.abort()
  }, [requestNumber])

  const favoriteProducts = useMemo(
    () => products.filter((product) => favoriteIds.includes(product.id)),
    [products, favoriteIds],
  )

  return (
    <>
      {status === 'loading' ? <LoadingState /> : null}
      {status === 'error' ? (
        <ErrorState
          title="Favorileri şu anda gösteremiyoruz"
          message="Ürünler yüklenemedi. Bağlantını kontrol edip yeniden deneyebilirsin."
          onRetry={() => setRequestNumber((current) => current + 1)}
        />
      ) : null}
      {status === 'success' && favoriteProducts.length > 0 ? (
        <ProductList products={favoriteProducts} />
      ) : null}
      {status === 'success' && favoriteProducts.length === 0 ? (
        <section className="status-panel component-enter component-enter--status" role="status">
          <span className="status-panel__icon" aria-hidden="true">♡</span>
          <p className="eyebrow">Favoriler</p>
          <h2>Favori ürünler bulunamadı</h2>
          <p>Ürünler değişmiş olabilir. Favori seçimini temizleyip yeniden deneyebilirsin.</p>
          <Link className="button button--primary" to="/">Ürünleri keşfet</Link>
        </section>
      ) : null}
    </>
  )
}

function EmptyFavorites() {
  return (
    <section className="status-panel component-enter component-enter--status" role="status">
      <span className="status-panel__icon" aria-hidden="true">♡</span>
      <p className="eyebrow">Favoriler</p>
      <h2>Henüz favori ürünün yok</h2>
      <p>Katalog veya ürün detayındaki kalp düğmesiyle favori ekleyebilirsin.</p>
      <Link className="button button--primary" to="/">Ürünleri keşfet</Link>
    </section>
  )
}

function FavoritesPage() {
  const { favoriteIds, clearFavorites } = useFavorites()

  return (
    <div className="container favorites-page page-view">
      <header className="favorites-page__header component-enter component-enter--section">
        <div>
          <p className="eyebrow">Favorilerim</p>
          <h1>Beğendiğin ürünler bir arada</h1>
          <p>Favoriler sepetten ayrı tutulur ve uygulama açık kaldığı sürece sayfalar arasında paylaşılır.</p>
        </div>
        {favoriteIds.length > 0 ? (
          <button className="button button--secondary" type="button" onClick={clearFavorites}>
            Favorileri temizle
          </button>
        ) : null}
      </header>

      {favoriteIds.length > 0 ? (
        <FavoriteResults favoriteIds={favoriteIds} />
      ) : (
        <EmptyFavorites />
      )}
    </div>
  )
}

export default FavoritesPage
