# Test Stratejisi

## Amaç

Bu belge, Yata Market projesinde hangi davranışın otomatik, hangi davranışın kullanıcı tarafından manuel doğrulandığını açıklar. Kaynak görev belirli bir test framework'ü veya coverage yüzdesi zorunlu tutmaz; test altyapısı teslim güvenilirliğini artıran teknik karardır.

## Otomatik test yaklaşımı

Frontend ve backend Node.js'in yerleşik `node:test` çalıştırıcısını kullanır. Yeni test paketi veya E2E aracı eklenmemiştir.

### Backend

```powershell
cd backend
npm test
npm run check
```

- Express uygulaması rastgele boş bir portta başlatılır ve gerçek HTTP istekleri gönderilir.
- Health, liste, detay, oluşturma, geçersiz oluşturma, kısmi güncelleme, silme ve JSON 404 davranışları test edilir.
- Her testten önce bellek ürünleri 10 başlangıç ürününe sıfırlanır; testler birbirini etkilemez.
- `npm run check` backend kaynaklarının JavaScript syntax kontrolünü yapar.

### Frontend

```powershell
cd frontend
npm test
npm run lint
npm run build
```

- Arama, kategori filtresi, iki fiyat sırası, birleşik kullanım, boş sonuç ve kaynak diziyi mutate etmeme saf fonksiyon testleridir.
- Sepet reducer'ında ekleme, aynı ürünü artırma, farklı satırlar, artırma, azaltma, son adette kaldırma ve doğrudan kaldırma test edilir.
- Toplam adet, satır toplamı, genel toplam ve geçersiz veride `NaN` oluşmaması test edilir.
- Sepet storage yardımcıları; geçerli verinin round-trip korunması, boş sepet kaydı, bozuk JSON, geçersiz ürün/adet, yinelenen kimlik ve storage erişim hatasıyla test edilir.
- ESLint statik kalite kontrolüdür. Vite production build, JSX/import/üretim derlemesi için smoke kontroldür; gerçek tarayıcı davranışını kanıtlamaz.

## Manuel doğrulama sınırı

Aşağıdakiler otomatik test sonucu olarak raporlanmaz:

- Ürün liste ve detayının tarayıcıdaki gerçek görünümü.
- Arama, filtre, sıralama ve sepet kontrollerinin tıklanması.
- Loading, error, empty, no-results ve not-found görünümleri.
- 320, 768 ve 1280 px responsive düzen.
- Klavye sırası, focus halkası ve ekran okuyucu duyuruları.
- Browser console ve backend kapalıyken frontend görünümü.
- README'nin gerçekten temiz başka bir makinede uygulanması.

Bu kontroller [manuel test listesindeki Aşama 10 bölümünde](./manual-test-checklist.md#aşama-10---son-manuel-teslim-provası) hazırlık, URL, işlem ve beklenen sonuçla tanımlanmıştır.

## Test verisi ve izolasyon

- Backend kalıcı veritabanı kullanmaz; testler çalışan bellek dizisini değiştirir.
- `resetProductsForTests()` her backend testinden önce başlangıç kopyasını yükler.
- Frontend test fixture'ları uygulamanın backend verisini değiştirmez.
- Manuel CRUD ürünleri backend yeniden başladığında kaybolur; bu beklenen kalıcılık sınırıdır.

## Kapsam dışı

- Yüzde 100 coverage hedefi.
- Snapshot ağırlıklı görsel testler.
- Playwright/Cypress benzeri E2E altyapısı.
- Performans veya yük testi.
- CI/CD ve deployment testi.

Component davranışları büyür veya regresyon riski artarsa Vitest + React Testing Library; birden fazla gerçek tarayıcı akışı kritik hâle gelirse sınırlı E2E testi yeniden değerlendirilebilir.

## Aşama 10 otomatik sonuçları - 2026-08-28

| Kontrol | Gerçek sonuç |
|---|---|
| Backend temiz kurulum | Geçici klasörde `npm ci`: 70 paket, 0 güvenlik açığı |
| Frontend temiz kurulum | Geçici klasörde `npm ci`: 134 paket, 0 güvenlik açığı |
| Backend testleri | 11 geçti, 0 kaldı, 0 atlandı |
| Backend syntax | `npm run check` başarılı |
| Frontend testleri | 21 geçti, 0 kaldı, 0 atlandı |
| Frontend lint | Hata ve uyarı olmadan başarılı |
| Frontend build | 106 modül dönüştürüldü; production build başarılı |
| API smoke zinciri | Health/list/detail/PATCH `200`, create `201`, delete `204`, invalid JSON `400`, silinen ürün ve bilinmeyen route `404` |
| Doküman bağlantıları | Bütün relative Markdown link hedefleri mevcut |
| İzlenebilirlik/API kapsamı | 26 gereksinim ve 6 endpoint dokümante |

Bu tablo yalnız otomatik kontrolleri gösterir. Aşama 10 manuel teslim provasının sonucu kullanıcı tarafından ayrıca kaydedilmelidir.

## Aşama 11A otomatik kapsamı

`cartStorage.test.js`, gerçek tarayıcıya ihtiyaç duymayan bellek içi bir Storage test double'ı kullanır. Bu testler serialization, deserialization ve güvenli fallback davranışını kanıtlar; sayfa yenilemesinden sonra görünür sepetin doğru olması kullanıcı tarafından tarayıcıda manuel doğrulanır.

| Kontrol | Gerçek sonuç |
|---|---|
| Frontend testleri | 31 geçti, 0 kaldı, 0 atlandı; bunun 10'u storage davranışıdır |
| Frontend lint | Hata ve uyarı olmadan başarılı |
| Frontend build | 107 modül dönüştürüldü; production build başarılı |
| Backend regresyon testleri | 11 geçti, 0 kaldı, 0 atlandı |
| Backend syntax | `npm run check` başarılı |

Bu otomatik kontroller gerçek tarayıcı yenilemesini taklit etmez. Yenileme, sekmeyi kapatıp açma ve DevTools ile bozuk storage oluşturma testleri kullanıcı tarafından yapılmalıdır.

## Aşama 11 tüm bonuslar otomatik kapsamı - 2026-08-28

Bonuslar yeni tarayıcı/E2E framework'ü eklenmeden mevcut Node test runner ile saf mantık ve HTTP integration düzeyinde doğrulandı. Her bonus sonrasında frontend test/lint/build ve backend test/check regresyonu çalıştırıldı.

| Alan | Otomatik kanıt |
|---|---|
| Sepet kalıcılığı | 10 storage testi; geçerli round-trip, bozuk veri ve erişim hatası fallback'i |
| Fiyat aralığı | 7 test; tek/çift sınır, dahil sınır, birleşik kullanım ve geçersiz aralık |
| Favoriler | 5 reducer testi; ekleme, kaldırma, benzersizlik, temizleme ve geçersiz kimlik |
| Backend loglama | 4 middleware testi; seviye, yöntem/path/status/süre, gizlilik ve kapatma |
| Sayfalama | 4 backend HTTP + 5 frontend saf test; metadata, varsayılan, uzak/boş sayfa, invalid query ve mutation yokluğu |
| Ürün yönetim formu | 6 saf test; başlangıç formu, validasyon, fiyat dönüşümü, trim ve düzenleme dönüşümü |

Son bütünleşik sonuç:

- Backend: `19/19` test geçti; `npm run check` başarılı.
- Frontend: `54/54` test geçti; ESLint hatasız; Vite production build `120` modülle başarılı.
- Yeni runtime veya test bağımlılığı eklenmedi.
- Tarayıcı, responsive görünüm, klavye, görsel tasarım, gerçek yenileme ve yönetim kullanıcı akışları **Codex tarafından çalıştırılmadı**; `manual-test-checklist.md` kullanıcı adımlarını içerir.

Alt aşama regresyon kayıtları:

| Tamamlanan bonus | Frontend test | Backend test | Ek kontroller |
|---|---:|---:|---|
| Sepet kalıcılığı | 31/31 | 11/11 | Frontend lint/build, backend check geçti |
| Fiyat aralığı | 38/38 | 11/11 | Frontend lint/build, backend check geçti |
| Favoriler | 43/43 | 11/11 | Frontend lint/build, backend check geçti |
| Backend loglama | 43/43 | 15/15 | Frontend lint/build, backend check geçti |
| Sayfalama | 48/48 | 19/19 | Frontend lint/build, backend check geçti |
| Ürün yönetim arayüzü | 54/54 | 19/19 | Frontend lint/build, backend check geçti |
