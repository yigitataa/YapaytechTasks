import { ALL_CATEGORIES, SORT_OPTIONS } from '../utils/deriveProducts.js'

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  )
}

function ProductControls({
  searchTerm,
  selectedCategory,
  sortBy,
  minPrice,
  maxPrice,
  priceRangeError,
  categories,
  hasActiveControls,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onMinPriceChange,
  onMaxPriceChange,
  onClear,
}) {
  return (
    <section
      className="product-controls component-enter component-enter--controls"
      aria-labelledby="product-controls-heading"
    >
      <div className="product-controls__intro">
        <p className="eyebrow">Hızlı keşif</p>
        <h3 id="product-controls-heading">Aradığın ürünü kolayca bul</h3>
      </div>

      <div className="control-field control-field--search">
        <label htmlFor="product-search">Ürün ara</label>
        <div className="search-input">
          <span className="search-input__icon">
            <SearchIcon />
          </span>
          <input
            id="product-search"
            type="search"
            value={searchTerm}
            placeholder="Ürün adına göre ara"
            autoComplete="off"
            onChange={(event) => onSearchChange(event.target.value)}
          />
          {searchTerm ? (
            <button
              className="search-input__clear"
              type="button"
              aria-label="Aramayı temizle"
              onClick={() => onSearchChange('')}
            >
              ×
            </button>
          ) : null}
        </div>
      </div>

      <div className="control-field">
        <label htmlFor="category-filter">Kategori</label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value={ALL_CATEGORIES}>Tüm kategoriler</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div className="control-field">
        <label htmlFor="product-sort">Sırala</label>
        <select
          id="product-sort"
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
        >
          <option value={SORT_OPTIONS.DEFAULT}>Önerilen sıra</option>
          <option value={SORT_OPTIONS.PRICE_ASCENDING}>Fiyat: düşükten yükseğe</option>
          <option value={SORT_OPTIONS.PRICE_DESCENDING}>Fiyat: yüksekten düşüğe</option>
        </select>
      </div>

      <fieldset
        className="control-field control-field--price"
        aria-describedby={priceRangeError ? 'price-range-error' : undefined}
      >
        <legend>Fiyat aralığı</legend>
        <div className="price-range-inputs">
          <label>
            <span>Minimum</span>
            <input
              type="number"
              min="0"
              step="1"
              inputMode="decimal"
              value={minPrice}
              placeholder="0"
              aria-invalid={Boolean(priceRangeError)}
              onChange={(event) => onMinPriceChange(event.target.value)}
            />
          </label>
          <label>
            <span>Maksimum</span>
            <input
              type="number"
              min="0"
              step="1"
              inputMode="decimal"
              value={maxPrice}
              placeholder="5000"
              aria-invalid={Boolean(priceRangeError)}
              onChange={(event) => onMaxPriceChange(event.target.value)}
            />
          </label>
        </div>
        {priceRangeError ? (
          <p id="price-range-error" className="control-field__error" role="alert">
            {priceRangeError}
          </p>
        ) : null}
      </fieldset>

      <button
        className="button button--secondary product-controls__clear"
        type="button"
        disabled={!hasActiveControls}
        onClick={onClear}
      >
        Seçimleri temizle
      </button>
    </section>
  )
}

export default ProductControls
