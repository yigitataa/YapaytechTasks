import { useFavorites } from './useFavorites.js'

function FavoriteButton({ product, className = '' }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const selected = isFavorite(product.id)
  const actionLabel = selected ? 'favorilerden çıkar' : 'favorilere ekle'

  return (
    <button
      className={`favorite-button ${selected ? 'favorite-button--selected' : ''} ${className}`.trim()}
      type="button"
      aria-label={`${product.name} ürününü ${actionLabel}`}
      aria-pressed={selected}
      title={selected ? 'Favorilerden çıkar' : 'Favorilere ekle'}
      onClick={() => toggleFavorite(product.id)}
    >
      <span aria-hidden="true">{selected ? '♥' : '♡'}</span>
    </button>
  )
}

export default FavoriteButton
