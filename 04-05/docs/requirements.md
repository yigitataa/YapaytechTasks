# Gereksinimler ve Kapsam

## Belgenin amacı

Bu belge, Full-Stack E-Ticaret Uygulaması görevinin ne istediğini ve ne istemediğini açıklar. Gereksinimler uygulama kodundan bağımsız tutulmuştur; seçilecek teknik çözüm bir gereksinimin yerini alamaz.

## Kaynaklar ve öncelik

Kaynaklar aşağıdaki sırayla değerlendirilmiştir:

1. `4-5 Görev - Full-Stack E-Ticaret Uygulaması.pdf` - nihai gereksinim kaynağı.
2. `00-ANA-PLAN-VE-KULLANIM.md` - geliştirme sürecini düzenleyen yardımcı belge.
3. `01-KAPSAM-VE-TEKNIK-KARARLAR.md` - Aşama 1 için yardımcı belge.

Yardımcı belgeler ile PDF arasında zorunlu kapsamı değiştiren bir çelişki bulunmamıştır. Yardımcı belgelerde önerilen Vite, JavaScript, `fetch`, React Context ve klasör yapısı gibi tercihler PDF'de zorunlu değildir; bunlar [karar kaydında](./decisions.md) **öneri** olarak tutulur.

## Proje amacı ve çalışma beklentisi

Kaynak görevin amacı, React frontend ile Node.js/Express backend'in birlikte çalıştığı küçük ölçekli bir e-ticaret uygulaması geliştirmektir. Kullanıcı ürünleri listeleyebilmeli, inceleyebilmeli ve sepete ekleyebilmelidir.

Kaynak yalnızca çalışan sonuç beklemez. Geliştiricinin ihtiyaçları analiz etmesi, uygun yapıyı belirlemesi, gerektiğinde karşılaştığı problemleri araştırması ve teslim ettiği projedeki teknik tercihleri ve kodu açıklayabilmesi de beklenir. Bu beklenti yeni bir kullanıcı özelliği değil, bütün geliştirme sürecine uygulanan çalışma ve değerlendirme ilkesidir.

## Terimler

- **Zorunlu:** Teslim edilecek temel projede bulunması gereken özellik veya nitelik.
- **Bonus:** Temel proje tamamlandıktan sonra isteğe bağlı olarak eklenebilecek özellik.
- **Kabul ölçütü:** Bir gereksinimin tamamlandığını gözlemlenebilir biçimde gösteren koşul.
- **Teknik karar:** Gereksinimin hangi yöntemle karşılanacağını belirleyen geliştirici tercihi.

## Zorunlu gereksinimler

### Uygulama kapsamı ve teknoloji

| Kimlik | Gereksinim | Kısa kabul ölçütü |
|---|---|---|
| REQ-001 | Kullanıcı arayüzü React ile geliştirilmelidir. | Çalışan kullanıcı arayüzü React bileşenlerinden oluşur. |
| REQ-002 | Backend Node.js ve Express ile geliştirilmelidir. | Ürün API'si çalışan bir Node.js/Express sunucusu üzerinden sunulur. |
| REQ-003 | Bu aşamadaki uygulamada veritabanı kullanılmamalıdır. | Proje çalışmak için bir veritabanına, ORM'ye veya veritabanı bağlantısına ihtiyaç duymaz. |

### Ürünler

| Kimlik | Gereksinim | Kısa kabul ölçütü |
|---|---|---|
| REQ-004 | Ürünler listelenebilmelidir. | Backend'den gelen ürünler kullanıcıya bir liste veya kart düzeninde gösterilir. |
| REQ-005 | Ürün detayları görüntülenebilmelidir. | Kullanıcı seçtiği tek ürünün ayrıntı görünümüne ulaşabilir. |
| REQ-006 | Ürünler aranabilmelidir. | Kullanıcı bir arama değeri girdiğinde eşleşen ürünler gösterilir; eşleşmeyenler gizlenir. |
| REQ-007 | Ürünler filtrelenebilmelidir. | Kullanıcı en az bir açıkça belirtilmiş ölçüte göre ürün kümesini daraltabilir. Filtre ölçütü kaynakta belirtilmemiştir. |
| REQ-008 | En az iki farklı sıralama seçeneği bulunmalıdır. | Kullanıcı iki farklı sıralama seçeneğini ayrı ayrı seçebilir ve ürün sırası seçime uygun değişir. Sıralama ölçütleri kaynakta belirtilmemiştir. |

### Sepet

| Kimlik | Gereksinim | Kısa kabul ölçütü |
|---|---|---|
| REQ-009 | Ürün sepete eklenebilmelidir. | Kullanıcı bir ürünü sepete eklediğinde ürün sepet görünümünde yer alır. |
| REQ-010 | Sepetteki ürünler yönetilebilmelidir. | Kullanıcıya sunulan sepet yönetim işlemleri çalışır ve sepet durumu yapılan işlemle uyumlu güncellenir. İşlemlerin tam listesi kaynakta belirtilmemiştir. |
| REQ-011 | Ürün adetleri ve toplam tutar doğru hesaplanmalıdır. | Görünen adetler sepet durumuyla, toplam tutar da ürün fiyatı x adet toplamıyla aynıdır. |
| REQ-012 | Boş sepet durumu ele alınmalıdır. | Sepette ürün yokken bozuk veya anlamsız bir görünüm yerine kullanıcıya açık bir boş sepet mesajı gösterilir. |

### Backend REST API

| Kimlik | Gereksinim | Kısa kabul ölçütü |
|---|---|---|
| REQ-013 | Ürünlerin yönetilebilmesi için bir REST API hazırlanmalıdır. | Ürün işlemleri kaynak odaklı HTTP endpoint'leri üzerinden yapılabilir. |
| REQ-014 | API ürünleri listelemeyi desteklemelidir. | Liste isteği başarılı olduğunda ürün koleksiyonu döner. |
| REQ-015 | API tek bir ürünü getirmeyi desteklemelidir. | Geçerli bir ürün kimliği ile yalnızca ilgili ürün döner. |
| REQ-016 | API ürün oluşturmayı desteklemelidir. | Geçerli ürün verisi gönderildiğinde yeni ürün oluşturulur ve cevapta erişilebilir olur. |
| REQ-017 | API ürün güncellemeyi desteklemelidir. | Geçerli bir ürün kimliği ve değişiklik verisi ile ilgili ürün güncellenir. |
| REQ-018 | API ürün silmeyi desteklemelidir. | Geçerli bir ürün kimliği ile ilgili ürün erişilebilir veri kümesinden kaldırılır. |
| REQ-019 | Hatalı istekler ve bulunamayan kayıtlar uygun biçimde ele alınmalıdır. | API çökmek yerine uygun HTTP durum kodu ve anlaşılır bir hata cevabı verir; olmayan kayıt başarı gibi gösterilmez. |

### Frontend-backend iletişimi ve kullanıcı durumları

| Kimlik | Gereksinim | Kısa kabul ölçütü |
|---|---|---|
| REQ-020 | Frontend ürün verilerini geliştirilen backend üzerinden almalıdır. | Ürün verileri frontend içine ana veri kaynağı olarak kopyalanmaz; çalışan ekranda API isteği ile backend'den alınır. |
| REQ-021 | API iletişimindeki temel yüklenme, hata ve boş sonuç durumları kullanıcı deneyimini bozmayacak biçimde ele alınmalıdır. | İstek sürerken yüklenme, istek başarısızken hata ve sonuç yokken boş durum geri bildirimi görülür; ekran kullanılamaz hâlde kalmaz. |

### Teslim kriterleri

| Kimlik | Gereksinim | Kısa kabul ölçütü |
|---|---|---|
| REQ-022 | Frontend ve backend çalışır durumda teslim edilmelidir. | Belgelendirilmiş adımlarla iki uygulama başlatılabilir ve temel ürün akışı uçtan uca çalışır. |
| REQ-023 | README bulunmalıdır. | README kurulum, çalıştırma ve temel kullanım bilgilerini başlangıç seviyesindeki birinin izleyebileceği şekilde açıklar. |
| REQ-024 | API kullanımı dokümante edilmelidir. | Endpoint, metot, gerekli veri, örnek istek/cevap ve temel hata durumları belgelenir. |
| REQ-025 | Uygulama responsive olarak kullanılabilmelidir. | Temel ürün ve sepet akışları dar ve geniş ekranlarda yatay taşma veya erişilemeyen temel kontroller olmadan kullanılabilir. |
| REQ-026 | Anlamlı bir Git commit geçmişi bulunmalıdır. | Commit'ler geliştirme adımlarını anlaşılır, küçük ve açıklayıcı mesajlarla gösterir. |

Toplam **26 izlenebilir zorunlu madde** vardır. Bu sayı, PDF'deki bazı toplu maddelerin (örneğin beş API işlemi ve beş teslim kriteri) ayrı ayrı izlenmesiyle elde edilmiştir; yeni kapsam eklenmemiştir.

## Değerlendirme ölçütleri

PDF, kod incelemesinde aşağıdaki niteliklerin özellikle değerlendirileceğini belirtir. Bunlar yeni kullanıcı özellikleri değildir; zorunlu çözümün kalitesini değerlendiren ölçütlerdir.

| Kimlik | Değerlendirilecek konu | Beklenen anlam |
|---|---|---|
| QLT-001 | Proje organizasyonu | Dosya ve klasör sorumlulukları anlaşılırdır. |
| QLT-002 | Kod okunabilirliği | İsimler, akış ve biçimlendirme kodun açıklanmasını kolaylaştırır. |
| QLT-003 | Component yapısı | React bileşenleri anlaşılır sorumluluklara ayrılır. |
| QLT-004 | Frontend-backend ayrımı | UI ve sunucu sorumlulukları birbirine karıştırılmaz. |
| QLT-005 | REST API tasarımı | Endpoint'ler kaynak ve işlem anlamını tutarlı yansıtır. |
| QLT-006 | HTTP metotları ve durum kodları | İşleme uygun metotlar ve başarı/hata kodları kullanılır. |
| QLT-007 | State yönetimi | UI ve sepet durumu öngörülebilir biçimde güncellenir. |
| QLT-008 | Hata senaryoları | Beklenen hata yolları kontrollü ve kullanıcıya anlaşılırdır. |
| QLT-009 | Tekrarlanan kodların yönetimi | Gereksiz tekrar uygun ortak yapılara ayrılır. |
| QLT-010 | Kullanıcı deneyimi | Temel akışlar ve geri bildirimler açık ve kullanılabilirdir. |

## Bonus hedefler

Bu maddeler **zorunlu değildir**. Temel gereksinimler tamamlanmadan bonus geliştirmesine başlanmamalıdır.

| Kimlik | Bonus hedef | Temel kapsamla ilişkisi |
|---|---|---|
| BON-001 | Favoriler | Ayrı bir kullanıcı tercihi durumu ekler. |
| BON-002 | Fiyat aralığı filtresi | REQ-007 için özel ve daha gelişmiş bir filtre türüdür; zorunlu filtre mutlaka fiyat aralığı olmak zorunda değildir. |
| BON-003 | Sayfalama | Büyük ürün listelerini sayfalara ayırır. |
| BON-004 | Sepet bilgisinin sayfa yenilendiğinde korunması | Zorunlu sepetin kalıcı olmasını sağlar; temel kapsam yenileme sonrası kalıcılık istemez. |
| BON-005 | Basit loglama | Sunucu işlemleri için ek gözlemlenebilirlik sağlar. |
| BON-006 | Ürün yönetimi için ek bir arayüz | Zorunlu backend CRUD işlemlerini kullanan ayrı bir yönetim UI'si ekler. |

**Uygulama durumu:** `BON-001` - `BON-006` bonuslarının tamamı, zorunlu proje tamamlandıktan sonra Aşama 11'de uygulanmıştır. Bunlar kaynak görevin zorunlu maddeleri değildir ve zorunlu gereksinimlerin kapsamını değiştirmez.

## Geliştiriciye bırakılan teknik kararlar

PDF aşağıdaki alanları bilinçli olarak belirlememiştir. Bunların her biri açıklanabilir bir geliştirici kararı olmalıdır:

- Veri yapıları ve ürün alanları.
- Proje mimarisi ve klasör yapısı.
- React component organizasyonu.
- Endpoint yolları, istek/cevap biçimleri ve güncelleme metodu.
- State yönetimi yaklaşımı.
- Validasyon yaklaşımı.
- Arama, zorunlu filtrenin ölçütü ve iki sıralama seçeneğinin ne olacağı.
- Sepeti “yönetme” kapsamındaki kullanıcı işlemleri.
- Veritabanı olmadan ürünlerin hangi geçici yapıda tutulacağı.
- CSS yaklaşımı, responsive eşikleri ve görsel tasarım.
- Otomatik test araçları ve kapsamı.

Başlangıç önerileri ve gerekçeleri [decisions.md](./decisions.md) içinde kaydedilmiştir. Bu tercihler kaynak gereksinimi değildir.

## Kaynakta zorunlu olmayan veya kapsam dışı konular

Aşağıdakiler PDF'de zorunlu istenmemiştir; Aşama 1 bunları gereksinime dönüştürmez:

- Kullanıcı hesabı, authentication, authorization veya yönetici rolü.
- Ödeme, ödeme sağlayıcısı, checkout veya sipariş yönetimi.
- Veritabanı, ORM ya da süreçler arası kalıcı ürün deposu. Veritabanı bu görev aşamasında açıkça kullanılmayacaktır.
- Stok/envanter, kargo, vergi, kupon veya kampanya yönetimi.
- TypeScript, Redux, Tailwind CSS, Axios ya da belirli başka bir kütüphane.
- Belirli bir ürün veri şeması, para birimi veya tasarım sistemi.
- Deployment, alan adı, bulut servisi ya da CI/CD.
- Otomatik test zorunluluğu veya test kapsam yüzdesi.
- Kimlik doğrulamalı veya yetkilendirmeli gerçek yönetici paneli. Uygulanan `BON-006` ekranı yalnız eğitim/demo amaçlıdır.
- Favoriler, fiyat aralığı filtresi, sayfalama, yenileme sonrası sepet kalıcılığı ve loglama; bunlar bonus hedeflerdir.

## Açık noktalar

Kaynakta özellikle geliştiriciye bırakıldığı için aşağıdaki konular belirsizdir fakat Aşama 1'i engellemez:

- Filtrenin hangi ürün alanına göre yapılacağı.
- İki sıralama seçeneğinin ölçütleri.
- Ürün veri modelindeki zorunlu ve isteğe bağlı alanlar.
- “Sepetteki ürünleri yönetme” ifadesinin kapsayacağı tam işlem listesi.
- Ürün verisinin sunucu yeniden başlatılınca sıfırlanıp sıfırlanmayacağı.
- Arama, filtre ve sıralamanın frontend'de mi backend'de mi yapılacağı.
- API endpoint adları, cevap zarfı, validasyon kuralları ve kesin HTTP durum kodları.
- Responsive breakpoint değerleri ve desteklenecek kesin ekran genişlikleri.
- Otomatik test aracı ve hedeflenen test kapsamı.

Bu noktalar için güvenli başlangıç tercihleri karar kaydında **Öneri** olarak yer alır; uygulama başlamadan önce gerektiğinde güncellenebilir.

## Kaynak izlenebilirliği

Uygulama, test ve doküman kanıtları [ayrı izlenebilirlik tablosunda](./traceability.md) tutulur.

| PDF bölümü | Bu belgedeki karşılığı |
|---|---|
| Görev Tanımı | REQ-001 - REQ-003 |
| Beklenen Özellikler - Ürünler | REQ-004 - REQ-008 |
| Beklenen Özellikler - Sepet | REQ-009 - REQ-012 |
| Beklenen Özellikler - Backend | REQ-013 - REQ-019 |
| Frontend - Backend | REQ-020 - REQ-021 |
| Teslim Kriterleri | REQ-022 - REQ-026 |
| Bonus Hedefler | BON-001 - BON-006 |
| Değerlendirme | QLT-001 - QLT-010 |
| Önemli | Geliştiriciye bırakılan teknik kararlar |
