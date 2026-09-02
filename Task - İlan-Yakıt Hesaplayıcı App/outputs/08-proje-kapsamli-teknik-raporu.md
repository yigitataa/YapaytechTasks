# YataOil Kapsamlı Proje ve Teknik Akış Raporu

**Rapor tarihi:** 2 Eylül 2026  
**Proje durumu:** Uçtan uca çalışan MVP; canlı CollectAPI doğrulaması için sunucu anahtarı
bekleniyor

## 1. Yönetici özeti

YataOil, Arabam üzerindeki ikinci el otomobil verilerini ham biçimine mümkün olduğunca sadık
kalarak gösteren ve seçilen benzin litre fiyatıyla aylık kullanım/depo maliyeti hesaplayan bir
React + Express uygulamasıdır.

Bugün ulaşılan işlevsel akış şöyledir:

1. Arabam otomobil kategori sayfasından markalar alınır.
2. Kullanıcının seçtiği markanın ilk sayfa ilanları alınır.
3. Kullanıcı bir ilana tıkladığında araç detay sayfası okunur.
4. Teknik alanlar ve araç görselleri gösterilir; kişisel iletişim ve satıcı açıklaması çıkarılır.
5. İlan konumu kullanılarak CollectAPI'nin yalnız `turkeyGasoline` endpointinden benzin
   fiyatları istenir.
6. Kullanıcı bir istasyon/marka seçer ve aylık kilometresini girer.
7. Kaynaktaki tüketim ve depo değerleri uygunsa aylık yakıt ve depo dolum maliyeti hesaplanır.

Arabam tarafındaki marka kataloğu dışında ilan, araç detayı veya yakıt fiyatı kalıcı olarak
saklanmaz. Marka kataloğu son başarılı canlı okumanın dayanıklı cache'i olarak
`server/data/brands.json` dosyasına yazılır. Bu dosyada rapor tarihinde 80 marka vardır.

## 2. Mevcut teknik mimari

| Katman | Teknoloji | Sorumluluk |
| --- | --- | --- |
| İstemci | React + TypeScript + Vite | Marka, ilan, detay ve maliyet ekranları |
| Sunucu | Node.js + Express + TypeScript | API, kaynak adaptörleri, doğrulama ve hesaplama |
| Ortak sözleşme | TypeScript + Zod | İstemci ve sunucunun ortak request/response şemaları |
| Canlı web kaynağı | Puppeteer + standart HTTP failover | Arabam marka, ilan ve detay HTML'lerini okuma |
| HTML ayrıştırma | Cheerio | Ham tablo, alan, link ve görselleri çıkarma |
| Yakıt fiyatı | CollectAPI | Yalnız Türkiye benzin fiyatı sorgusu |
| Hassas hesap | decimal.js | Ondalık para hesabında hassasiyet kaybını önleme |
| Test | Vitest + Supertest + Testing Library | Birim, API ve React kullanıcı akışı testleri |

Monorepo üç npm workspace'inden oluşur:

```text
client/   React uygulaması
server/   Express API ve dış kaynak adaptörleri
shared/   Zod şemaları ve ortak TypeScript tipleri
```

Geliştirme adresleri:

- İstemci: `http://localhost:3000`
- Sunucu: `http://localhost:3001`
- İstemci geliştirme proxy'si: `/api` → `http://localhost:3001`

## 3. Aşama aşama yapılan çalışmalar

### Aşama 1 — Temel altyapı

- Root npm workspace yapısı kuruldu.
- React istemci `client/`, Express sunucu `server/`, ortak sözleşmeler `shared/` altında
  ayrıştırıldı.
- Tek komutla ortak sözleşme, istemci ve sunucuyu birlikte çalıştıran `npm run dev` eklendi.
- İstemci 3000, sunucu 3001 portuna sabitlendi.
- CORS yalnız `http://localhost:3000` için yapılandırıldı.
- JSON gövde limiti 100 KB yapıldı.
- `x-powered-by` başlığı kapatıldı.
- Merkezi hata middleware'i ve Zod tabanlı request doğrulaması eklendi.
- ESLint, Prettier, TypeScript typecheck, Vitest ve üretim build komutları oluşturuldu.
- `GET /api/health` endpointi ve testi eklendi.

### Aşama 2 — Statik marka kataloğu ve allow-list

- İlk marka veri modeli `{ name, slug }` olarak tanımlandı.
- İsimlerin boş olmaması ve slug değerlerinin yalnız küçük harf, rakam ve tire içermesi Zod ile
  güvenceye alındı.
- Yinelenen slug değerleri reddedildi.
- Katalog okunamadığında kullanılmak üzere Alfa Romeo, Audi, BMW, Fiat ve Renault'dan oluşan
  beş markalık dahili fallback oluşturuldu.
- `/api/search` için katalog tabanlı marka allow-list kontrolü getirildi.

### Aşama 3 — Canlı marka kazıma ve dayanıklı cache

- Kaynak yalnız `https://www.arabam.com/ikinci-el/otomobil` olarak sınırlandı.
- Marka slug'ı isimden üretilmedi; tam uyan `/ikinci-el/otomobil/{slug}` bağlantısının
  `href` değerinden alındı.
- Görünen metnin sonundaki ilan sayısı çıkarıldı: örneğin `Audi 4.943` → `Audi`.
- Ana kategori, ilan linki ve kategori dışı bağlantılar filtrelendi.
- Kayıtlar Türkçe alfabetik sıraya kondu.
- Puppeteer canlı adaptörü ve aynı URL'yi okuyan standart HTTP failover adaptörü eklendi.
- Başarılı sonuç geçici dosyaya yazılıp `rename` edilerek atomik biçimde
  `server/data/brands.json` dosyasına kaydedildi.
- Altı saatlik bellek cache'i ve aynı anda yalnız bir yenileme çalışmasını paylaşan single-flight
  mekanizması eklendi.

Marka kaynak sırası:

```text
Geçerli bellek cache'i
  → Puppeteer canlı kaynak
  → Aynı URL için standart HTTP canlı kaynak
  → Son geçerli brands.json
  → Dahili beş markalık fallback
```

### Aşama 4 — Gerçek ilan arama servisi

- `GET /api/search?brandSlug=...` gerçek hale getirildi.
- Önce marka kataloğu üzerinden slug doğrulaması yapıldı.
- Yalnız `https://www.arabam.com/ikinci-el/otomobil/{brandSlug}` URL'si oluşturuldu.
- İlk sayfadaki tablo veya kart yapısından şu ham bilgiler çıkarıldı:
  - kolon başlıkları ve sırası;
  - her hücrenin etiketi ve metni;
  - görselin ham `src` değeri;
  - detay linkinin ham relative `href` değeri;
  - satırın ham metni.
- Puppeteer başarısızsa aynı marka URL'si standart HTTP ile denendi.
- İlan sonuçları cache'e, JSON'a veya veritabanına yazılmadı.

### Aşama 5 — Araç detay servisi

- `POST /api/details` gerçek hale getirildi.
- Yalnız `/ilan/` ile başlayan güvenli relative detay yollarına izin verildi.
- Harici URL, `http`, `https`, `//`, `javascript:`, `data:`, `..`, backslash, kontrol
  karakterleri ve tehlikeli encoded yol bileşenleri reddedildi.
- Güvenli yol yalnız sabit `https://www.arabam.com` origin'iyle birleştirildi.
- Teknik alanlar genel `sections`, `fields`, `rawText` ve `images` yapısına çıkarıldı.
- Tablo, `dt/dd`, `data-label` ve property-item türündeki farklı DOM kalıpları desteklendi.
- Telefon, e-posta, satıcı/galeri iletişim blokları ve serbest metin ilan açıklaması çıkarıldı.
- Başarı, hata ve timeout durumlarında Puppeteer tarayıcısının kapatılması güvenceye alındı.
- Puppeteer 403/timeout aldığında aynı doğrulanmış detay URL'si standart HTTP ile denenir.
- Normal sayfadaki Cloudflare Insights betiğinin yanlışlıkla challenge sayılması düzeltildi;
  yalnız gerçek challenge başlıkları/formları reddedilir.
- Detay verisi kalıcı olarak saklanmadı.

### Aşama 6 — Ürün benzeri React kullanıcı akışı

- İlk prototipteki alt alta üç bölüm kaldırıldı.
- Marka kataloğu, ilan sonuçları ve araç detayı ayrı ekranlar haline getirildi.
- Marka araması destekli kart gridi oluşturuldu.
- İlanlar masaüstünde dinamik tablo, dar ekranda kart olarak gösterildi.
- Breadcrumb ve geri dönüş kontrolleri eklendi.
- Detay ekranında teknik alanlar, ham metin ve araç görselleri gösterildi.
- Klavye odağı, form etiketleri, skip-link ve responsive dokunma alanları eklendi.
- Yüklenme, boş sonuç, API bağlantı hatası, Arabam upstream hatası ve eksik veri durumları ayrı
  mesajlarla gösterildi.
- Arabam hücresine karışan `Karşılaştır`, `Favoriye Ekle`, `Gizle` ve `Göster` metinleri yalnız
  arayüz sunumunda temizlendi; API'nin ham ilan yanıtına dokunulmadı.

### Aşama 7 — CollectAPI benzin fiyatı entegrasyonu

- Yalnız şu endpoint kullanıldı:

```text
GET https://api.collectapi.com/gasPrice/turkeyGasoline?district=...&city=...
```

- API anahtarı yalnız sunucudaki `COLLECTAPI_API_KEY` ortam değişkeninden okunur.
- Yetkilendirme başlığı `Authorization: apikey {anahtar}` biçimindedir.
- Anahtar istemci kaynaklarına, API yanıtına veya loglara eklenmez.
- Arabam'dan alınan il/ilçe response içinde orijinal biçimiyle tutulur.
- Yalnız CollectAPI isteği hazırlanırken konum küçük harfli ASCII parametreye dönüştürülüp
  URL-encode edilir: `İstanbul / Kadıköy` → `istanbul / kadikoy`.
- CollectAPI'nin ham JSON yanıtı `fuelPriceResponse` altında değiştirilmeden döndürülür.
- Arayüz `result` içindeki `marka` ve `benzin` alanlarından seçilebilir fiyat seçenekleri üretir.
- CollectAPI hatası araç detayını başarısız yapmaz; araç detayı HTTP 200 ile döner ve
  `fuelPriceResponse` içinde `FUEL_PRICE_UNAVAILABLE` bulunur.
- İl veya ilçe güvenle bulunamazsa CollectAPI çağrısı yapılmaz.

### Aşama 8 — Maliyet hesabı ve son hata düzeltmeleri

- `POST /api/cost-estimate` gerçek hale getirildi.
- Türkçe ondalık virgül ve birim içeren kaynak değerleri yalnız hesap anında yorumlandı.
- Para hesapları `decimal.js` ile yapıldı.
- `Ort. Yakıt Tüketimi` etiket varyasyonu tanındı.
- Hem `4,6 lt` hem `6,4 lt/100 km` biçimi desteklenir.
- Eksik veya güvenle yorumlanamayan değerlerde tahmin üretilmez.
- Geçersiz girdiler `422 CALCULATION_INPUT_INVALID` döndürür.
- Sunucu köküne gidildiğinde görülen `GET / bulunamadı` sorunu giderildi; kök artık servis
  bilgisi döndürür.
- Windows üzerinde geliştirme sunucusunun başlatma komutu uyumlu hale getirildi.

## 4. Backend endpointleri

### Endpoint özeti

| Method | Yol | Amaç | Başarılı durum |
| --- | --- | --- | --- |
| GET | `/` | API servis bilgisi ve endpoint listesi | 200 |
| GET | `/api` | API servis bilgisi ve endpoint listesi | 200 |
| GET | `/api/health` | Sunucu sağlık kontrolü | 200 |
| GET | `/api/brands` | Marka kataloğu | 200 |
| GET | `/api/search?brandSlug=audi` | İzinli markanın ilk sayfa ilanları | 200 |
| POST | `/api/details` | Araç teknik detayı ve benzin fiyatı | 200 |
| POST | `/api/cost-estimate` | Aylık ve depo maliyeti hesabı | 200 |

### `GET /api/health`

Sunucunun yanıt verdiğini doğrular.

```json
{
  "status": "ok",
  "timestamp": "2026-09-02T10:00:00.000Z"
}
```

### `GET /api/brands`

Yanıt alanları:

- `items`: doğrulanmış `{ name, slug }` listesi;
- `source`: `live`, `cache` veya `fallback`;
- `updatedAt`: kataloğun güncellenme zamanı;
- `sourceUrl`: sabit Arabam otomobil kategori URL'si.

`source` anlamları:

- `live`: bu istek sırasında canlı okuma başarıyla tamamlandı;
- `cache`: geçerli bellek sonucu veya son başarılı `brands.json` kullanıldı;
- `fallback`: canlı kaynak ve dosya cache'i kullanılamadı, dahili beş marka kullanıldı.

### `GET /api/search?brandSlug=...`

İşlem sırası:

1. Query Zod ile doğrulanır.
2. Slug biçimi kontrol edilir.
3. Etkin marka kataloğunda slug aranır.
4. Bulunmazsa `400 INVALID_BRAND_SLUG` döner.
5. Bulunursa yalnız ilgili Arabam marka URL'si oluşturulur.
6. Puppeteer, ardından gerekirse standart HTTP adaptörü denenir.
7. HTML tablo/kart parser'ından geçirilir.
8. Ortak response şemasıyla doğrulanıp istemciye döner.

Her ilan şu genişletilebilir ham yapıya sahiptir:

```json
{
  "cells": [{ "label": "Kilometre", "value": "203.000 km" }],
  "imageSrc": "kaynaktaki-ham-src-veya-null",
  "detailHref": "/ilan/kaynaktaki-relative-yol",
  "rawText": "satırdaki ham görünür metin"
}
```

### `POST /api/details`

İstek:

```json
{
  "detailHref": "/ilan/...",
  "city": "Ankara",
  "district": "Keçiören"
}
```

İşlem sırası:

1. JSON ve alanlar ortak Zod sözleşmesiyle doğrulanır.
2. `detailHref` güvenlik kontrolünden geçirilir.
3. Sabit Arabam origin'iyle detay URL'si oluşturulur.
4. Puppeteer detay sayfasını açar.
5. 403, timeout veya tarayıcı hatasında aynı URL için HTTP adaptörü denenir.
6. Gerçek Cloudflare/CAPTCHA challenge tespit edilirse aşılmaya çalışılmaz.
7. Teknik bölümler, alanlar ve görseller çıkarılır.
8. Kişisel iletişim ve satıcı açıklaması kaldırılır.
9. İl ve ilçe varsa CollectAPI `turkeyGasoline` çağrısı yapılır.
10. Detay ile ham yakıt fiyatı yanıtı tek response içinde birleştirilir.

Başarılı response mantığı:

```json
{
  "sourceUrl": "https://www.arabam.com/ilan/...",
  "sections": [
    {
      "title": "",
      "fields": [{ "label": "Ort. Yakıt Tüketimi", "value": "4,6 lt" }],
      "rawText": "ham bölüm metni"
    }
  ],
  "images": ["kaynaktaki-ham-src"],
  "rawText": "filtrelenmiş araç teknik metni",
  "fuelLocation": { "city": "Ankara", "district": "Keçiören" },
  "fuelPriceResponse": {
    "success": true,
    "result": [{ "katkili": 6.91, "benzin": 6.86, "marka": "Petrol Ofisi" }]
  },
  "fetchedAt": "2026-09-02T10:00:00.000Z"
}
```

CollectAPI başarısız olsa bile üst seviye detay response'u 200 olabilir. Bu durumda:

```json
{
  "fuelPriceResponse": {
    "error": {
      "code": "FUEL_PRICE_UNAVAILABLE",
      "message": "...",
      "retryable": true
    }
  }
}
```

### `POST /api/cost-estimate`

İstek:

```json
{
  "monthlyKm": "1200",
  "averageConsumption": "4,6 lt",
  "fuelTankLiters": "58 lt",
  "pricePerLiter": 6.86
}
```

Formüller:

```text
aylık litre = (aylık km / 100) × ortalama tüketim
aylık maliyet = aylık litre × litre fiyatı
depo maliyeti = depo kapasitesi × litre fiyatı
```

Response:

```json
{
  "monthlyCostTry": 378.67,
  "tankCostTry": 397.88,
  "monthlyLiters": 55.2
}
```

Hesap için gerekli alanlardan biri yoksa veya metin güvenle sayıya çevrilemiyorsa 422 döner.
Sunucu tahmin veya varsayılan tüketim/depo değeri üretmez.

## 5. Uçtan uca bilgi akışı

```text
React açılır
  → GET /api/brands
  → BrandCatalog
  → bellek / Arabam canlı / brands.json / fallback
  → marka kartları

Kullanıcı marka seçer
  → GET /api/search?brandSlug=...
  → Zod + katalog allow-list
  → Arabam marka sayfası
  → Puppeteer veya HTTP
  → Cheerio ham ilan parser'ı
  → masaüstü tablo / mobil kart

Kullanıcı ilan seçer
  → ham detailHref + city + district
  → POST /api/details
  → güvenli URL doğrulaması
  → Arabam detay sayfası
  → Puppeteer veya HTTP
  → teknik alan ve görsel parser'ı
  → CollectAPI turkeyGasoline
  → araç detayı + ham yakıt fiyatı

Kullanıcı yakıt markası ve aylık km seçer
  → POST /api/cost-estimate
  → Zod doğrulaması
  → geçici sayısal yorum + Decimal hesabı
  → aylık maliyet + depo maliyeti
```

## 6. Veri saklama ve cache politikası

| Veri | Bellek cache | Dosya | Veritabanı |
| --- | --- | --- | --- |
| Marka kataloğu | Evet, 6 saat | Evet, `brands.json` | Hayır |
| İlan arama sonucu | Hayır | Hayır | Hayır |
| Araç detay sonucu | Hayır | Hayır | Hayır |
| CollectAPI yanıtı | Hayır | Hayır | Hayır |
| Maliyet girdisi/sonucu | Hayır | Hayır | Hayır |

Bu ayrımın amacı marka allow-list'ini kaynak kesintisine dayanıklı tutarken ilan ve kullanıcı
hesap verilerini kalıcılaştırmamaktır.

## 7. Güvenlik ve hata yönetimi

### Uygulanan güvenlik önlemleri

- Bütün HTTP girdileri Zod ile sınırda doğrulanır.
- Arama yalnız canlı/önceden doğrulanmış katalogdaki slug'ları kabul eder.
- Detay servisi arbitrary URL kabul etmez; sabit Arabam origin'i kullanır.
- Redirect kabul etmeyen HTTP adaptörü kullanılır.
- Cloudflare/CAPTCHA aşılmaya çalışılmaz.
- CollectAPI anahtarı yalnız sunucudadır.
- `.env` dosyaları git ignore kapsamındadır; yalnız `.env.example` paylaşılır.
- Sunucunun teknoloji başlığı kapalıdır.
- Kişisel iletişim verileri detay parser'ında çıkarılır.
- Para hesabı kayan nokta yerine decimal aritmetik kullanır.

### Ortak hata biçimi

```json
{
  "error": {
    "code": "HATA_KODU",
    "message": "Kullanıcıya uygun açıklama",
    "retryable": false
  }
}
```

Başlıca durumlar:

| HTTP | Kod | Anlamı |
| --- | --- | --- |
| 400 | `VALIDATION_ERROR` | Genel request şeması geçersiz |
| 400 | `INVALID_BRAND_SLUG` | Slug biçimi veya allow-list kontrolü başarısız |
| 400 | `INVALID_DETAIL_HREF` | Güvensiz detay yolu |
| 400 | `INVALID_JSON` | Bozuk JSON gövdesi |
| 404 | `NOT_FOUND` | Route bulunamadı |
| 422 | `CALCULATION_INPUT_INVALID` | Hesap girdisi eksik/geçersiz |
| 502 | `UPSTREAM_ERROR` | Arabam kaynağı kullanılamadı |
| 500 | `INTERNAL_SERVER_ERROR` | Beklenmeyen iç hata |

`FUEL_PRICE_UNAVAILABLE`, `/api/details` içinde kısmi hata olarak taşınır; araç detayı
korunur.

## 8. Canlı mod ve fixture modu

Varsayılan mod `live` modudur. Arabam ve yapılandırılmışsa CollectAPI gerçek ağ üzerinden
çağrılır.

Fixture modu yalnız şu iki koşul birlikte sağlanınca açılır:

- `DATA_SOURCE_MODE=fixture`
- `NODE_ENV` production değildir.

Fixture modu marka → ilan → detay → yakıt markası → maliyet akışını dış ağa çıkmadan test eder.
Production ortamında gizli fallback olarak devreye girmez.

## 9. Frontend ekranları ve durum yönetimi

### Marka ekranı

- Canlı/cache/fallback kaynak etiketi;
- marka sayısı;
- arama kutusu;
- marka kartları;
- yüklenme, bağlantı hatası ve yeniden deneme.

### İlan sonuç ekranı

- Seçili marka başlığı ve ilan sayısı;
- masaüstü tablo;
- mobil kartlar;
- kaynak kolon sırasının korunması;
- her satırda `İlanı incele` işlemi;
- boş sonuç ve upstream hata durumları.

### Araç detay ekranı

- Araç başlığı ve alınma zamanı;
- teknik alanlar;
- araç görselleri;
- ham teknik metin;
- ilan sonuçlarına dönüş;
- detay yükleme ve upstream hata durumu.

### Yakıt maliyeti kartı

- İl/ilçe bilgisi;
- CollectAPI istasyon/marka seçimi;
- kaynaktaki ortalama tüketim;
- kaynaktaki depo kapasitesi;
- aylık kilometre girişi;
- aylık maliyet, depo maliyeti ve aylık litre sonucu;
- CollectAPI, eksik kaynak alanı ve geçersiz km hata durumları.

## 10. Test ve kalite durumu

Son tam kontrolde:

- Sunucu: 74 test başarılı;
- İstemci: 11 test başarılı;
- Toplam: 85 test başarılı;
- `npm run lint`: başarılı;
- `npm run typecheck`: başarılı;
- `npm test`: başarılı;
- `npm run build`: başarılı;
- `npm run format:check`: başarılı.

Test kapsamı şunları içerir:

- marka HTML parser'ı, slug doğrulama ve yinelenen kayıtlar;
- canlı marka adaptörü, HTTP failover, bellek/dosya/fallback davranışı ve atomik yazma;
- ilan tablo/kart parser'ı ve ham alanların korunması;
- detay URL güvenliği, parser, kişisel alan temizliği ve browser kapanışı;
- gerçek challenge ile normal Cloudflare Insights betiğinin ayrılması;
- CollectAPI endpointi, GET yöntemi, konum parametreleri ve `apikey` başlığı;
- API anahtarının yanıta sızmaması;
- CollectAPI hatasında araç detayının korunması;
- kısa/uzun tüketim biçimleri ve maliyet formülleri;
- React marka → ilan → detay → fiyat → maliyet akışı;
- React yüklenme, boş sonuç ve hata durumları;
- fixture modunun uçtan uca akışı.

Varsayılan testler gerçek Arabam veya CollectAPI isteği göndermez; mock adaptörler ve HTML
fixture dosyaları kullanır.

## 11. Çalıştırma ve yapılandırma

Kurulum:

```bash
npm install
```

Canlı mod için `server/.env`:

```ini
COLLECTAPI_API_KEY=gercek_collectapi_anahtari
DATA_SOURCE_MODE=live
```

Anahtar değerine `apikey` öneki yazılması zorunlu değildir; sunucu ekler.

Geliştirme:

```bash
npm run dev
```

Kalite kontrolleri:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run format:check
```

## 12. Mevcut durum, sınırlamalar ve sonraki adımlar

### Şu anda tamamlanmış olanlar

- Altyapı ve ortak sözleşme;
- canlı marka kataloğu ve dayanıklı fallback;
- canlı ilk sayfa ilan araması;
- canlı araç teknik detayları;
- ayrı ekranlı responsive React akışı;
- CollectAPI `turkeyGasoline` adaptörü;
- güvenli maliyet hesabı;
- fixture modu ve otomatik test paketi.

### Canlı kullanım için eksik yapılandırma

Rapor hazırlanırken ne `server/.env` dosyasında ne de çalışan process environment içinde
`COLLECTAPI_API_KEY` bulunmuştur. Bu nedenle canlı benzin fiyatı isteği henüz gerçek anahtarla
doğrulanmamıştır. Kod, mock entegrasyon testlerinden geçmektedir; canlı doğrulama için anahtar
sunucuya eklenip süreç yeniden başlatılmalıdır.

### Bilinen ürün ve teknik sınırlamalar

- Yalnız ilk ilan sayfası okunur; pagination yoktur.
- İlan ve detay HTML seçicileri Arabam DOM değişikliklerinden etkilenebilir.
- Canlı konum birleşik `İl / İlçe` hücresinden şehir-ilçe sırasına göre ayrılır; kaynak yapısı
  değişirse bu eşleştirme yeniden gözden geçirilmelidir.
- Yalnız `turkeyGasoline` kullanılır. Araç dizel olsa bile mevcut entegrasyon benzin fiyatı
  sunar; yakıt türüne göre endpoint seçimi yapılmaz.
- Bazı ilanlarda ortalama tüketim veya depo kapasitesi bulunmayabilir; sistem tahmin üretmez.
- Kaynakta aynı fotoğrafın farklı boyutları bulunursa ham görsel listesinde tekrar benzeri
  görüntüler görülebilir.
- Rate limiting, kullanıcı hesabı, yetkilendirme ve üretim gözlemlenebilirliği henüz yoktur.
- CollectAPI response'u ham tutulduğu için sağlayıcı sözleşmesi değişirse istemcide fiyat
  seçeneği çıkarımı uyarlanmalıdır.
- Arabam kullanım koşulları ve robot politikası üretim yayını öncesinde ayrıca incelenmelidir.

### Önerilen sonraki adımlar

1. `server/.env` içine gerçek CollectAPI anahtarını ekleyip canlı Ankara/Keçiören benzin
   sorgusunu doğrulamak.
2. Benzin-only ürün kararını netleştirmek; dizel araçlarda uyarı göstermek veya ileride uygun
   endpoint desteği eklemek.
3. Arabam parser'ları için daha fazla gerçek HTML fixture varyasyonu eklemek.
4. İlan pagination ve kullanıcı tarafından seçilebilir sayfa desteğini planlamak.
5. Üretim öncesi rate limit, yapılandırılmış log, health/readiness ve deployment ayarlarını
   eklemek.
6. Görsel galeride küçük/büyük aynı fotoğraf varyasyonlarını kullanıcı deneyimi düzeyinde
   gruplayıp API'deki ham değerleri korumak.

## 13. Son değerlendirme

Proje temel prototip aşamasını geçmiş, işlevsel bir MVP seviyesine ulaşmıştır. Arabam tarafında
marka, ilk sayfa ilan ve araç teknik detay zinciri çalışmaktadır. Frontend bu zinciri ayrı ve
responsive ekranlarla kullanmaktadır. Maliyet motoru kaynak metinlerini güvenli biçimde
yorumlayıp hassas hesap yapmaktadır. CollectAPI entegrasyon kodu ve hata izolasyonu hazırdır;
tam uçtan uca canlı kabul için kalan kritik adım gerçek sunucu anahtarının yapılandırılması ve
canlı `turkeyGasoline` yanıtının doğrulanmasıdır.
