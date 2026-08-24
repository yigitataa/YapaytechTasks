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
    "id": 1,
    "category": "React",
    "question": "Soru metni",
    "options": ["A seçeneği", "B seçeneği", "C seçeneği", "D seçeneği"],
    "answer": 0,
    "explanation": "Doğru cevabın kısa açıklaması."
  }
]
```

Alternatif olarak bu dizi `{ "questions": [...] }` nesnesinin içinde verilebilir. `answer`, doğru seçeneğin sıfırdan başlayan indeksi, seçenek metni veya `A`, `B`, `C`, `D` harflerinden biri olabilir. `category` ve `explanation` alanları isteğe bağlıdır.

Türkçe karşılıklar olarak `soru`, `secenekler`, `dogruCevap`, `kategori` ve `aciklama` alanları da desteklenir.
