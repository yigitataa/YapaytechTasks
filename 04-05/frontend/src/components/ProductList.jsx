import ProductCard from './ProductCard.jsx'

function ProductList({ products }) {
  return (
    <div className="product-grid" aria-label="Ürün listesi">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          eagerImage={index < 4}
          revealIndex={index}
        />
      ))}
    </div>
  )
}

export default ProductList
