function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null
  }

  const pages = Array.from({ length: totalPages }, (_value, index) => index + 1)

  return (
    <nav className="pagination" aria-label="Ürün sayfaları">
      <button
        className="button button--secondary"
        type="button"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Önceki
      </button>
      <div className="pagination__pages">
        {pages.map((pageNumber) => (
          <button
            key={pageNumber}
            className={`pagination__page ${pageNumber === page ? 'pagination__page--current' : ''}`}
            type="button"
            aria-label={`${pageNumber}. sayfaya git`}
            aria-current={pageNumber === page ? 'page' : undefined}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        ))}
      </div>
      <button
        className="button button--secondary"
        type="button"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Sonraki
      </button>
    </nav>
  )
}

export default Pagination
