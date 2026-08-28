# Gereksinim İzlenebilirliği

## Durumların anlamı

- **Geçti:** Otomatik test, build veya salt okunur kod/doküman incelemesiyle doğrulandı.
- **Manuel doğrulama gerekli:** Kod karşılığı mevcut ancak gerçek tarayıcı, cihaz veya kullanıcı etkileşimi kullanıcı tarafından görülmelidir.
- **Kaldı:** Gereksinimin uygulama karşılığı eksik veya doğrulama başarısızdır.

Bu tablo kaynak gereksinimlerini değiştirmez; [requirements.md](./requirements.md) içindeki 26 maddeyi teslim kanıtlarına bağlar.

| Gereksinim | Kod kanıtı | Test kanıtı | Doküman kanıtı | Durum |
|---|---|---|---|---|
| REQ-001 React frontend | `frontend/src/main.jsx`, `App.jsx` | Frontend lint ve production build | README teknoloji/proje yapısı | Geçti |
| REQ-002 Node.js/Express backend | `backend/src/app.js`, `server.js` | Backend test ve syntax kontrolü | README backend kurulumu | Geçti |
| REQ-003 Veritabanı yok | `backend/src/data/products.js` bellek dizisi | Test izolasyonu ve dependency incelemesi | README kalıcılık sınırı, ADR-005 | Geçti |
| REQ-004 Ürün listeleme | `ProductListPage.jsx`, `ProductList.jsx` | API liste testi ve frontend build | README liste route'u | Manuel doğrulama gerekli |
| REQ-005 Ürün detay | `ProductDetailPage.jsx`, `App.jsx` | API detay/404 testi ve frontend build | README detay route'u | Manuel doğrulama gerekli |
| REQ-006 Arama | `deriveProducts.js`, `ProductControls.jsx` | Harf duyarsız/trim/boş sonuç testleri | README katalog kontrolleri | Geçti |
| REQ-007 Filtreleme | `deriveProducts.js`, `ProductControls.jsx` | Kategori ve Tümü testleri | ADR-012, README | Geçti |
| REQ-008 İki sıralama | `deriveProducts.js` | Artan, azalan ve birleşik testler | README katalog kontrolleri | Geçti |
| REQ-009 Sepete ekleme | `cartReducer.js`, `QuickAddButton.jsx`, `AddToCartButton.jsx` | İlk ve aynı ürün ekleme testleri | README sepet kullanımı | Manuel doğrulama gerekli |
| REQ-010 Sepet yönetimi | `QuantityStepper.jsx`, `CartItem.jsx`, `cartReducer.js` | Artırma, azaltma ve kaldırma testleri | ADR-011, README | Manuel doğrulama gerekli |
| REQ-011 Doğru adet/tutar | `cartSelectors.js` | Adet, satır, `100×2 + 75×1 = 275` ve `NaN` testleri | README sepet kullanımı | Geçti |
| REQ-012 Boş sepet | `CartPage.jsx`, `EmptyCartState.jsx` | Reducer son ürünü kaldırma testi ve build | Manuel test MT-A10-005 | Manuel doğrulama gerekli |
| REQ-013 REST API | `productRoutes.js`, controller/service katmanları | Backend HTTP integration testleri | `api.md` | Geçti |
| REQ-014 API listeleme | `listProducts` | Liste `200`/dizi testi | `api.md` | Geçti |
| REQ-015 API tek kayıt | `showProduct` | Geçerli detay ve bilinmeyen kimlik testi | `api.md` | Geçti |
| REQ-016 API oluşturma | `createProduct` | POST `201` ve backend kimliği testi | `api.md` | Geçti |
| REQ-017 API güncelleme | `updateProduct`, `PATCH` route'u | Yalnız gönderilen alan ve unknown `404` testi | `api.md` | Geçti |
| REQ-018 API silme | `deleteProduct`, `DELETE` route'u | `204`, boş body ve sonraki `404` testi | `api.md` | Geçti |
| REQ-019 Hatalı istek/bulunamayan kayıt | Validator, `AppError`, hata middleware'leri | Invalid POST, ürün/route `404` ve Aşama 10 API smoke | `api.md` hata cevapları | Geçti |
| REQ-020 Frontend verisi backend'den gelir | `productsApi.js`, liste/detay sayfaları | Frontend build ve kaynak kod incelemesi | README veri kaynağı | Geçti |
| REQ-021 Loading/error/empty | Sayfa state'leri ve ortak durum componentleri | Frontend build | UI karar belgesi, MT-A10-003/007 | Manuel doğrulama gerekli |
| REQ-022 Çalışan frontend/backend | İki uygulamanın package scriptleri | Backend suite, frontend suite/build | README birlikte çalıştırma | Manuel doğrulama gerekli |
| REQ-023 README | `README.md` | Komut-script ve relative-link denetimi | README | Geçti |
| REQ-024 API dokümantasyonu | Route/controller sözleşmesi | API smoke ve doküman-kod karşılaştırması | `docs/api.md` | Geçti |
| REQ-025 Responsive kullanılabilirlik | `styles.css` media query'leri | Build yalnız derlemeyi doğrular | UI karar belgesi, MT-A10-009 | Manuel doğrulama gerekli |
| REQ-026 Anlamlı Git geçmişi | Sekiz aşamalı commit geçmişi | `git log --oneline`, `git status` incelemesi | MT-A10-012 | Manuel doğrulama gerekli |

## Teslim özeti

- Otomatik veya salt okunur denetimle **17 gereksinim geçti**.
- Gerçek kullanıcı/tarayıcı veya son Git işlemi gerektiren **9 gereksinim manuel doğrulama bekliyor**.
- Açıklanamayan **Kaldı** maddesi bulunmuyor.

## Bonus izlenebilirliği

Bonuslar zorunlu gereksinim durumlarını değiştirmez; aşağıdaki tablo Aşama 11 uygulama ve otomatik kanıtlarını gösterir.

| Bonus | Kod kanıtı | Otomatik test kanıtı | Manuel durum |
|---|---|---|---|
| BON-001 Favoriler | `features/favorites`, `FavoritesPage.jsx` | 5 reducer testi | Kullanıcı akışı bekliyor |
| BON-002 Fiyat aralığı | `deriveProducts.js`, `ProductControls.jsx` | 7 fiyat sınırı/birleşik test | Kullanıcı akışı bekliyor |
| BON-003 Sayfalama | Pagination validator/service/component/utils | 4 backend + 5 frontend test | Kullanıcı akışı bekliyor |
| BON-004 Sepet kalıcılığı | `cartStorage.js`, `CartProvider.jsx` | 10 storage testi | Gerçek yenileme bekliyor |
| BON-005 Basit loglama | `requestLogger.js`, `app.js` | 4 logger testi | Terminal görünümü bekliyor |
| BON-006 Ürün yönetimi | `features/admin`, `ProductManagementPage.jsx` | 6 form testi + mevcut CRUD HTTP testleri | Kullanıcı akışı bekliyor |
