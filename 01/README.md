# yatatodo

Siyah, minimal arayüzlü kişisel React görev listesi. Veriler cihazdaki `localStorage` alanında tutulur; backend gerektirmez.

## Özellikler

- Görev ekleme, düzenleme, silme ve tamamlama
- Tümü, devam eden ve tamamlanan filtreleri
- Sayfa yenilemelerinde kalıcı kayıtlar
- Boş ve hatalı giriş doğrulaması
- Öncelik ve isteğe bağlı son tarih
- Düz siyah, mavi-mor sedef detaylı minimal arayüz
- Mobil ve masaüstü uyumlu, klavye erişilebilir arayüz
- Gemini Flash ile günlük görev sıralaması, süre dağılımı ve zaman grafiği

## Gemini planlamasını açma

1. [Google AI Studio](https://aistudio.google.com/app/apikey) üzerinden bir Gemini API anahtarı oluşturun.
2. Uygulamanın sağ üstündeki **API anahtarı** düğmesine basın.
3. Anahtarı alana yapıştırıp **Kaydet** düğmesine basın.
4. Bugüne ait açık görevler varken **Bir planlama oluştur** düğmesini kullanın.

Anahtar kaynak koduna yazılmaz; yalnızca kullandığınız tarayıcının `localStorage` alanında tutulur. Ancak frontend uygulamalarında anahtar tamamen gizlenemez. Üretim kullanımında Google Cloud/AI Studio üzerinden anahtara alan adı ve kota kısıtı ekleyin veya isteği kendi backend'iniz üzerinden gönderin.

Planlayıcı yalnızca Flash modellerini kullanır. Kota/rate-limit yanıtında sırasıyla `gemini-3.7-flash`, `gemini-3.6-flash` ve `gemini-3.5-flash` modellerini dener.
Her model isteği 30 saniye ile sınırlandırılır. Zaman aşımı veya geçici servis hatasında sıradaki Flash modeline geçilir; planlama penceresindeki **İptal et** veya kapatma düğmesi çalışan isteği sonlandırır. Basit planlama akışında gecikmeyi azaltmak için düşünme seviyesi `low` olarak ayarlanmıştır.

## Kurulum

Node.js 20 veya daha yeni bir sürüm gereklidir.

```bash
npm install
npm run dev
```

Vite geliştirme sunucusunun terminalde verdiği adresi tarayıcıda açın.

## Kontroller

```bash
npm run test
npm run lint
npm run build
```

## Teknik yapı

React + TypeScript + Vite kullanılmıştır. Görev state'i saf bir reducer ile yönetilir, kalıcılık ve tema ayrı hook'larda tutulur. Ayrıntılı kararlar [ARCHITECTURE.md](./ARCHITECTURE.md) dosyasındadır.

## Veri ve gizlilik

Görevler yalnızca mevcut tarayıcının yerel depolama alanına yazılır. Başka bir cihaza aktarılmaz ve tarayıcı verileri temizlendiğinde silinir.
