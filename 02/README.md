# YataQuizing

React ve Vite ile hazırlanmış; kullanıcının yüklediği JSON dosyasındaki sorularla çalışan, soru başına süre, cevap takibi, sonuç ekranı ve ayrıntılı cevap özeti içeren bir quiz uygulamasıdır.

## Özellikler

- Dosya seçimi veya sürükle-bırak ile JSON yükleme
- Uygulama içinde yerleşik soru verisi bulunmayan dinamik sınav akışı
- Türkçe ve İngilizce alan adlarını kabul eden JSON doğrulaması
- Her soru için 30 saniyelik, yeşilden kırmızıya dönen çizgi zaman göstergesi
- Küçük soru/ilerleme göstergeleri ve önceki-sonraki gezinme
- Cevapların sınav boyunca saklanması
- Skor, doğru/yanlış/boş sayıları ve açıklamalı cevap özeti
- Sınavı aynı JSON verisiyle yeniden başlatma veya yükleme ekranına dönme
- Mobil ve masaüstü ekranlara uyumlu arayüz
- Klavye odağı, semantik roller ve azaltılmış hareket tercihi desteği

## Kurulum

Node.js 20.19+ veya 22.12+ gereklidir.

```bash
npm install
npm run dev
```

Tarayıcıda terminalde gösterilen yerel adresi açın.

## Üretim derlemesi

```bash
npm run build
npm run preview
```

## Proje yapısı

```text
src/
  components/
    EdgeAmbience.jsx   # Referans HTML'deki 8 noktalı kenar animasyonu
    QuestionScreen.jsx # Soru, seçenekler ve gezinme
    ResultScreen.jsx   # Skor ve cevap özeti
    StartScreen.jsx    # JSON seçme ve sürükle-bırak ekranı
    TimerLine.jsx      # Süreye bağlı renk değiştiren çizgi gösterge
  App.jsx              # Başlangıç, sınav ve sonuç durumlarının yönetimi
  main.jsx             # React giriş noktası ve font yüklemeleri
  styles.css           # Görsel sistem ve responsive düzen
```

## Fontlar

Uygulama, verilen font listesindeki aileleri yerel npm paketleri üzerinden kullanır:

- Inter: genel arayüz metinleri
- Plus Jakarta Sans: başlıklar ve ana eylemler
- Geist Sans: arayüz etiketleri
- Manrope: açıklamalar ve uzun okuma metinleri
- JetBrains Mono: süre, soru numarası ve sayısal veriler

## JSON biçimi

Dosyanın kökünde doğrudan bir soru dizisi bulunabilir:

```json
[
  {
    "question": "A pita is a type of what?",
    "A": "fresh fruit",
    "B": "flat bread",
    "C": "French tart",
    "D": "fried bean dip",
    "answer": "B"
  }
]
```

`A`, `B`, `C`, `D` alanları seçenekleri; `answer` ise doğru seçeneğin harfini belirtir. Daha fazla seçenek gerektiğinde `E`, `F` gibi devam eden büyük harf alanları da kullanılabilir.

Alternatif olarak seçenekler `options` dizisiyle verilebilir ve soru dizisi `{ "questions": [...] }` nesnesinin içine alınabilir. Bu biçimde `answer`, doğru seçeneğin sıfırdan başlayan indeksi, seçenek metni veya seçenek harfi olabilir. `category` ve `explanation` alanları isteğe bağlıdır.

Türkçe karşılıklar olarak `soru`, `secenekler`, `dogruCevap`, `kategori` ve `aciklama` alanları da desteklenir.
