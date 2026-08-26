import { useState } from 'react'

function ImagePlaceholder() {
  return (
    <div className="product-image__placeholder" role="img" aria-label="Ürün görseli bulunamadı">
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <path d="M12 18a6 6 0 0 1 6-6h28a6 6 0 0 1 6 6v28a6 6 0 0 1-6 6H18a6 6 0 0 1-6-6V18Z" />
        <circle cx="24" cy="25" r="5" />
        <path d="m17 45 11-11 7 7 5-5 8 9" />
      </svg>
      <span>Görsel yok</span>
    </div>
  )
}

function ProductImage({ src, alt, eager = false }) {
  const [failedSource, setFailedSource] = useState('')
  const imageFailed = !src || failedSource === src

  return (
    <div className="product-image component-enter component-enter--media">
      {imageFailed ? (
        <ImagePlaceholder />
      ) : (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          onError={() => setFailedSource(src)}
        />
      )}
    </div>
  )
}

export default ProductImage
