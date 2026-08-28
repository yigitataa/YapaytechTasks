import Price from '../../components/Price.jsx'

function AdminProductList({
  products,
  pendingDeleteId,
  deletingId,
  onEdit,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
}) {
  if (products.length === 0) {
    return (
      <div className="admin-list__empty" role="status">
        Henüz yönetilecek ürün yok. Formdan ilk ürünü oluşturabilirsin.
      </div>
    )
  }

  return (
    <div className="admin-list" aria-label="Yönetilen ürünler">
      {products.map((product) => {
        const confirmsDelete = pendingDeleteId === product.id
        const isDeleting = deletingId === product.id

        return (
          <article className="admin-product" key={product.id}>
            <div className="admin-product__summary">
              <div>
                <span className="category-pill">{product.category}</span>
                <h3>{product.name}</h3>
                <small>Kimlik: {product.id}</small>
              </div>
              <Price value={product.price} />
            </div>

            <div className="admin-product__actions">
              <button className="button button--secondary" type="button" onClick={() => onEdit(product)}>
                Düzenle
              </button>
              <button className="button button--danger" type="button" onClick={() => onRequestDelete(product.id)}>
                Sil
              </button>
            </div>

            {confirmsDelete ? (
              <div className="admin-product__confirmation" role="alertdialog" aria-labelledby={`delete-${product.id}`}>
                <p id={`delete-${product.id}`}>
                  <strong>{product.name}</strong> ürününü silmek istediğine emin misin?
                </p>
                <div>
                  <button className="button button--secondary" type="button" onClick={onCancelDelete} disabled={isDeleting}>
                    İptal
                  </button>
                  <button className="button button--danger" type="button" onClick={() => onConfirmDelete(product.id)} disabled={isDeleting}>
                    {isDeleting ? 'Siliniyor…' : 'Evet, sil'}
                  </button>
                </div>
              </div>
            ) : null}
          </article>
        )
      })}
    </div>
  )
}

export default AdminProductList
