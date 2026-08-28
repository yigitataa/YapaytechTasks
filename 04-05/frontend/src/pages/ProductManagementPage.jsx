import { useEffect, useRef, useState } from 'react'
import {
  ApiError,
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '../api/productsApi.js'
import ErrorState from '../components/ErrorState.jsx'
import LoadingState from '../components/LoadingState.jsx'
import AdminProductList from '../features/admin/AdminProductList.jsx'
import ProductForm from '../features/admin/ProductForm.jsx'
import {
  createEmptyProductForm,
  productToForm,
  toProductPayload,
  validateProductForm,
} from '../features/admin/productForm.js'

function ProductManagementPage() {
  const [products, setProducts] = useState([])
  const [status, setStatus] = useState('loading')
  const [requestNumber, setRequestNumber] = useState(0)
  const [values, setValues] = useState(createEmptyProductForm)
  const [errors, setErrors] = useState({})
  const [editingId, setEditingId] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [feedback, setFeedback] = useState('')
  const formHeadingRef = useRef(null)

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

  function resetForm() {
    setValues(createEmptyProductForm())
    setErrors({})
    setEditingId(null)
  }

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined, form: undefined }))
  }

  function startEdit(product) {
    setValues(productToForm(product))
    setErrors({})
    setEditingId(product.id)
    setPendingDeleteId(null)
    setFeedback('')
    formHeadingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const validationErrors = validateProductForm(values)

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setIsSubmitting(true)
    setErrors({})
    setFeedback('')

    try {
      const payload = toProductPayload(values)

      if (editingId) {
        const updated = await updateProduct(editingId, payload)
        setProducts((current) =>
          current.map((product) => (product.id === editingId ? updated : product)),
        )
        setFeedback(`${updated.name} güncellendi.`)
      } else {
        const created = await createProduct(payload)
        setProducts((current) => [...current, created])
        setFeedback(`${created.name} oluşturuldu.`)
      }

      resetForm()
    } catch (error) {
      if (error instanceof ApiError) {
        setErrors({ ...error.details, form: error.message })
      } else {
        setErrors({ form: 'İşlem tamamlanamadı. Lütfen yeniden dene.' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  async function confirmDelete(productId) {
    setDeletingId(productId)
    setFeedback('')

    try {
      const deletedProduct = products.find((product) => product.id === productId)
      await deleteProduct(productId)
      setProducts((current) => current.filter((product) => product.id !== productId))
      setFeedback(`${deletedProduct?.name ?? 'Ürün'} silindi.`)
      setPendingDeleteId(null)
      if (editingId === productId) {
        resetForm()
      }
    } catch {
      setFeedback('Ürün silinemedi. Lütfen yeniden dene.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="page-view admin-page">
      <div className="container">
        <header className="admin-page__header component-enter component-enter--section">
          <p className="eyebrow">Bonus özellik</p>
          <h1>Ürün yönetimi</h1>
          <p>Ürün oluşturabilir, düzenleyebilir ve silebilirsin.</p>
          <div className="admin-page__warning" role="note">
            Bu ekran kimlik doğrulama veya yetkilendirme içermez. Yalnızca eğitim ve demo amaçlıdır; gerçek bir yönetici paneli değildir.
          </div>
        </header>

        {feedback ? (
          <p className="admin-feedback" role="status" aria-live="polite">
            {feedback}
          </p>
        ) : null}

        <div className="admin-layout">
          <div ref={formHeadingRef}>
            <ProductForm
              values={values}
              errors={errors}
              isEditing={Boolean(editingId)}
              isSubmitting={isSubmitting}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onCancel={resetForm}
            />
          </div>

          <section className="admin-products component-enter component-enter--section" aria-labelledby="managed-products-title">
            <div className="admin-products__heading">
              <div>
                <p className="eyebrow">Bellekteki veriler</p>
                <h2 id="managed-products-title">Mevcut ürünler</h2>
              </div>
              {status === 'success' ? <span>{products.length} ürün</span> : null}
            </div>

            {status === 'loading' ? <LoadingState /> : null}
            {status === 'error' ? (
              <ErrorState
                title="Ürünler yönetim ekranına yüklenemedi"
                message="Backend bağlantısını kontrol edip yeniden deneyebilirsin."
                onRetry={() => setRequestNumber((current) => current + 1)}
              />
            ) : null}
            {status === 'success' ? (
              <AdminProductList
                products={products}
                pendingDeleteId={pendingDeleteId}
                deletingId={deletingId}
                onEdit={startEdit}
                onRequestDelete={setPendingDeleteId}
                onCancelDelete={() => setPendingDeleteId(null)}
                onConfirmDelete={confirmDelete}
              />
            ) : null}
          </section>
        </div>
      </div>
    </div>
  )
}

export default ProductManagementPage
