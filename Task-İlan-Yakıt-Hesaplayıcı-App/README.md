# YataOil — Araç Bilgi ve Yakıt Maliyet Sistemi

React/TypeScript istemci, Express/TypeScript API, Puppeteer tabanlı Arabam adaptörleri ve
sunucu tarafı CollectAPI entegrasyonundan oluşan araç inceleme akışıdır. İstemci
`http://localhost:3000`, API `http://localhost:3001` üzerinde çalışır.

Uygulama marka → ilk sayfa ilanları → ham araç detayı → benzin fiyatı → aylık/depo maliyeti
akışını sunar. Arabam ve CollectAPI yanıtları normalize edilmez, kalıcı olarak saklanmaz ve
hesaplama için gereken sayısal yorum yalnız hesap isteği sırasında geçici olarak yapılır.
Marka kataloğundaki `apps/backend/data/brands.json` bu kuralın tek istisnasıdır: son başarılı marka
kazımasının cache dosyasıdır.

## Gereksinimler

- Node.js 20.19 veya üstü
- npm 10 veya üstü
- Canlı Arabam erişimi için Puppeteer tarafından kullanılabilen Chrome/Chromium
- Canlı yakıt fiyatı için CollectAPI anahtarı

## Kurulum

```bash
npm install
```

Puppeteer tarayıcı ikilisini kurmadıysa:

```bash
npx puppeteer browsers install chrome
```

Canlı CollectAPI kullanımı için `apps/backend/.env.example` dosyasını yerelde `apps/backend/.env` olarak
kopyalayın ve yalnız sunucu dosyasına gerçek anahtarı yazın:

```ini
COLLECTAPI_API_KEY=your_server_only_key
DATA_SOURCE_MODE=live
```

Gerçek `.env` git tarafından yok sayılır. `COLLECTAPI_API_KEY` istemci değişkeni değildir;
API yanıtlarına veya loglara eklenmez. CollectAPI’nin resmi kullanım biçimine uygun olarak
yalnız sunucudan gönderilen `Authorization: apikey …` başlığında kullanılır. `.env` değerine
yalnız gerçek anahtarı yazmak yeterlidir; `apikey` önekini sunucu ekler.

## Çalıştırma

Varsayılan mod canlı kaynaktır:

```bash
npm run dev
```

Tek komut ortak sözleşmeyi izler ve frontend/backend geliştirme süreçlerini birlikte başlatır.
Tarayıcıda kullanılacak uygulama adresi `http://localhost:3000`'dır. API kök adresi
`http://localhost:3001` ise sunucunun çalıştığını, sağlık yolunu ve kullanılabilir endpointleri
gösteren bir servis bilgi yanıtı döndürür. Sağlık kontrolü:

```bash
curl http://localhost:3001/api/health
```

Marka ekranında “API sunucusuna ulaşılamıyor” mesajı görülürse komutun proje kökünde
çalıştırıldığını ve terminalde hem `frontend` hem `backend` süreçlerinin başladığını kontrol edin.
Hata ekranındaki `Yeniden dene` düğmesi marka isteğini tekrar gönderir.

Detay ekranında `CollectAPI anahtarı eksik` mesajı görülürse `apps/backend/.env.example` dosyasını
`apps/backend/.env` olarak kopyalayın, `COLLECTAPI_API_KEY` değerini gerçek anahtarla doldurun ve
`npm run dev` sürecini yeniden başlatın. Gerçek anahtarı istemci değişkenlerine veya kaynak
koda yazmayın.

## Fixture modu ve manuel test

Fixture modu gizli fallback değildir. Yalnız `DATA_SOURCE_MODE=fixture` açıkça ayarlandığında
ve `NODE_ENV` production olmadığında etkinleşir. Bu mod Arabam veya CollectAPI ağına çıkmadan
tam kullanıcı akışını sağlar.

PowerShell:

```powershell
$env:DATA_SOURCE_MODE = 'fixture'
npm run dev
```

Bash:

```bash
DATA_SOURCE_MODE=fixture npm run dev
```

Manuel akış:

1. `http://localhost:3000` adresini açın.
2. `Audi` markasını seçin.
3. Fixture Audi A3 ilanında `İlanı incele` düğmesini kullanın.
4. Ham teknik alanları ve araç görsellerini kontrol edin.
5. `Fixture Petrol` yakıt markasını seçin.
6. Aylık kilometreye örneğin `1200` yazıp `Maliyeti hesapla` düğmesine basın.
7. Aylık maliyet, depo maliyeti ve aylık litre sonucunu doğrulayın.

Production ortamında `DATA_SOURCE_MODE=fixture` verilse bile fixture modu açılmaz. Canlı moda
dönmek için değişkeni kaldırın veya `live` yapın.

## Kalite komutları

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run format:check
```

Varsayılan test paketi kaydedilmiş HTML fixture’larını ve mock adaptörleri kullanır; gerçek
Arabam veya CollectAPI çağrısı yapmaz. `npm test`, sunucu testlerinin ardından React/jsdom
kullanıcı akışı testlerini de çalıştırır.

## API

Temel yol: `http://localhost:3001/api`

- `GET /health` — sağlık kontrolü
- `GET /brands` — doğrulanmış marka kataloğu ve `live` / `cache` / `fallback` metadata’sı
- `GET /search?brandSlug=audi` — izinli marka sayfasının ilk sayfasındaki ham ilan satırları
- `POST /details` — güvenli relative ilan yolu için ham araç detayı ve yakıt fiyatı yanıtı
- `POST /cost-estimate` — geçici sayısal yorumla aylık/depo maliyeti

### Marka kataloğu

Canlı katalog yalnız `https://www.arabam.com/ikinci-el/otomobil` kaynağını kullanır. Önce
Puppeteer adaptörü denenir. Headless tarayıcı 403/timeout alırsa erişim kontrolünü aşmaya
çalışmadan, yönlendirmeleri kabul etmeyen ve kendini `YataOil/0.1` olarak tanıtan standart
HTTP adaptörü aynı sayfanın HTML'ini okur. İki adaptör de aynı link/slug parser'ından geçer.
Başarılı sonuç belleğe ve atomik olarak `apps/backend/data/brands.json` dosyasına yazılır.

Kaynak önceliği geçerli bellek → Puppeteer canlı kaynak → aynı sayfaya HTTP canlı kaynak →
son geçerli JSON → dahili beş markalık fallback biçimindedir. Depodaki `brands.json` başlangıç
cache'i de son başarılı Arabam okumasındaki tam kataloğu içerir; beşli liste yalnız hem canlı
kaynaklar hem cache kullanılamadığında devreye girer. Marka cache TTL değeri altı saattir;
eşzamanlı yenilemeler tek kazıma çalışmasını paylaşır.

`/search` yalnız bu etkin katalogdaki slug’ları kabul eder. Geçersiz veya katalogda olmayan
değer `400 INVALID_BRAND_SLUG` alır.

### Ham ilan araması

`/search`, yalnız `https://www.arabam.com/ikinci-el/otomobil/{brandSlug}` adresine gider.
Başlıklar, kolon sırası, hücre metinleri, görsel `src`, detay `href` ve satır metni ham olarak
döner. Puppeteer bu sayfada 403/timeout alırsa marka kataloğuyla aynı güvenli HTTP okuma
yöntemi denenir. İlan sonucu cache'e, dosyaya veya veritabanına yazılmaz.

### Araç detayı ve CollectAPI

`POST /details` örneği:

```json
{
  "detailHref": "/ilan/kaynaktaki-relative-yol/123",
  "city": "İstanbul",
  "district": "Kadıköy"
}
```

`detailHref` yalnız `/ilan/` ile başlayan güvenli relative yol olabilir. Harici URL’ler,
şemalar, `//`, `..`, backslash, kontrol/boşluk karakterleri ve tehlikeli percent-encoded yol
bileşenleri tarayıcı başlamadan `400 INVALID_DETAIL_HREF` ile reddedilir. Sunucu URL’yi sabit
`https://www.arabam.com` origin’iyle oluşturur.

Detay servisi önce Puppeteer’ı, tarayıcı 403/timeout aldığında ise yönlendirmeleri kabul
etmeden aynı doğrulanmış Arabam detay URL’sine yapılan standart HTTP okumasını kullanır.
Normal sayfalardaki Cloudflare Insights betiği erişim engeli sayılmaz; gerçek challenge formu
veya challenge sayfası algılanırsa aşılmaya çalışılmaz. Her iki yöntem de başarısızsa `502
UPSTREAM_ERROR` döner.

Başarılı yanıtta `sections`, `fields`, `rawText` ve ham `images` kaynakları döndürülür.
Telefon, iletişim, gereksiz satıcı blokları ve satıcının serbest metin ilan açıklaması
çıkarılır; teknik nitelikler ham değerleriyle korunur. Detay sonucu hiçbir cache veya dosyaya
yazılmaz. Tarayıcı timeout, HTTP hatası ve başarılı sonuçta kapatılır.

İl ve ilçe birlikte varsa sunucu aynı istek içinde yalnız şu endpointi çağırır:

```text
https://api.collectapi.com/gasPrice/turkeyGasoline?district=...&city=...
```

Arabam’dan alınan şehir/ilçe değerleri `fuelLocation` içinde değiştirilmeden korunur. Yalnız
CollectAPI isteği oluşturulurken dokümandaki biçime uygun olarak küçük harfli ASCII sorgu
parametrelerine çevrilip URL-encode edilir. Başarılı CollectAPI JSON’u `fuelPriceResponse`
altında ham olarak korunur. CollectAPI başarısızlığı araç detayını başarısız yapmaz; endpoint
HTTP 200 ile detayı ve `fuelPriceResponse.error.code = FUEL_PRICE_UNAVAILABLE` bilgisini
döndürür. İl veya ilçe yoksa çağrı yapılmaz ve aynı alanda bu durum açıkça belirtilir.

### Maliyet hesabı

`POST /cost-estimate`, aylık km, ham ortalama tüketim, ham depo kapasitesi ve seçilen ham litre
fiyatını request body’de alır. Desteklenen açık birim metinleri yalnız fonksiyon içinde
decimal aritmetiğe çevrilir:

```text
aylikMaliyet = (aylikKm / 100) * ortalamaTuketim * litreFiyati
depoMaliyeti = yakitDeposu * litreFiyati
```

Eksik veya güvenle yorumlanamayan alanlarda tahmin üretilmez; `422
CALCULATION_INPUT_INVALID` döner. Ara işlemler `decimal.js` ile yapılır ve hiçbir girdi
saklanmaz.

## Arayüz davranışı

- Aynı sayfaya alt alta yığılmayan, marka kataloğu → ilan sonuçları → araç detayı biçiminde ayrı
  ekranlar
- Arama destekli marka kartları; marka seçimiyle açılan bağımsız sonuç görünümü
- Kaynak kolon sırasını koruyan masaüstü tablosu ve dar ekranda kart görünümü; ilan seçimiyle
  açılan bağımsız detay görünümü
- Kaynak API yanıtını değiştirmeden, ilan tablosunda hücrelere karışan karşılaştırma, favori ve
  gizleme kontrol metinlerini yalnız kullanıcı arayüzünde temizleme
- Breadcrumb, `Marka değiştir` ve `İlan sonuçlarına dön` kontrolleri
- Ham teknik detay bölümleri, alanları ve araç görsel kaynakları; satıcı ilan açıklaması
  gösterilmez
- CollectAPI yanıtından türetilen yakıt markası seçimi
- Kaynak tüketim/depo metinleri ile sunucu tarafı maliyet hesabı
- Ayrı marka, ilan ve detay yüklenme durumları
- Boş ilan, CollectAPI hatası, eksik tüketim/depo ve geçersiz aylık km mesajları
- Etiketli form kontrolleri, görünür klavye odağı, atlama bağlantısı ve mobil dokunma alanları

Arabam 403, CAPTCHA veya Cloudflare erişim doğrulaması döndürürse sistem bunu aşmaya çalışmaz.
Marka, ilan ve detay sayfalarında Puppeteer'dan sonra aynı URL'ye standart HTTP okuması denenir;
ancak iki canlı yöntem de başarısızsa sunucu `502 UPSTREAM_ERROR` döndürür. Arayüz erişim
kontrolü/403 olasılığını ve tekrar denenebilir bir kaynak hatası olduğunu açık mesajla gösterir.
Canlı sayfadaki birleşik `İl / İlçe` hücresinde kaynak şehir ve ilçe metinleri ayrı DOM
öğelerinde yer aldığı sırayla detay isteğine aktarılır; ham ilan hücresi değiştirilmez. Kaynakta
iki değer güvenle bulunamazsa CollectAPI çağrısı atlanır ve kullanıcıya konum eksikliği
gösterilir.

## Proje yapısı

```text
apps/frontend/src/               React ekranı, API istemcisi ve UI testleri
apps/backend/src/routes/         Express route’ları
apps/backend/src/services/       Marka, arama, detay, yakıt ve maliyet adaptörleri
apps/backend/src/fixtures/       Açık geliştirme/test modu bağımlılıkları
apps/backend/data/brands.json    Son başarılı marka kazıması cache’i
apps/backend/test/fixtures/      Ağsız HTML parser fixture’ları
packages/contracts/src/          Zod request/response sözleşmeleri ve ortak tipler
```

Canlı scraper seçicileri kaynak sayfanın DOM değişikliklerinden etkilenebilir. Yayına almadan
önce Arabam kullanım koşulları/robot politikası incelenmeli ve Puppeteer çalıştırabilen bir
Node.js ortamı kullanılmalıdır.
