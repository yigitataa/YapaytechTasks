function FormFieldError({ id, message }) {
  return message ? (
    <span className="admin-form__error" id={id} role="alert">
      {message}
    </span>
  ) : null
}

function ProductForm({
  values,
  errors,
  isEditing,
  isSubmitting,
  onChange,
  onSubmit,
  onCancel,
}) {
  function fieldProps(field) {
    const errorId = `${field}-error`

    return {
      id: `product-${field}`,
      name: field,
      value: values[field],
      onChange,
      'aria-invalid': Boolean(errors[field]),
      'aria-describedby': errors[field] ? errorId : undefined,
    }
  }

  return (
    <form className="admin-form component-enter component-enter--section" onSubmit={onSubmit} noValidate>
      <div className="admin-form__heading">
        <div>
          <p className="eyebrow">{isEditing ? 'Düzenleme' : 'Yeni kayıt'}</p>
          <h2>{isEditing ? 'Ürünü güncelle' : 'Ürün oluştur'}</h2>
        </div>
        {isEditing ? (
          <button className="button button--secondary" type="button" onClick={onCancel}>
            Vazgeç
          </button>
        ) : null}
      </div>

      {errors.form ? (
        <p className="admin-form__form-error" role="alert">
          {errors.form}
        </p>
      ) : null}

      <div className="admin-form__grid">
        <label className="admin-field" htmlFor="product-name">
          <span>Ürün adı *</span>
          <input type="text" autoComplete="off" {...fieldProps('name')} />
          <FormFieldError id="name-error" message={errors.name} />
        </label>

        <label className="admin-field" htmlFor="product-price">
          <span>Fiyat (TL) *</span>
          <input type="number" min="0.01" step="0.01" {...fieldProps('price')} />
          <FormFieldError id="price-error" message={errors.price} />
        </label>

        <label className="admin-field" htmlFor="product-category">
          <span>Kategori *</span>
          <input type="text" autoComplete="off" {...fieldProps('category')} />
          <FormFieldError id="category-error" message={errors.category} />
        </label>

        <label className="admin-field" htmlFor="product-imageUrl">
          <span>Görsel adresi</span>
          <input type="url" autoComplete="off" {...fieldProps('imageUrl')} />
          <FormFieldError id="imageUrl-error" message={errors.imageUrl} />
        </label>

        <label className="admin-field admin-field--wide" htmlFor="product-description">
          <span>Açıklama</span>
          <textarea rows="4" {...fieldProps('description')} />
          <FormFieldError id="description-error" message={errors.description} />
        </label>
      </div>

      <button className="button button--primary admin-form__submit" type="submit" disabled={isSubmitting}>
        {isSubmitting
          ? 'Kaydediliyor…'
          : isEditing
            ? 'Değişiklikleri kaydet'
            : 'Ürünü oluştur'}
      </button>
    </form>
  )
}

export default ProductForm
