# Aşama 8 - UI Durumları, Responsive Kullanım ve Temel Erişilebilirlik

## Amaç ve kapsam

Bu belge, mevcut ürün listeleme, ürün detay, arama/filtre/sıralama ve sepet akışlarının farklı kullanıcı durumlarında nasıl göründüğünü açıklar. Aşama 8 yeni iş özelliği eklemez; mevcut davranışları anlaşılır, responsive ve temel düzeyde erişilebilir hâle getirir.

Kaynak görev PDF’si loading, error, empty ve responsive kullanılabilirliği zorunlu tutar. Tasarım araştırması skeleton, kurtarma eylemleri, 44 px dokunma hedefleri, görünür focus, reduced-motion ve durum mesajlarını önerir. Bu ayrıntılar kaynakta yeni bir özellik zorunluluğu oluşturmaz.

İnceleme sırasında `docs/frontend-list-detail-design.md`, `docs/search-filter-sort-design.md` ve `docs/cart-design-and-state.md` bulunamamıştır. Uygulama kararları mevcut kod, `requirements.md`, `decisions.md` ve erişilebilir PDF kaynakları esas alınarak verilmiştir.

## UI durum matrisi

| Sayfa | Durum | Tetikleyici | Görünüm | Kullanıcı eylemi / erişilebilirlik |
|---|---|---|---|---|
| Ürün listesi | Loading | İlk `GET /api/products` isteği sürüyor | Grid’i taklit eden sekiz skeleton kart | `role="status"`, `aria-busy="true"`; reduced-motion shimmer’ı durdurur |
| Ürün listesi | Error | Ağ veya API isteği başarısız | İkon, güvenli Türkçe mesaj ve “Yeniden dene” | `role="alert"`; düğme `requestNumber` değerini değiştirip yeni istek başlatır |
| Ürün listesi | Empty | API başarılı, ürün dizisi `[]` | “Henüz ürün bulunmuyor” | `role="status"`; hata olarak sunulmaz |
| Ürün listesi | No results | Arama/kategori sonucu ürün kalmıyor | Aranan kelime, açıklama ve “Tüm ürünleri göster” | Seçimler temizlenir; `role="status"` kullanılır |
| Ürün listesi | Success | Ürün dizisi geldi | Kontroller, sonuç sayısı ve ürün kartları | Sonuç sayısı `aria-live="polite"` ile güncellenir |
| Ürün detayı | Loading | Tek ürün isteği sürüyor | Görsel, başlık, fiyat, açıklama, eylem ve metadata skeleton’ı | `role="status"`, `aria-busy="true"` |
| Ürün detayı | Error | Ağ/API hatası | Kullanıcı dostu mesaj ve “Yeniden dene” | Teknik mesaj sızmaz; ana hata başlığı `h1` olur |
| Ürün detayı | Not found | API `404` döndürüyor | “Ürün bulunamadı” ve ürünlere dönüş | Genel API hatasından ayrı görünür |
| Ürün detayı | Success | Ürün bulundu | Normal ürün bilgisi ve sepet kontrolü | Görsel alt metni, semantik başlıklar ve etiketli düğmeler bulunur |
| Sepet | Empty | `items.length === 0` | Boş sepet açıklaması ve “Alışverişe başla” | Kullanıcı katalog akışına geri döner |
| Sepet | Populated | En az bir ürün var | Sepet satırları, adet seçici ve toplam özeti | Kontroller gerçek button, gruplar erişilebilir ada sahiptir |
| Sepet | Update feedback | Ekleme, adet veya kaldırma | Görsel adet/toplam hemen güncellenir | Gizli `role="status"` / `aria-live="polite"` mesajı değişikliği duyurur |
| Tüm uygulama | Route not found | Bilinmeyen frontend yolu | “Sayfa bulunamadı” ve ürünlere dönüş | Sayfa `h1` içerir ve dead-end oluşturmaz |
| Ürün görseli | Image error | Görsel URL’si boş veya yüklenemiyor | Aynı 1:1 alanda ikon ve “Görsel yok” | Fallback hangi ürün görselinin yüklenemediğini erişilebilir adla bildirir |

## Responsive davranış

| Görünüm | Katalog | Detay | Sepet |
|---|---|---|---|
| Dar telefon, 320-390 px | İki ürün sütunu, kontroller tek sütun, kart içi sepet eylemi tam genişlik | Görsel ve içerik dikey; eylem tam genişlik | Görsel solda ve içerik sağda; adet/toplam aşağı doğru okunabilir; özet en altta |
| Tablet, yaklaşık 768 px | Üç ürün sütunu, kontroller iki sütun | 800 px altına kadar dikey, sonra iki sütuna hazırlanır | Daha geniş ürün satırı; toplam özet içerik akışında |
| Masaüstü, 1024 px+ | Dört sütun, kontroller yatay panel | Görsel ve sticky bilgi alanı iki sütun | Ürün listesi ve sağda sticky toplam özeti |

Kesin breakpoint değerleri kaynak PDF zorunluluğu değildir. Mevcut içerik yapısına göre `520`, `600`, `800` ve `960` px eşikleri korunmuştur.

## Temel erişilebilirlik kararları

- İlk Tab basışında görünür olan “Ana içeriğe geç” bağlantısı sticky navigasyonu atlar.
- `scroll-padding-top`, odaklanan içeriğin sticky header arkasında kalma riskini azaltır.
- Link, button, input ve select kontrollerinde üç piksellik görünür focus halkası vardır.
- Aktif “Ürünler” veya “Sepet” bağlantısı `aria-current="page"` ile belirtilir.
- Arama ve select alanları görünür `label` kullanır; placeholder tek başına etiket değildir.
- Loading `role="status"`, hata `role="alert"`, sepet güncellemeleri `aria-live="polite"` ile bildirilir.
- Adet kontrolleri `role="group"` ve ürün adına göre oluşturulan erişilebilir adlar kullanır.
- Dokunma hedefleri en az 44 px olacak şekilde korunur.
- Hata yalnız kırmızı renkle anlatılmaz; ikon, başlık, açıklama ve kurtarma düğmesi birlikte kullanılır.
- `prefers-reduced-motion: reduce` durumunda animasyon ve geçişler yaklaşık sıfır süreye indirilir; başlangıç yükleme perdesinin 720 ms beklemesi de kaldırılır.
- Bu uygulama tam WCAG uygunluk sertifikası iddiasında bulunmaz.

## Manuel doğrulama durumu

Kullanıcı bütün testleri kendisi yapmak istediği için Aşama 8 sonrasında Codex tarafından lint, build, browser, viewport, kontrast veya ekran okuyucu testi çalıştırılmamıştır. Uygulama sonucu [manuel test kontrol listesindeki](./manual-test-checklist.md) Aşama 8 maddelerine bağlıdır.
