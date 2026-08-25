# Full-Stack E-Ticaret Uygulaması

Bu repository, React frontend ile Node.js/Express backend'in birlikte çalışacağı küçük ölçekli bir e-ticaret uygulaması için hazırlanmıştır.

Şu anda yalnızca **Aşama 2 - Proje İskeleti** tamamlanmaktadır. React başlangıç ekranı ve Express sağlık kontrolü vardır; ürün, arama, filtre, sıralama, sepet, veritabanı ve bonus özellikler henüz uygulanmamıştır.

## Kullanılan teknolojiler

- Frontend: React, Vite ve JavaScript.
- Backend: Node.js, Express ve JavaScript.
- Paket yöneticisi: npm.
- Veri tabanı: Kullanılmıyor.

## Proje yapısı

```text
04-05/
  frontend/        React uygulaması
  backend/         Express uygulaması
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

## Bu aşamanın sınırı

Aşama 2 yalnızca çalışır proje iskeletini oluşturur. Aşağıdakiler bilinçli olarak henüz eklenmemiştir:

- Ürün veri modeli veya başlangıç ürünleri.
- Ürün listeleme, detay veya CRUD endpoint'leri.
- React ürün sayfaları.
- Arama, filtreleme, sıralama veya sepet.
- Veritabanı ve authentication.
- Ödeme, sipariş ve bonus özellikler.
- Test framework'ü veya deployment yapılandırması.

