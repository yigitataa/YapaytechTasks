# Full-Stack E-Ticaret Uygulaması

Bu repository, React frontend ile Node.js/Express backend'in birlikte çalışacağı küçük ölçekli bir e-ticaret uygulaması için hazırlanmıştır.

Zorunlu Aşama 10'un ardından kaynak görevdeki **altı bonus özelliğin tamamı Aşama 11'de uygulanmıştır**. Yata Market; kalıcı sepet, fiyat aralığı, favoriler, backend loglama, sayfalama ve demo ürün yönetimi içerir. Gerçek tarayıcı, responsive görünüm, klavye ve kullanıcı akışları kullanıcı tarafından manuel doğrulanmalıdır; bu kontroller tamamlanana kadar teslim durumu **manuel kontrole bağlıdır**.

## Kullanılan teknolojiler

- Frontend: React, React Router, Vite ve JavaScript.
- Backend: Node.js, Express ve JavaScript.
- Paket yöneticisi: npm.
- Veri tabanı: Kullanılmıyor.

## Zorunlu özellikler

- Backend API'den gelen ürünleri listeleme ve tek ürün detayını gösterme.
- Ürün adına göre arama, kategori filtresi ve iki fiyat sıralaması.
- Katalogdan veya detaydan sepete ekleme; adet artırma, azaltma, kaldırma ve sepeti temizleme.
- Toplam ürün adedi, satır toplamı, genel toplam ve boş sepet durumu.
- Ürünler için listeleme, tek kayıt, oluşturma, kısmi güncelleme ve silme REST işlemleri.
- Kontrollü validasyon, bulunamadı ve beklenmeyen hata cevapları.
- Loading, error, empty, no-results ve not-found kullanıcı durumları.
- Responsive düzen ve temel klavye/erişilebilirlik desteği.

## Proje yapısı

```text
04-05/
  frontend/
    src/
      api/          Express ürün API'siyle ortak iletişim
      components/   Kart, görsel, fiyat ve UI durumları
      features/     Sepet, favori ve ürün yönetimi state/yardımcı bileşenleri
      pages/        Katalog, detay, sepet, favoriler, yönetim ve 404 sayfaları
      utils/        Ürün türetme, sayfalama ve para biçimlendirme
      App.jsx       Frontend route eşleştirmeleri
    .env.example    İsteğe bağlı API taban adresi örneği
  backend/
    src/
      data/        Başlangıç ürün dizisi
      services/    Ürün verisini okuma ve değiştirme işlemleri
      controllers/ HTTP isteği ve cevap yönetimi
      routes/      Endpoint-controller eşleştirmesi
      middleware/  İstek loglama, ortak 404 ve hata cevapları
      validators/  Ürün body ve sayfalama query kuralları
      errors/      Kontrollü uygulama hatası sınıfı
      app.js        Express yapılandırması
      server.js     Port dinleme işlemi
  docs/            Gereksinim, karar ve öğrenme belgeleri
  .gitignore       Git'e eklenmeyecek yerel dosyalar
  README.md        Kurulum ve çalıştırma rehberi
```

## Dokümantasyon haritası

- [Gereksinimler ve kapsam](./docs/requirements.md)
- [Gereksinim-kod-test izlenebilirliği](./docs/traceability.md)
- [Teknik kararlar](./docs/decisions.md)
- [REST API referansı](./docs/api.md)
- [Test stratejisi](./docs/test-strategy.md)
- [Manuel test kontrol listesi](./docs/manual-test-checklist.md)
- [UI durumları ve responsive kararları](./docs/ui-states-responsive-accessibility.md)

## Ön koşullar

- Node.js `20.19+` veya `22.12+`.
- Node.js ile birlikte gelen npm.
- Frontend ve backend'i aynı anda çalıştırmak için iki terminal.

Sürümleri kontrol etmek için:

```powershell
node --version
npm --version
```

## Frontend kurulumu ve çalıştırma

Proje kökünden:

```powershell
cd frontend
npm ci
npm run dev
```

`npm ci`, repository'deki `package-lock.json` dosyasına göre tekrarlanabilir kurulum yapar. Bağımlılıkları bilinçli olarak değiştirdiğinde lockfile'ı güncellemek için `npm install` kullanılabilir.

Vite geliştirme sunucusu varsayılan olarak şu adreste açılır:

```text
http://localhost:5180
```

Frontend için kullanılabilir npm script'leri:

- `npm run dev`: Geliştirme sunucusunu başlatır.
- `npm run lint`: JavaScript ve JSX dosyalarını ESLint ile kontrol eder.
- `npm test`: Arama/filtre/sıralama, sepet reducer/toplam ve storage testlerini çalıştırır.
- `npm run build`: Yayına hazırlanmış production dosyalarını `dist/` içine üretir.
- `npm run preview`: Oluşturulan production build'i yerel olarak önizler.

Frontend route'ları:

| Adres | Görünüm |
|---|---|
| `/` | Backend'den gelen ürünlerin responsive kart listesi |
| `/products/:productId` | Kimliği URL'den alınan tek ürün detayı |
| `/cart` | Sepet ürünleri, adet kontrolleri ve toplam özeti |
| `/favorites` | Ortak favori state'indeki ürünler |
| `/manage-products` | Kimlik doğrulamasız demo CRUD yönetim ekranı |
| Diğer adresler | Kontrollü “Sayfa bulunamadı” görünümü |

Liste isteği `GET /api/products`, detay isteği `GET /api/products/:id` endpoint'ini kullanır. Ürün dizisi frontend kaynak koduna kopyalanmamıştır.

Katalog kontrolleri:

- **Ürün ara:** Yalnız ürün adında, büyük/küçük harf ve Türkçe karakter farklarına duyarsız kısmi eşleşme yapar.
- **Kategori:** Seçenekleri backend'den gelen ürünlerin benzersiz kategorilerinden üretir; “Tüm kategoriler” filtreyi kaldırır.
- **Fiyat aralığı:** Minimum ve maksimum değerler tek başına veya birlikte kullanılabilir; geçersiz aralık açıklanır.
- **Sırala:** “Fiyat: düşükten yükseğe” ve “Fiyat: yüksekten düşüğe” seçeneklerini sunar. “Önerilen sıra” API sırasını korur.
- **Sayfalama:** Birleşik arama/filtre/sıralama sonucu altışar ürün olarak gösterilir; kontrol değişince ilk sayfaya dönülür.
- **Seçimleri temizle:** Arama, kategori, fiyat sınırları, sıralama ve sayfayı başlangıç değerlerine döndürür.

Kontroller anlık ve birlikte uygulanır. Sonuç yoksa bu durum API hatası sayılmaz; “Aramana uygun ürün bulunamadı” paneli ve “Tüm ürünleri göster” düğmesi görünür. Detay sayfasına gidip listeye dönüldüğünde veya sayfa yenilendiğinde katalog seçimleri sıfırlanır; URL ya da tarayıcı depolamasıyla filtre kalıcılığı eklenmemiştir.

Favoriler sepetten bağımsız Context/reducer state'idir. Katalog ve detay düğmeleri aynı benzersiz kimlik listesini değiştirir; `/favorites` yalnız seçilen ürünleri gösterir. Favoriler bu sürümde tarayıcı yenilemesinde korunmaz.

`/manage-products`, mevcut POST/PATCH/DELETE API'sine bağlı oluşturma, düzenleme ve onaylı silme işlemleri sunar. Authentication/yetkilendirme içermediği için gerçek bir yönetici paneli değildir; eğitim/demo ekranıdır. Değişiklikler backend belleğinde olduğu için yeniden başlatmada sıfırlanır.

Sepet kullanımı:

- Katalog kartındaki **Sepete ekle** düğmesi detay sayfasını açmadan ürün ekler.
- Ürün sepete eklendikten sonra katalogda ve detay sayfasında düğmenin yerini **sil | adet | artır** kontrolü alır. Çöp kutusu ürünü sepetten kaldırır, ortadaki sayı mevcut adedi gösterir ve `+` adedi artırır.
- Header'daki sepet rozeti bütün ürün adetlerinin toplamını gösterir.
- Sepet sayfasındaki `+` adedi artırır. Adet `1` iken azaltma düğmesi çöp kutusuna dönüşür ve yalnız o ürün satırını kaldırır.
- Her satırdaki **Kaldır** ürünü doğrudan siler; **Sepeti temizle** bütün satırları kaldırır.
- Sepet `yata-market-cart` anahtarıyla tarayıcının `localStorage` alanına kaydedilir. Sayfa yenilendiğinde aynı ürünler ve adetler geri yüklenir; ürün kaldırma ve sepeti temizleme işlemleri de kaydı günceller.
- Storage içeriği bozuk JSON veya geçersiz ürün/adet verisi içerirse uygulama çökmez ve güvenli biçimde boş sepetle açılır.

Arayüz hareketleri `prefers-reduced-motion` tercihini destekler. İşletim sisteminde azaltılmış hareket etkinse dekoratif giriş, gradient ışık ve yükleyici animasyonları yaklaşık sıfır süreye indirilir.

UI durumları:

- **Loading:** Liste kartlarını veya detay yerleşimini taklit eden skeleton görünür.
- **Error:** Teknik hata ayrıntıları yerine Türkçe açıklama ve gerçekten yeni istek başlatan **Yeniden dene** düğmesi görünür.
- **Empty:** Backend başarılı biçimde boş dizi döndürdüğünde katalog boş durumu görünür.
- **No results:** Arama ve kategori seçimleri ürün bırakmadığında hata yerine seçimleri temizleme eylemi görünür.
- **Not found:** Bilinmeyen ürün ve frontend adresleri ayrı 404 mesajıyla kataloğa dönüş sunar.
- **Success:** Ürünler, filtre kontrolleri ve sepet normal etkileşimli görünümlerine geçer.

Aşama 8 durum ve responsive kararlarının ayrıntısı [UI durumları ve erişilebilirlik belgesinde](./docs/ui-states-responsive-accessibility.md) bulunur.

## Backend kurulumu ve çalıştırma

Proje kökünden:

```powershell
cd backend
npm ci
npm run dev
```

Backend varsayılan olarak şu adreste çalışır:

```text
http://localhost:3000
```

Sağlık kontrolü endpoint'i:

```text
GET http://localhost:3000/api/health
```

Beklenen cevap ve durum kodu:

```text
200 OK
```

```json
{
  "status": "ok"
}
```

## Ürün CRUD API'si

Ürün verileri backend içindeki JavaScript dizisinde tutulur. Başlangıç veri kümesinde 10 ürün ve 6 kategori vardır.

| Yöntem | Endpoint | Başarı | Temel hata | Açıklama |
|---|---|---|---|---|
| `GET` | `/api/products` | `200`; query yoksa dizi, `page/limit` varsa sayfalı nesne | `400` | Bütün veya sayfalı ürünleri döndürür. |
| `GET` | `/api/products/:id` | `200` ve JSON nesnesi | `404` | Kimliği verilen tek ürünü döndürür. |
| `POST` | `/api/products` | `201` ve oluşturulan ürün | `400` | Doğrulanmış body ile ürün oluşturur; `id` değerini backend üretir. |
| `PATCH` | `/api/products/:id` | `200` ve güncel ürün | `400`, `404` | Yalnız gönderilen desteklenen alanları değiştirir. |
| `DELETE` | `/api/products/:id` | `204`, boş gövde | `404` | Ürünü çalışan süreçteki bellek dizisinden siler. |

Ürün modeli:

```json
{
  "id": "p-001",
  "name": "Kablosuz Kulaklık",
  "description": "Günlük kullanım için kısa ürün açıklaması.",
  "price": 2499,
  "category": "Elektronik",
  "imageUrl": "https://placehold.co/600x400/png?text=Kablosuz+Kulaklik"
}
```

Bütün ürünleri listelemek için:

```text
GET http://localhost:3000/api/products
```

Tek ürün getirmek için:

```text
GET http://localhost:3000/api/products/p-001
```

Bilinmeyen ürün cevabı:

```text
GET http://localhost:3000/api/products/bilinmeyen-id
404 Not Found
```

```json
{
  "message": "Ürün bulunamadı"
}
```

Geçerli ürün oluşturma body örneği:

```json
{
  "name": "USB-C Masa Şarjı",
  "description": "Çoklu cihazlar için masaüstü şarj ünitesi.",
  "price": 1899,
  "category": "Elektronik",
  "imageUrl": "https://example.com/usb-c-sarj.png"
}
```

`name`, `price` ve `category` oluştururken zorunludur. `description` ile `imageUrl` isteğe bağlıdır. Fiyat sonlu, sayısal ve sıfırdan büyük olmalıdır. Bilinmeyen alanlar ve istemciden gelen `id` kontrollü `400` ile reddedilir. Validasyon cevabı genel `message` yanında alan bazlı `details` içerebilir.

Tam endpoint sözleşmeleri, örnekler ve hata cevapları [docs/api.md](./docs/api.md) içindedir. Bu projede güncelleme için yalnız `PATCH` desteklenir; `PUT` eklenmemiştir.

Backend tamamlanan istekleri varsayılan olarak yöntem, path, durum ve süreyle terminale loglar. `REQUEST_LOGGING=false` ile kapatılabilir; query değerleri, header ve body loglanmaz.

Backend için kullanılabilir npm script'leri:

- `npm run dev`: Sunucuyu dosya değişikliklerini izleyerek başlatır.
- `npm start`: Sunucuyu izleme modu olmadan başlatır.
- `npm test`: Express API integration testlerini rastgele boş bir portta çalıştırır.
- `npm run check`: Backend kaynak dosyalarında syntax kontrolü yapar.

## Otomatik testler ve kalite kontrolü

Yeni test paketi kurulmamıştır; frontend ve backend Node.js'in yerleşik test çalıştırıcısını kullanır.

Backend:

```powershell
cd backend
npm test
npm run check
```

Frontend:

```powershell
cd frontend
npm test
npm run lint
npm run build
```

Aşama 11 son doğrulamasında backend testleri `19/19`, frontend testleri `54/54` geçmiştir. Backend testleri gerçek HTTP istekleri, CRUD, sayfalama ve log middleware'ini kapsar; ürün state'i testler arasında sıfırlanır. Frontend testleri arama/kategori/fiyat/sıralama, sayfalama, sepet/storage, favori reducer ve yönetim formu mantığını kapsar. Production build JSX componentlerinin derlenebilirliğini kontrol eder; gerçek tarayıcı davranışı, responsive görünüm, klavye ve görsel tasarım manuel kontrol listesine aittir.

## Frontend ve backend'i birlikte çalıştırma

Birinci terminal:

```powershell
cd backend
npm ci
npm run dev
```

İkinci terminal:

```powershell
cd frontend
npm ci
npm run dev
```

Ardından tarayıcıda:

1. `http://localhost:5180` adresini açarak ürün kartlarını kontrol et.
2. Bir ürün kartına tıklayıp `/products/{id}` detayına gidildiğini kontrol et.
3. `http://localhost:3000/api/health` adresini açarak backend cevabını kontrol et.

İki terminalin açık kalması gerekir; frontend ve backend ayrı süreçlerdir.

## Environment variable kullanımı

Backend portu ve izin verilen frontend adresi environment variable ile değiştirilebilir. Örnek değerler `backend/.env.example` dosyasındadır. Frontend'in API taban adresi de `frontend/.env.example` ile belgelenmiştir.

PowerShell'de isteğe bağlı yerel ayar dosyasını oluşturmak için:

```powershell
cd backend
Copy-Item .env.example .env
```

Oluşturduğun `.env` dosyasındaki örnekler:

```dotenv
PORT=3000
CORS_ORIGIN=http://localhost:5180
REQUEST_LOGGING=true
```

- `PORT`, backend'in dinleyeceği portu belirler.
- `CORS_ORIGIN`, tarayıcıdan backend'e erişmesine izin verilen frontend adresini belirler.
- `REQUEST_LOGGING`, `false` olduğunda basit backend istek loglarını kapatır.
- `.env` kişisel/yerel ayardır ve `.gitignore` nedeniyle Git'e eklenmez.
- `.env.example` yalnızca gereken değişkenleri gösterir; hassas bilgi içermez ve Git'e eklenebilir.

`.env` oluşturmak zorunlu değildir. Dosya yoksa backend `3000` portunu ve `http://localhost:5180` CORS origin değerini kullanır.

Frontend varsayılan olarak `http://localhost:3000` API adresini kullanır. Farklı bir backend adresi gerekiyorsa:

```powershell
cd frontend
Copy-Item .env.example .env
```

```dotenv
VITE_API_BASE_URL=http://localhost:3000
```

Vite environment variable'ı değiştirildikten sonra frontend geliştirme sunucusu yeniden başlatılmalıdır. Bu değişkende API yolu (`/api/products`) değil, yalnızca origin/taban adres yazılır.

## Hızlı doğrulama

Frontend kontrolleri:

```powershell
cd frontend
npm test
npm run lint
npm run build
```

Backend test ve syntax kontrolü:

```powershell
cd backend
npm test
npm run check
```

Backend çalışırken başka bir PowerShell terminalinden sağlık endpoint'ini kontrol etmek için:

```powershell
$response = Invoke-WebRequest http://localhost:3000/api/health -UseBasicParsing
$response.StatusCode
$response.Content
```

Beklenen sonuç `200` ve `{"status":"ok"}` cevabıdır.

Ürün endpoint'lerini hızlıca kontrol etmek için:

```powershell
Invoke-RestMethod http://localhost:3000/api/products
Invoke-RestMethod http://localhost:3000/api/products/p-001
```

PowerShell ile kopyalanabilir POST, PATCH ve DELETE örnekleri için [API dokümantasyonundaki hızlı CRUD zincirini](./docs/api.md#powershell-ile-hızlı-crud-zinciri) kullan.

## Bonus durumu ve bilinen sınırlamalar

Kaynak görevin altı bonusu uygulanmıştır; bunlar zorunlu özelliklerin yerine geçmez:

- **Sepetin sayfa yenilemesinde korunması:** `localStorage` ile uygulanmıştır.
- **Fiyat aralığı filtresi:** Minimum/maksimum ve birleşik katalog kontrolleriyle uygulanmıştır.
- **Favoriler:** Liste, detay, ortak state ve ayrı favoriler sayfasıyla uygulanmıştır.
- **Basit backend loglama:** Yöntem, path, durum ve süreyi gizlilik sınırıyla kaydeder.
- **Sayfalama:** API'de isteğe bağlı `page`/`limit`, frontend'de birleşik sonuç sonrası altışar ürün olarak uygulanmıştır.
- **Ürün yönetim arayüzü:** `/manage-products` üzerinde oluşturma, düzenleme, validasyon ve onaylı silme sunar.

Bilinen sınırlamalar:

- Sepet yalnız aynı tarayıcı ve origin içindeki `localStorage` alanında korunur; başka tarayıcıya veya cihaza senkronize edilmez. Tarayıcı verisi temizlenirse sepet kaybolur.
- Storage'daki sepet, ürünün temel bilgilerinin bir anlık kopyasını taşır; backend'de ürün daha sonra değiştirilir veya silinirse kayıt otomatik uzlaştırılmaz.
- Favoriler storage'a yazılmaz ve sayfa yenilendiğinde sıfırlanır.
- Backend CRUD değişiklikleri yalnız backend belleğinde yaşar ve backend yeniden başlatıldığında sıfırlanır; bu davranış sepet bonusundan bağımsızdır.
- Backend query parametreleriyle sunucu tarafı arama, filtreleme veya sıralama.
- Yönetim arayüzünde authentication/yetkilendirme yoktur; üretim admin paneli olarak güvenli değildir.
- Veritabanı, ödeme ve sipariş sistemi.
- E2E/tarayıcı test altyapısı, coverage hedefi veya deployment yapılandırması.
- Ürün görselleri harici `placehold.co` servisine bağlıdır; erişilemezse frontend fallback gösterir.

Ürün dizisi kalıcı değildir. POST, PATCH ve DELETE işlemleri yalnız çalışan backend sürecinin belleğini değiştirir. Backend yeniden başladığında `backend/src/data/products.js` içindeki 10 başlangıç ürünü yeniden yüklenir; çalışma zamanı değişiklikleri dosyaya veya veritabanına yazılmaz.
