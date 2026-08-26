# Full-Stack E-Ticaret Uygulaması

Bu repository, React frontend ile Node.js/Express backend'in birlikte çalışacağı küçük ölçekli bir e-ticaret uygulaması için hazırlanmıştır.

Şu anda **Aşama 7 - Sepet Yönetimi, Adetler ve Toplamlar** uygulanmıştır. **Yata Market** adlı React arayüzünde arama, kategori filtresi ve fiyat sıralaması birlikte çalışır. Ürünler katalog kartından veya detay sayfasından sepete eklenebilir; aynı ürün yeniden eklendiğinde mevcut adedi artar. Sepet sayfasında adet değiştirme, tek ürünü kaldırma, sepeti temizleme ve doğru toplamları görme işlemleri bulunur. Mavi-mor geçişli tema, responsive düzen ve erişilebilir hareket tercihleri korunur. Aşama 4'te tamamlanan backend CRUD sözleşmesi değişmemiştir. Son Aşama 7 değişiklikleri kullanıcının isteğiyle otomatik test edilmemiştir ve manuel kontrole bağlıdır.

## Kullanılan teknolojiler

- Frontend: React, React Router, Vite ve JavaScript.
- Backend: Node.js, Express ve JavaScript.
- Paket yöneticisi: npm.
- Veri tabanı: Kullanılmıyor.

## Proje yapısı

```text
04-05/
  frontend/
    src/
      api/          Express ürün API'siyle ortak iletişim
      components/   Kart, görsel, fiyat ve UI durumları
      features/cart/ Sepet Context, reducer, hesaplamalar ve bileşenler
      pages/        Ürün listesi, detay, sepet ve 404 sayfaları
      utils/        Para birimi biçimlendirme
      App.jsx       Frontend route eşleştirmeleri
    .env.example    İsteğe bağlı API taban adresi örneği
  backend/
    src/
      data/        Başlangıç ürün dizisi
      services/    Ürün verisini okuma ve değiştirme işlemleri
      controllers/ HTTP isteği ve cevap yönetimi
      routes/      Endpoint-controller eşleştirmesi
      middleware/  Ortak 404 ve hata cevapları
      validators/  Ürün request body kuralları
      errors/      Kontrollü uygulama hatası sınıfı
      app.js        Express yapılandırması
      server.js     Port dinleme işlemi
  docs/            Gereksinim, karar ve öğrenme belgeleri
  .gitignore       Git'e eklenmeyecek yerel dosyalar
  README.md        Kurulum ve çalıştırma rehberi
```

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
npm install
npm run dev
```

Vite geliştirme sunucusu varsayılan olarak şu adreste açılır:

```text
http://localhost:5173
```

Frontend için kullanılabilir npm script'leri:

- `npm run dev`: Geliştirme sunucusunu başlatır.
- `npm run lint`: JavaScript ve JSX dosyalarını ESLint ile kontrol eder.
- `npm run build`: Yayına hazırlanmış production dosyalarını `dist/` içine üretir.
- `npm run preview`: Oluşturulan production build'i yerel olarak önizler.

Frontend route'ları:

| Adres | Görünüm |
|---|---|
| `/` | Backend'den gelen ürünlerin responsive kart listesi |
| `/products/:productId` | Kimliği URL'den alınan tek ürün detayı |
| `/cart` | Sepet ürünleri, adet kontrolleri ve toplam özeti |
| Diğer adresler | Kontrollü “Sayfa bulunamadı” görünümü |

Liste isteği `GET /api/products`, detay isteği `GET /api/products/:id` endpoint'ini kullanır. Ürün dizisi frontend kaynak koduna kopyalanmamıştır.

Katalog kontrolleri:

- **Ürün ara:** Yalnız ürün adında, büyük/küçük harf ve Türkçe karakter farklarına duyarsız kısmi eşleşme yapar.
- **Kategori:** Seçenekleri backend'den gelen ürünlerin benzersiz kategorilerinden üretir; “Tüm kategoriler” filtreyi kaldırır.
- **Sırala:** “Fiyat: düşükten yükseğe” ve “Fiyat: yüksekten düşüğe” seçeneklerini sunar. “Önerilen sıra” API sırasını korur.
- **Seçimleri temizle:** Arama, kategori ve sıralamayı birlikte başlangıç değerlerine döndürür.

Kontroller anlık ve birlikte uygulanır. Sonuç yoksa bu durum API hatası sayılmaz; “Aramana uygun ürün bulunamadı” paneli ve “Tüm ürünleri göster” düğmesi görünür. Detay sayfasına gidip listeye dönüldüğünde veya sayfa yenilendiğinde seçimler sıfırlanır; Aşama 6'da URL ya da tarayıcı depolamasıyla kalıcılık eklenmemiştir.

Sepet kullanımı:

- Katalog kartındaki **Sepete ekle** düğmesi detay sayfasını açmadan ürün ekler.
- Ürün sepete eklendikten sonra katalogda ve detay sayfasında düğmenin yerini **sil | adet | artır** kontrolü alır. Çöp kutusu ürünü sepetten kaldırır, ortadaki sayı mevcut adedi gösterir ve `+` adedi artırır.
- Header'daki sepet rozeti bütün ürün adetlerinin toplamını gösterir.
- Sepet sayfasındaki `+` adedi artırır. Adet `1` iken azaltma düğmesi çöp kutusuna dönüşür ve yalnız o ürün satırını kaldırır.
- Her satırdaki **Kaldır** ürünü doğrudan siler; **Sepeti temizle** bütün satırları kaldırır.
- Sepet yalnız React belleğinde tutulur. Sayfa yenilendiğinde sıfırlanması beklenen davranıştır; yenilemede kalıcılık bonusu uygulanmamıştır.

Arayüz hareketleri `prefers-reduced-motion` tercihini destekler. İşletim sisteminde azaltılmış hareket etkinse dekoratif giriş, gradient ışık ve yükleyici animasyonları yaklaşık sıfır süreye indirilir.

## Backend kurulumu ve çalıştırma

Proje kökünden:

```powershell
cd backend
npm install
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
| `GET` | `/api/products` | `200` ve JSON dizisi | - | Bütün ürünleri döndürür. |
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

Backend için kullanılabilir npm script'leri:

- `npm run dev`: Sunucuyu dosya değişikliklerini izleyerek başlatır.
- `npm start`: Sunucuyu izleme modu olmadan başlatır.
- `npm run check`: Backend kaynak dosyalarında syntax kontrolü yapar.

## Frontend ve backend'i birlikte çalıştırma

Birinci terminal:

```powershell
cd backend
npm install
npm run dev
```

İkinci terminal:

```powershell
cd frontend
npm install
npm run dev
```

Ardından tarayıcıda:

1. `http://localhost:5173` adresini açarak ürün kartlarını kontrol et.
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
CORS_ORIGIN=http://localhost:5173
```

- `PORT`, backend'in dinleyeceği portu belirler.
- `CORS_ORIGIN`, tarayıcıdan backend'e erişmesine izin verilen frontend adresini belirler.
- `.env` kişisel/yerel ayardır ve `.gitignore` nedeniyle Git'e eklenmez.
- `.env.example` yalnızca gereken değişkenleri gösterir; hassas bilgi içermez ve Git'e eklenebilir.

`.env` oluşturmak zorunlu değildir. Dosya yoksa backend `3000` portunu ve `http://localhost:5173` CORS origin değerini kullanır.

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
npm run lint
npm run build
```

Backend syntax kontrolü:

```powershell
cd backend
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

## Bu aşamanın sınırı

Aşama 7, ortak sepet state'ini, adet yönetimini ve toplam hesaplarını ekler. Aşağıdakiler bilinçli olarak henüz eklenmemiştir:

- Favoriler ve kalıcı istemci state'i.
- Bonus fiyat aralığı filtresi ve sayfalama.
- Backend query parametreleriyle sunucu tarafı arama, filtreleme veya sıralama.
- Frontend ürün oluşturma, düzenleme veya silme arayüzü.
- Veritabanı ve authentication.
- Ödeme, sipariş ve bonus özellikler.
- Test framework'ü veya deployment yapılandırması.

Ürün dizisi kalıcı değildir. POST, PATCH ve DELETE işlemleri yalnız çalışan backend sürecinin belleğini değiştirir. Backend yeniden başladığında `backend/src/data/products.js` içindeki 10 başlangıç ürünü yeniden yüklenir; çalışma zamanı değişiklikleri dosyaya veya veritabanına yazılmaz.
