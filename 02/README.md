# Odak Quiz

React ve Vite ile hazırlanmış; kategori seçimi, soru başına süre, cevap takibi, sonuç ekranı ve ayrıntılı cevap özeti içeren bir quiz uygulamasıdır.

## Özellikler

- Harici JSON dosyasından yüklenen 12 örnek soru
- Tümü, JavaScript, React ve Frontend kategori seçenekleri
- Her soru için 30 saniyelik, yeşilden kırmızıya dönen çizgi zaman göstergesi
- Küçük soru/ilerleme göstergeleri ve önceki-sonraki gezinme
- Cevapların sınav boyunca saklanması
- Skor, doğru/yanlış/boş sayıları ve açıklamalı cevap özeti
- Sınavı aynı kategoriyle yeniden başlatma veya ana menüye dönme
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
    StartScreen.jsx    # Ana menü ve kategori seçimi
    TimerLine.jsx      # Süreye bağlı renk değiştiren çizgi gösterge
  data/
    questions.json     # Dışarıdan alınan soru veri seti
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

## Soru ekleme

`src/data/questions.json` dosyasına aşağıdaki yapıda yeni kayıt ekleyin:

```json
{
  "id": 13,
  "category": "React",
  "question": "Soru metni",
  "options": ["A seçeneği", "B seçeneği", "C seçeneği", "D seçeneği"],
  "answer": 0,
  "explanation": "Doğru cevabın kısa açıklaması."
}
```

`answer`, doğru seçeneğin sıfırdan başlayan indeksidir.
