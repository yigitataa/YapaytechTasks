import type {
  Brand,
  BrandsResponse,
  CostEstimateResponse,
  DetailsResponse,
  SearchListing,
  SearchResponse,
} from '@vehicle-cost/contracts';
import { type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ApiClientError, estimateCost, getBrands, getVehicleDetails, searchListings } from './api';
import {
  cleanListingDisplayText,
  extractFuelOptions,
  extractRawLocation,
  findRawDetailValue,
  getNestedApiError,
} from './raw-data';

type LoadStatus = 'idle' | 'loading' | 'success' | 'error';
type AppView = 'brands' | 'listings' | 'details';

const CONSUMPTION_LABELS = [
  'Ortalama Yakıt Tüketimi',
  'Ort. Yakıt Tüketimi',
  'Ortalama Tüketim',
  'Yakıt Tüketimi',
] as const;
const TANK_LABELS = ['Yakıt Deposu', 'Depo Kapasitesi', 'Yakıt Deposu Hacmi'] as const;

function userError(error: unknown): string {
  if (error instanceof ApiClientError) {
    if (error.code === 'UPSTREAM_ERROR') {
      return 'Arabam kaynağı Cloudflare/403 erişim kontrolü, timeout veya geçici bir kaynak hatası nedeniyle yanıt vermedi. Erişim kontrolü aşılmaya çalışılmadı.';
    }
    if (error.code === 'UNKNOWN_ERROR') {
      return 'API sunucusundan geçerli bir yanıt alınamadı. Projeyi kök dizinde “npm run dev” ile başlatıp yeniden deneyin.';
    }
    return error.message;
  }

  if (error instanceof TypeError) {
    return 'API sunucusuna ulaşılamıyor. Projeyi kök dizinde “npm run dev” ile başlatın; istemci ve sunucu birlikte açılmalıdır.';
  }

  if (error instanceof Error && error.name === 'ZodError') {
    return 'API yanıtı beklenen biçimde değil. İstemci ve sunucu süreçlerini birlikte yeniden başlatın.';
  }

  return 'Beklenmeyen bir istemci hatası oluştu.';
}

function displayImageSource(rawSource: string): string {
  if (rawSource.startsWith('//')) {
    return `https:${rawSource}`;
  }
  if (rawSource.startsWith('/')) {
    return `https://www.arabam.com${rawSource}`;
  }
  return rawSource;
}

function formatTimestamp(value: string): string {
  try {
    return new Intl.DateTimeFormat('tr-TR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function getListingTitle(listing: SearchListing | undefined, brand: Brand | undefined): string {
  const preferredCell = listing?.cells.find((cell) => /ilan başlığı|model|araç/i.test(cell.label));
  return preferredCell?.value || listing?.cells[0]?.value || `${brand?.name ?? 'Araç'} ilanı`;
}

function StatusMessage({
  tone = 'neutral',
  children,
}: {
  tone?: 'neutral' | 'error' | 'success';
  children: React.ReactNode;
}) {
  return (
    <div
      className={`status-message status-message--${tone}`}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      {children}
    </div>
  );
}

export function App() {
  const [view, setView] = useState<AppView>('brands');
  const [catalog, setCatalog] = useState<BrandsResponse>();
  const [brandStatus, setBrandStatus] = useState<LoadStatus>('loading');
  const [brandError, setBrandError] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<Brand>();

  const [searchResult, setSearchResult] = useState<SearchResponse>();
  const [searchStatus, setSearchStatus] = useState<LoadStatus>('idle');
  const [searchError, setSearchError] = useState('');

  const [selectedListing, setSelectedListing] = useState<SearchListing>();
  const [details, setDetails] = useState<DetailsResponse>();
  const [detailStatus, setDetailStatus] = useState<LoadStatus>('idle');
  const [detailError, setDetailError] = useState('');

  const [selectedFuelIndex, setSelectedFuelIndex] = useState('');
  const [monthlyKm, setMonthlyKm] = useState('');
  const [costStatus, setCostStatus] = useState<LoadStatus>('idle');
  const [costError, setCostError] = useState('');
  const [costResult, setCostResult] = useState<CostEstimateResponse>();
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const didLoadBrands = useRef(false);
  const screenHeadingRef = useRef<HTMLHeadingElement>(null);
  const modalCloseRef = useRef<HTMLButtonElement>(null);

  const loadBrands = useCallback(async () => {
    setBrandStatus('loading');
    setBrandError('');

    try {
      const response = await getBrands();
      setCatalog(response);
      setBrandStatus('success');
    } catch (error) {
      setBrandError(userError(error));
      setBrandStatus('error');
    }
  }, []);

  useEffect(() => {
    if (didLoadBrands.current) {
      return;
    }
    didLoadBrands.current = true;
    void loadBrands();
  }, [loadBrands]);

  useEffect(() => {
    if (view !== 'brands') {
      screenHeadingRef.current?.focus();
    }
  }, [view]);

  useEffect(() => {
    if (activeImageIndex === null) {
      return;
    }

    const imageCount = details?.images.length ?? 0;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveImageIndex(null);
      } else if (event.key === 'ArrowLeft' && imageCount > 1) {
        setActiveImageIndex((current) =>
          current === null ? null : (current - 1 + imageCount) % imageCount,
        );
      } else if (event.key === 'ArrowRight' && imageCount > 1) {
        setActiveImageIndex((current) => (current === null ? null : (current + 1) % imageCount));
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    modalCloseRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeImageIndex, details?.images.length]);

  const visibleBrands = useMemo(() => {
    const query = brandFilter.trim().toLocaleLowerCase('tr-TR');
    return (catalog?.items ?? []).filter((brand) =>
      brand.name.toLocaleLowerCase('tr-TR').includes(query),
    );
  }, [brandFilter, catalog]);

  const fuelOptions = useMemo(
    () => extractFuelOptions(details?.fuelPriceResponse),
    [details?.fuelPriceResponse],
  );
  const averageConsumption = details ? findRawDetailValue(details, CONSUMPTION_LABELS) : undefined;
  const fuelTankLiters = details ? findRawDetailValue(details, TANK_LABELS) : undefined;
  const fuelPriceError = getNestedApiError(details?.fuelPriceResponse);
  const shouldPrependListingImageColumn = Boolean(
    searchResult?.items.some((listing) => listing.imageSrc) &&
    searchResult.headers[0]?.trim() !== '',
  );
  const visibleDetailSections = useMemo(() => {
    if (!details) {
      return [];
    }

    const seenFields = new Set<string>();

    return details.sections
      .map((section, index) => {
        const fields = section.fields.filter((field) => {
          const key = `${field.label}\u0000${field.value}`;
          if (seenFields.has(key)) {
            return false;
          }
          seenFields.add(key);
          return true;
        });
        const rawText =
          section.fields.length === 0 ? section.rawText.replace(/\s+/g, ' ').trim() : '';

        return {
          title: section.title.trim() || (index === 0 ? 'Araç özellikleri' : 'Ek bilgiler'),
          fields,
          rawText,
        };
      })
      .filter((section) => section.fields.length > 0 || section.rawText.length > 0);
  }, [details]);
  const activeImageSource =
    activeImageIndex === null ? undefined : details?.images[activeImageIndex];

  function showBrands() {
    setActiveImageIndex(null);
    setView('brands');
  }

  function showListings() {
    setActiveImageIndex(null);
    if (selectedBrand) {
      setView('listings');
    }
  }

  async function selectBrand(brand: Brand) {
    setSelectedBrand(brand);
    setView('listings');
    setSearchStatus('loading');
    setSearchError('');
    setSearchResult(undefined);
    setSelectedListing(undefined);
    setDetails(undefined);
    setDetailStatus('idle');
    setCostResult(undefined);
    setActiveImageIndex(null);

    try {
      const result = await searchListings(brand.slug);
      setSearchResult(result);
      setSearchStatus('success');
    } catch (error) {
      setSearchError(userError(error));
      setSearchStatus('error');
    }
  }

  async function selectListing(listing: SearchListing) {
    if (!listing.detailHref) {
      return;
    }

    setSelectedListing(listing);
    setView('details');
    setDetailStatus('loading');
    setDetailError('');
    setDetails(undefined);
    setSelectedFuelIndex('');
    setMonthlyKm('');
    setCostResult(undefined);
    setCostError('');
    setActiveImageIndex(null);

    const location = extractRawLocation(listing);

    try {
      const response = await getVehicleDetails({
        detailHref: listing.detailHref,
        city: location.city,
        district: location.district,
      });
      setDetails(response);
      setDetailStatus('success');
    } catch (error) {
      setDetailError(userError(error));
      setDetailStatus('error');
    }
  }

  async function submitCost(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCostError('');
    setCostResult(undefined);

    const selectedFuel = fuelOptions[Number(selectedFuelIndex)];
    if (!monthlyKm || !Number.isFinite(Number(monthlyKm)) || Number(monthlyKm) <= 0) {
      setCostError('Aylık kilometre sıfırdan büyük, geçerli bir sayı olmalıdır.');
      return;
    }
    if (!averageConsumption || !fuelTankLiters) {
      setCostError('Kaynakta hesaplamaya uygun tüketim veya depo bilgisi bulunmuyor.');
      return;
    }
    if (!selectedFuel) {
      setCostError('Hesaplama için bir yakıt fiyatı seçin.');
      return;
    }

    setCostStatus('loading');
    try {
      const response = await estimateCost({
        monthlyKm,
        averageConsumption,
        fuelTankLiters,
        pricePerLiter: selectedFuel.price,
      });
      setCostResult(response);
      setCostStatus('success');
    } catch (error) {
      setCostError(userError(error));
      setCostStatus('error');
    }
  }

  const listingTitle = getListingTitle(selectedListing, selectedBrand);

  function moveActiveImage(offset: number) {
    const imageCount = details?.images.length ?? 0;
    if (imageCount < 2) {
      return;
    }

    setActiveImageIndex((current) =>
      current === null ? null : (current + offset + imageCount) % imageCount,
    );
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        Ana içeriğe geç
      </a>
      <header className="site-header">
        <button className="site-home" type="button" onClick={showBrands} aria-label="Ana sayfa">
          <span className="brand-mark" aria-hidden="true">
            YO
          </span>
          <span>
            <span className="eyebrow">Ham kaynak verisiyle</span>
            <span className="site-name">YataOil</span>
          </span>
        </button>
        <span className="live-badge">Arabam + CollectAPI</span>
      </header>

      <main id="main-content" className="app-shell">
        {view === 'brands' && (
          <>
            <section className="hero" aria-labelledby="page-title">
              <div>
                <p className="eyebrow">Araç keşfi ve yakıt bütçesi</p>
                <h1 id="page-title">Aracını bul, detayını incele.</h1>
                <p className="hero-copy">
                  Önce markanı seç. İlanları ayrı bir sonuç ekranında incele, araç detayına geçince
                  yakıt maliyetini hesapla.
                </p>
              </div>
              <div className="source-card">
                <span>Veri ilkesi</span>
                <strong>Normalizasyon yok</strong>
                <small>İlanlar ve detaylar saklanmaz.</small>
              </div>
            </section>

            <section className="panel catalog-panel" aria-labelledby="brands-title">
              <div className="section-heading">
                <div>
                  <h2 id="brands-title">Popüler araç markaları</h2>
                </div>
                {catalog && (
                  <p className="metadata">
                    {catalog.items.length} marka · Kaynak: {catalog.source}
                  </p>
                )}
              </div>

              <label className="search-field">
                <span>Markalarda ara</span>
                <input
                  type="search"
                  value={brandFilter}
                  onChange={(event) => setBrandFilter(event.target.value)}
                  placeholder="Örn. Audi"
                />
              </label>

              {brandStatus === 'loading' && <StatusMessage>Markalar yükleniyor…</StatusMessage>}
              {brandStatus === 'error' && (
                <div className="state-actions">
                  <StatusMessage tone="error">{brandError}</StatusMessage>
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => void loadBrands()}
                  >
                    Yeniden dene
                  </button>
                </div>
              )}
              {brandStatus === 'success' && visibleBrands.length === 0 && (
                <StatusMessage>Aramanızla eşleşen marka yok.</StatusMessage>
              )}
              <div className="brand-grid" aria-label="Araç markaları">
                {visibleBrands.map((brand) => (
                  <button
                    className="brand-button"
                    key={brand.slug}
                    type="button"
                    onClick={() => void selectBrand(brand)}
                    aria-label={`${brand.name} ilanlarını gör`}
                  >
                    <span>{brand.name.slice(0, 1)}</span>
                    <strong>{brand.name}</strong>
                    <small>İlanları gör →</small>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {view === 'listings' && (
          <section className="market-screen" aria-labelledby="listings-title">
            <nav className="breadcrumbs" aria-label="Sayfa yolu">
              <button type="button" onClick={showBrands}>
                Markalar
              </button>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{selectedBrand?.name ?? 'İlanlar'}</span>
            </nav>

            <div className="screen-heading">
              <div>
                <p className="eyebrow">İkinci el otomobil ilanları</p>
                <h1 id="listings-title" ref={screenHeadingRef} tabIndex={-1}>
                  {selectedBrand?.name ?? 'Marka'} ilanları
                </h1>
                <p>Kaynak sayfanın ilk sayfasındaki ilanlar, kolon sırası korunarak gösterilir.</p>
              </div>
              {searchResult && (
                <div className="result-summary">
                  <strong>{searchResult.items.length}</strong>
                  <span>ilan bulundu</span>
                  <small>{formatTimestamp(searchResult.fetchedAt)}</small>
                </div>
              )}
            </div>

            <div className="panel results-panel">
              <div className="results-toolbar">
                <button className="back-button" type="button" onClick={showBrands}>
                  ← Marka değiştir
                </button>
                <p className="raw-note">Tüm alanlar Arabam kaynağından ham gelir.</p>
              </div>

              {searchStatus === 'loading' && (
                <StatusMessage>{selectedBrand?.name} ilanları yükleniyor…</StatusMessage>
              )}
              {searchStatus === 'error' && (
                <div className="state-actions">
                  <StatusMessage tone="error">{searchError}</StatusMessage>
                  {selectedBrand && (
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => void selectBrand(selectedBrand)}
                    >
                      İlanları yeniden yükle
                    </button>
                  )}
                </div>
              )}
              {searchStatus === 'success' && searchResult?.items.length === 0 && (
                <StatusMessage>Bu marka için ilk sayfada görünür ilan bulunamadı.</StatusMessage>
              )}

              {searchResult && searchResult.items.length > 0 && (
                <>
                  <div className="listing-table-wrap">
                    <table className="listing-table">
                      <thead>
                        <tr>
                          {shouldPrependListingImageColumn && <th>Görsel</th>}
                          {searchResult.headers.map((header, index) => (
                            <th key={`${header}-${index}`}>
                              {header || <span className="visually-hidden">Görsel</span>}
                            </th>
                          ))}
                          <th>İşlem</th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchResult.items.map((listing, rowIndex) => (
                          <tr key={`${listing.detailHref ?? 'listing'}-${rowIndex}`}>
                            {shouldPrependListingImageColumn && (
                              <td className="listing-image-cell">
                                {listing.imageSrc && (
                                  <img
                                    className="listing-thumbnail"
                                    src={displayImageSource(listing.imageSrc)}
                                    alt={`${getListingTitle(listing, selectedBrand)} ilan görseli`}
                                    loading="lazy"
                                  />
                                )}
                              </td>
                            )}
                            {listing.cells.map((cell, cellIndex) => {
                              const isSourceImageCell =
                                cellIndex === 0 && !cell.label.trim() && listing.imageSrc;

                              return (
                                <td
                                  className={isSourceImageCell ? 'listing-image-cell' : undefined}
                                  key={`${cell.label}-${cellIndex}`}
                                >
                                  {isSourceImageCell ? (
                                    <img
                                      className="listing-thumbnail"
                                      src={displayImageSource(listing.imageSrc!)}
                                      alt={`${getListingTitle(listing, selectedBrand)} ilan görseli`}
                                      loading="lazy"
                                    />
                                  ) : (
                                    cleanListingDisplayText(cell.value)
                                  )}
                                </td>
                              );
                            })}
                            <td>
                              <button
                                className="text-button"
                                type="button"
                                disabled={!listing.detailHref}
                                onClick={() => void selectListing(listing)}
                              >
                                İlanı incele
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="listing-cards">
                    {searchResult.items.map((listing, rowIndex) => (
                      <article
                        className="listing-card"
                        key={`card-${listing.detailHref ?? rowIndex}`}
                      >
                        {listing.imageSrc && (
                          <img
                            src={displayImageSource(listing.imageSrc)}
                            alt={`${getListingTitle(listing, selectedBrand)} ilan görseli`}
                            loading="lazy"
                          />
                        )}
                        <dl>
                          {listing.cells.map((cell, cellIndex) => (
                            <div key={`${cell.label}-${cellIndex}`}>
                              <dt>{cell.label}</dt>
                              <dd>{cleanListingDisplayText(cell.value)}</dd>
                            </div>
                          ))}
                        </dl>
                        <button
                          className="primary-button"
                          type="button"
                          disabled={!listing.detailHref}
                          onClick={() => void selectListing(listing)}
                        >
                          İlanı incele
                        </button>
                      </article>
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>
        )}

        {view === 'details' && (
          <section className="market-screen" aria-labelledby="details-title">
            <nav className="breadcrumbs" aria-label="Sayfa yolu">
              <button type="button" onClick={showBrands}>
                Markalar
              </button>
              <span aria-hidden="true">/</span>
              <button type="button" onClick={showListings}>
                {selectedBrand?.name ?? 'İlanlar'}
              </button>
              <span aria-hidden="true">/</span>
              <span aria-current="page">İlan detayı</span>
            </nav>

            <div className="screen-heading detail-heading">
              <div>
                <p className="eyebrow">Araç ilanı</p>
                <h1 id="details-title" ref={screenHeadingRef} tabIndex={-1}>
                  {listingTitle}
                </h1>
                <p>Detay alanları ve görseller kaynaktaki ham biçimleriyle gösterilir.</p>
              </div>
              {details && (
                <p className="metadata">Alınma zamanı: {formatTimestamp(details.fetchedAt)}</p>
              )}
            </div>

            <div className="results-toolbar detail-toolbar">
              <button className="back-button" type="button" onClick={showListings}>
                ← İlan sonuçlarına dön
              </button>
              {selectedListing?.detailHref && <code>{selectedListing.detailHref}</code>}
            </div>

            {detailStatus === 'loading' && (
              <StatusMessage>Araç detayları yükleniyor…</StatusMessage>
            )}
            {detailStatus === 'error' && (
              <div className="state-actions">
                <StatusMessage tone="error">{detailError}</StatusMessage>
                {selectedListing && (
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => void selectListing(selectedListing)}
                  >
                    Detayı yeniden yükle
                  </button>
                )}
              </div>
            )}

            {details && (
              <div className="details-layout">
                <div className="vehicle-content">
                  {details.images.length > 0 && (
                    <div className="image-strip" aria-label="Araç görselleri">
                      {details.images.map((imageSource, index) => (
                        <button
                          className="gallery-thumbnail"
                          type="button"
                          key={`${imageSource}-${index}`}
                          onClick={() => setActiveImageIndex(index)}
                          aria-label={`Araç fotoğrafı ${index + 1} büyüt`}
                        >
                          <img
                            src={displayImageSource(imageSource)}
                            alt={`Araç görseli ${index + 1}`}
                            loading="lazy"
                          />
                          <span>{index + 1}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="detail-sections">
                    {visibleDetailSections.map((section, index) => (
                      <article className="detail-section" key={`${section.title}-${index}`}>
                        <h2>{section.title}</h2>
                        {section.fields.length > 0 && (
                          <dl>
                            {section.fields.map((field, fieldIndex) => (
                              <div key={`${field.label}-${fieldIndex}`}>
                                <dt>{field.label}</dt>
                                <dd>{field.value}</dd>
                              </div>
                            ))}
                          </dl>
                        )}
                        {section.rawText && (
                          <p className="unstructured-detail">{section.rawText}</p>
                        )}
                      </article>
                    ))}
                  </div>
                </div>

                <aside className="cost-card" aria-labelledby="cost-title">
                  <p className="eyebrow">Kişisel kullanım hesabı</p>
                  <h2 id="cost-title">Yakıt maliyeti</h2>
                  <p className="raw-note">
                    Konum: {details.fuelLocation.city ?? 'yok'} /{' '}
                    {details.fuelLocation.district ?? 'yok'}
                  </p>

                  {fuelPriceError && (
                    <StatusMessage tone="error">{fuelPriceError.message}</StatusMessage>
                  )}
                  {!fuelPriceError && fuelOptions.length === 0 && (
                    <StatusMessage>
                      CollectAPI yanıtında seçilebilir benzin fiyatı bulunamadı.
                    </StatusMessage>
                  )}

                  <form onSubmit={(event) => void submitCost(event)}>
                    <label>
                      <span>Yakıt istasyonu / marka</span>
                      <select
                        value={selectedFuelIndex}
                        onChange={(event) => setSelectedFuelIndex(event.target.value)}
                        disabled={fuelOptions.length === 0}
                      >
                        <option value="">Seçin</option>
                        {fuelOptions.map((option, index) => (
                          <option key={`${option.name}-${index}`} value={index}>
                            {option.name} — {String(option.price)}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="source-values">
                      <div>
                        <span>Ortalama tüketim</span>
                        <strong>{averageConsumption ?? 'Kaynakta yok'}</strong>
                      </div>
                      <div>
                        <span>Depo kapasitesi</span>
                        <strong>{fuelTankLiters ?? 'Kaynakta yok'}</strong>
                      </div>
                    </div>

                    {(!averageConsumption || !fuelTankLiters) && (
                      <StatusMessage tone="error">
                        Kaynakta tüketim veya depo bilgisi yok; tahmin üretilmeyecek.
                      </StatusMessage>
                    )}

                    <label>
                      <span>Aylık kilometre</span>
                      <input
                        type="number"
                        min="1"
                        step="1"
                        inputMode="numeric"
                        value={monthlyKm}
                        onChange={(event) => setMonthlyKm(event.target.value)}
                        placeholder="Örn. 1200"
                      />
                    </label>

                    <button
                      className="primary-button"
                      type="submit"
                      disabled={costStatus === 'loading'}
                    >
                      {costStatus === 'loading' ? 'Hesaplanıyor…' : 'Maliyeti hesapla'}
                    </button>
                  </form>

                  {costError && <StatusMessage tone="error">{costError}</StatusMessage>}
                  {costResult && (
                    <div className="cost-result" role="status">
                      <div>
                        <span>Aylık maliyet</span>
                        <strong>{costResult.monthlyCostTry.toLocaleString('tr-TR')} TL</strong>
                      </div>
                      <div>
                        <span>Depo maliyeti</span>
                        <strong>{costResult.tankCostTry.toLocaleString('tr-TR')} TL</strong>
                      </div>
                      <small>
                        Aylık tüketim: {costResult.monthlyLiters.toLocaleString('tr-TR')} lt
                      </small>
                    </div>
                  )}

                  <p className="timestamp-note">
                    Yakıt verisi detay isteğiyle birlikte {formatTimestamp(details.fetchedAt)}{' '}
                    tarihinde alındı.
                  </p>
                </aside>
              </div>
            )}
          </section>
        )}
      </main>

      {activeImageSource && activeImageIndex !== null && (
        <div className="image-modal" role="presentation" onClick={() => setActiveImageIndex(null)}>
          <div
            className="image-modal__dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Araç fotoğraf galerisi"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="image-modal__close"
              type="button"
              onClick={() => setActiveImageIndex(null)}
              ref={modalCloseRef}
              aria-label="Galeriyi kapat"
            >
              ×
            </button>
            <img
              src={displayImageSource(activeImageSource)}
              alt={`Büyük araç görseli ${activeImageIndex + 1}`}
            />
            {details && details.images.length > 1 && (
              <>
                <button
                  className="image-modal__navigation image-modal__navigation--previous"
                  type="button"
                  onClick={() => moveActiveImage(-1)}
                  aria-label="Önceki fotoğraf"
                >
                  ‹
                </button>
                <button
                  className="image-modal__navigation image-modal__navigation--next"
                  type="button"
                  onClick={() => moveActiveImage(1)}
                  aria-label="Sonraki fotoğraf"
                >
                  ›
                </button>
                <p className="image-modal__counter">
                  {activeImageIndex + 1} / {details.images.length}
                </p>
              </>
            )}
          </div>
        </div>
      )}

      <footer>
        <p>
          Ham kaynak verisi yalnız bu oturumdaki yanıt için kullanılır; ilan ve detay cache’i
          yoktur.
        </p>
      </footer>
    </>
  );
}
