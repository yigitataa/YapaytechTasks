# Full-Stack E-Ticaret Uygulaması

Bu repository, React frontend ile Node.js/Express backend'in birlikte çalışacağı küçük ölçekli bir e-ticaret uygulaması için hazırlanmıştır.

Şu anda **Aşama 3 - Backend Ürün Okuma API'si** uygulanmıştır. React başlangıç ekranı korunur; Express backend sağlık kontrolünün yanında ürün listeleme ve ürün detayı okuma işlemlerini destekler. Ürün oluşturma, güncelleme, silme, frontend ürün ekranları, arama, filtre, sıralama ve sepet henüz uygulanmamıştır.

## Kullanılan teknolojiler

- Frontend: React, Vite ve JavaScript.
- Backend: Node.js, Express ve JavaScript.
- Paket yöneticisi: npm.
- Veri tabanı: Kullanılmıyor.

## Proje yapısı

```text
04-05/
  frontend/        React uygulaması
  backend/
    src/
      data/        Başlangıç ürün dizisi
      services/    Ürün verisini okuma işlemleri
      controllers/ HTTP isteği ve cevap yönetimi
      routes/      Endpoint-controller eşleştirmesi
      middleware/  Ortak 404 ve hata cevapları
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

## Ürün okuma API'si

Ürün verileri backend içindeki JavaScript dizisinde tutulur. Başlangıç veri kümesinde 10 ürün ve 6 kategori vardır.

| Yöntem | Endpoint | Başarı | Bulunamadı | Açıklama |
|---|---|---|---|---|
| `GET` | `/api/products` | `200` ve JSON dizisi | - | Bütün başlangıç ürünlerini döndürür. |
| `GET` | `/api/products/:id` | `200` ve JSON nesnesi | `404` ve JSON mesajı | Kimliği verilen tek ürünü döndürür. |

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

Bu aşamada yalnızca `GET` ürün işlemleri vardır. `POST`, `PUT`, `PATCH` ve `DELETE` henüz desteklenmez.

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

1. `http://localhost:5173` adresini açarak React başlangıç ekranını kontrol et.
2. `http://localhost:3000/api/health` adresini açarak backend cevabını kontrol et.

İki terminalin açık kalması gerekir; frontend ve backend ayrı süreçlerdir.

## Environment variable kullanımı

Backend portu ve izin verilen frontend adresi environment variable ile değiştirilebilir. Örnek değerler `backend/.env.example` dosyasındadır.

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
$response = Invoke-WebRequest http://localhost:3000/api/health
$response.StatusCode
$response.Content
```

Beklenen sonuç `200` ve `{"status":"ok"}` cevabıdır.

Ürün endpoint'lerini hızlıca kontrol etmek için:

```powershell
Invoke-RestMethod http://localhost:3000/api/products
Invoke-RestMethod http://localhost:3000/api/products/p-001
```

## Bu aşamanın sınırı

Aşama 3 yalnızca backend ürün okuma işlemlerini ekler. Aşağıdakiler bilinçli olarak henüz eklenmemiştir:

- `POST`, `PUT`, `PATCH` veya `DELETE` ürün endpoint'leri.
- Ürün oluşturma/güncelleme validasyonu.
- React ürün sayfaları.
- Arama, filtreleme, sıralama veya sepet.
- Veritabanı ve authentication.
- Ödeme, sipariş ve bonus özellikler.
- Test framework'ü veya deployment yapılandırması.

Ürün dizisi kalıcı değildir. Backend yeniden başladığında `backend/src/data/products.js` içindeki 10 başlangıç ürünü yeniden yüklenir; çalışma zamanındaki olası değişiklikler dosyaya veya veritabanına yazılmaz.
