import { Link, useLocation } from 'react-router'
import { useFavorites } from './useFavorites.js'

function FavoriteLink() {
  const location = useLocation()
  const { favoriteCount } = useFavorites()

  return (
    <Link
      className="nav-link favorite-link"
      to="/favorites"
      aria-current={location.pathname === '/favorites' ? 'page' : undefined}
      aria-label={`Favoriler, ${favoriteCount} ürün`}
    >
      Favoriler
      {favoriteCount > 0 ? (
        <span className="favorite-link__count" aria-hidden="true">
          {favoriteCount}
        </span>
      ) : null}
    </Link>
  )
}

export default FavoriteLink
