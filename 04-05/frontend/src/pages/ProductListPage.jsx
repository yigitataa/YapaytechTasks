import { useEffect, useMemo, useState } from 'react'
import { getProducts } from '../api/productsApi.js'
import EmptyState from '../components/EmptyState.jsx'
import ErrorState from '../components/ErrorState.jsx'
import LoadingState from '../components/LoadingState.jsx'
import NoResultsState from '../components/NoResultsState.jsx'
import ProductControls from '../components/ProductControls.jsx'
import ProductList from '../components/ProductList.jsx'
import {
  ALL_CATEGORIES,
  deriveProducts,
  getProductCategories,
  SORT_OPTIONS,
} from '../utils/deriveProducts.js'

function ProductListPage() {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading')
  const [requestNumber, setRequestNumber] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(ALL_CATEGORIES)
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.DEFAULT)

  const categories = useMemo(() => getProductCategories(products), [products])
  const visibleProducts = useMemo(
    () => deriveProducts(products, { searchTerm, selectedCategory, sortBy }),
    [products, searchTerm, selectedCategory, sortBy],
  )
  const hasActiveControls =
    searchTerm.length > 0 ||
    selectedCategory !== ALL_CATEGORIES ||
    sortBy !== SORT_OPTIONS.DEFAULT

  function clearControls() {
    setSearchTerm('')
    setSelectedCategory(ALL_CATEGORIES)
    setSortBy(SORT_OPTIONS.DEFAULT)
  }

  useEffect(() => {
    const controller = new AbortController()

    async function loadProducts() {
      setStatus('loading')

      try {
        const data = await getProducts({ signal: controller.signal })
        setProducts(data)
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

  return (
    <div className="page-view page-view--catalog">
      <section className="catalog-hero">
        <div className="container catalog-hero__content">
          <p className="eyebrow component-enter component-enter--eyebrow">Seçilmiş ürünler</p>
          <h1 className="component-enter component-enter--title">
            Günlük hayat için <span>renkli seçimler.</span>
          </h1>
          <p className="catalog-hero__description component-enter component-enter--copy">
            Teknolojiden yaşam ürünlerine, sade bir katalogda özenle hazırlanmış seçkiler.
          </p>
        </div>
      </section>

      <section className="container catalog-section" aria-labelledby="products-heading">
        <div className="section-heading component-enter component-enter--section">
          <div>
            <p className="eyebrow">Katalog</p>
            <h2 id="products-heading">Tüm ürünler</h2>
          </div>
          {status === 'success' && products.length > 0 ? (
            <p className="result-count" aria-live="polite">
              <span aria-hidden="true" /> {visibleProducts.length} / {products.length} ürün
            </p>
          ) : null}
        </div>

        {status === 'loading' ? <LoadingState /> : null}
        {status === 'error' ? (
          <ErrorState
            message="Ürünler yüklenemedi. Bağlantını kontrol edip yeniden deneyebilirsin."
            onRetry={() => setRequestNumber((current) => current + 1)}
          />
        ) : null}
        {status === 'success' && products.length === 0 ? <EmptyState /> : null}
        {status === 'success' && products.length > 0 ? (
          <>
            <ProductControls
              searchTerm={searchTerm}
              selectedCategory={selectedCategory}
              sortBy={sortBy}
              categories={categories}
              hasActiveControls={hasActiveControls}
              onSearchChange={setSearchTerm}
              onCategoryChange={setSelectedCategory}
              onSortChange={setSortBy}
              onClear={clearControls}
            />

            {visibleProducts.length > 0 ? (
              <ProductList products={visibleProducts} />
            ) : (
              <NoResultsState searchTerm={searchTerm} onClear={clearControls} />
            )}
          </>
        ) : null}
      </section>
    </div>
  )
}

export default ProductListPage
