# YataClimate

YataClimate; şehir araması, canlı hava özeti, saatlik görünüm ve 7 günlük tahmin sunan React tabanlı bir hava durumu uygulamasıdır. Arama geçmişi ve favoriler tarayıcıda cihaz bazında saklanır.

## Kullanılan servis

Uygulama iki anahtarsız Open-Meteo servisini kullanır:

- Geocoding API: Şehir adını koordinatlara dönüştürür.
- Forecast API: Anlık hava, saatlik tahmin ve 7 günlük tahmin verilerini sağlar.

API istekleri `app/weather-service.ts` içinde tek noktadan yönetilir. Aynı konum için sonuçlar 10 dakika bellekte tutulur; böylece gereksiz tekrar istekleri azaltılır. API anahtarı veya `.env` dosyası gerekmez.

## Çalıştırma

```bash
npm install
npm run dev
```

Ardından `http://localhost:3000` adresini açın.

Üretim derlemesi:

```bash
npm run build
```

## Test edilebilir senaryolar

- Başarılı arama: `Eskişehir`, `Çanakkale` veya başka bir şehir arayın.
- Yüklenme: Arama gönderildiğinde “Gökyüzü okunuyor” durumu görünür.
- Kullanıcı hatası: Tek harf girerek veya bulunamayacak bir ad yazarak anlaşılır hata mesajını kontrol edin.
- Servis hatası: Tarayıcıyı çevrimdışı moda alıp yeni bir şehir arayın; teknik detay içermeyen hata mesajı gösterilir.
- Şehir detayı: Ana sayfadaki üç şehir kartından birine tıklayın.
- Geçmiş ve favori: Birkaç şehir arayın, geçmişteki boş yıldızlara tıklayın; favorilerin üst bölümde öne çıktığını doğrulayın.
- Kalıcılık: Sayfayı yenileyin; geçmiş ve favorilerin korunduğunu doğrulayın.
- Responsive görünüm: 760 px altındaki genişliklerde şehir kartlarının tek sütuna geçtiğini kontrol edin.

## Tasarım ve erişilebilirlik

Arayüz; Inter ve Plus Jakarta Sans tipografisi, tabular sayılar, OKLCH renk geçişleri, bento kart düzeni ve hava koşuluna göre değişen atmosferik temalar kullanır. `prefers-reduced-motion` ve `prefers-reduced-transparency` tercihleri desteklenir; formlar ve kontroller klavye ile kullanılabilir.

## Veri saklama

Arama geçmişi ve favoriler `localStorage` içinde yalnızca kullanıcının cihazında tutulur. Sunucuya kullanıcı verisi gönderilmez.
