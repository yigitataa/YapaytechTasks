import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ApiError, getProductById } from '../api/productsApi.js'
import ErrorState from '../components/ErrorState.jsx'
import LoadingState from '../components/LoadingState.jsx'
import Price from '../components/Price.jsx'
import ProductImage from '../components/ProductImage.jsx'
import AddToCartButton from '../features/cart/AddToCartButton.jsx'
import NotFoundPage from './NotFoundPage.jsx'

function ProductDetailPage() {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [status, setStatus] = useState('loading')
  const [requestNumber, setRequestNumber] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadProduct() {
      setStatus('loading')

      try {
        const data = await getProductById(productId, { signal: controller.signal })
        setProduct(data)
        setStatus('success')
      } catch (error) {
        if (error.name !== 'AbortError') {
          setStatus(error instanceof ApiError && error.status === 404 ? 'not-found' : 'error')
        }
      }
    }

    loadProduct()

    return () => controller.abort()
  }, [productId, requestNumber])

  if (status === 'not-found') {
    return <NotFoundPage productNotFound />
  }

  return (
    <div className="container detail-page page-view">
      <Link className="back-link" to="/">
        <span aria-hidden="true">←</span> Ürünlere dön
      </Link>

      {status === 'loading' ? <LoadingState variant="detail" /> : null}
      {status === 'error' ? (
        <ErrorState
          message="Ürün bilgileri yüklenemedi. Bağlantını kontrol edip yeniden deneyebilirsin."
          onRetry={() => setRequestNumber((current) => current + 1)}
          title="Ürünü şu anda gösteremiyoruz"
          headingLevel="h1"
        />
      ) : null}

      {status === 'success' && product ? (
        <article className="product-detail component-enter component-enter--detail">
          <div className="product-detail__media component-enter component-enter--detail-media">
            <ProductImage
              src={product.imageUrl}
              alt={`${product.name} ürün görseli`}
              eager
            />
          </div>

          <div className="product-detail__content component-enter component-enter--detail-copy">
            <span className="category-pill">{product.category}</span>
            <h1>{product.name}</h1>
            <Price value={product.price} className="product-detail__price" />
            <div className="product-detail__divider" />
            <section aria-labelledby="description-heading">
              <h2 id="description-heading">Ürün hakkında</h2>
              <p>{product.description || 'Bu ürün için henüz açıklama eklenmedi.'}</p>
            </section>
            <AddToCartButton product={product} />
            <dl className="product-meta">
              <div>
                <dt>Kategori</dt>
                <dd>{product.category}</dd>
              </div>
              <div>
                <dt>Ürün kodu</dt>
                <dd>{product.id}</dd>
              </div>
            </dl>
          </div>
        </article>
      ) : null}
    </div>
  )
}

export default ProductDetailPage
