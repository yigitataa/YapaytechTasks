# YataQuizing

React ve Vite ile hazırlanmış; hazır quiz kütüphanesi veya kullanıcının yüklediği JSON dosyalarıyla çalışan, soru başına süre, kalıcı oturum, cevap takibi, sonuç ekranı ve ayrıntılı cevap özeti içeren bir quiz uygulamasıdır.

## Özellikler

- Ana ekrandan seçilebilen 39 hazır quiz
- Dosya seçimi veya sürükle-bırak ile harici JSON yükleme
- Yüklenen quizleri aynı tarayıcıda saklama ve kütüphanede yeniden gösterme
- Türkçe ve İngilizce alan adlarını kabul eden JSON doğrulaması
- Sayfa yenilense bile seçili quiz, bulunulan soru, cevaplar ve kalan süreyle devam etme
- Her soru için 30 saniyelik, ileri-geri gezinmeyle sıfırlanamayan süre
- Süre azaldıkça yeşilden kırmızıya dönen çizgi zaman göstergesi
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
    StartScreen.jsx    # Hazır quiz kütüphanesi ve JSON yükleme ekranı
    TimerLine.jsx      # Süreye bağlı renk değiştiren çizgi gösterge
  App.jsx              # Quiz kataloğu, kalıcı oturum, süre ve ekran yönetimi
  main.jsx             # React giriş noktası ve font yüklemeleri
  styles.css           # Görsel sistem ve responsive düzen
questions/
  quiz_01.json ...     # Arayüzde sunulan yerleşik quizler
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

### Quiz dosyalarının dağılımı

Bu projede kullanılan quiz dosyaları belirli sayıda soru içerecek şekilde bölünmüştür.

- `quiz_01.json` ile `quiz_05.json` arasındaki ilk 5 dosyanın her biri **9 soru** içerir.
- `quiz_06.json` dosyasından itibaren dosyalar **15'er soru** içerecek şekilde düzenlenmiştir.
- Son dosyada, toplam soru sayısına bağlı olarak 15'ten daha az soru bulunabilir.

Soruların `question`, `A`, `B`, `C`, `D` ve `answer` yapısı korunmuştur. Soru ve seçenek metinleri Türkçeye çevrilmiş, doğru cevabı belirten `answer` alanı değiştirilmemiştir.
