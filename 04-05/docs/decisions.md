# Teknik Karar Kaydı

## Kullanım

Bu belge, gereksinimlerin **nasıl** karşılandığına ilişkin kararları kaydeder. Kaynak PDF teknik ayrıntıların geliştirici tarafından seçilmesini ister. “Öneri” durumundaki kayıtlar henüz uygulanmamıştır; “Kabul edildi” durumundaki kayıtlar ilgili aşamada uygulanıp doğrulanmıştır.

Her kayıtta:

- **Karar:** Önerilen yaklaşım.
- **Neden:** Bu yaklaşımın seçilme gerekçesi.
- **Alternatif:** Değerlendirilebilecek başka yaklaşım.
- **Sonuç/Sınırlama:** Tercihin getirdiği davranış veya sınır.

Kaynak gereksinimleri [requirements.md](./requirements.md) içinde tutulur; bir öneri kaynak gereksinimi gibi yorumlanmamalıdır.

## Sabit kaynak kısıtları

- Frontend React olacaktır.
- Backend Node.js ve Express olacaktır.
- Veritabanı kullanılmayacaktır.
- Bonuslar temel teslim için zorunlu değildir.

## ADR-001 - Proje klasörlerinin ayrılması

- **Durum:** Kabul edildi (Aşama 2)
- **Karar:** Çalışma klasörü içinde `frontend/`, `backend/` ve `docs/` klasörleri kullanılacak.
- **Neden:** Frontend-backend ayrımını görünür kılar ve başlangıç seviyesindeki bir geliştiricinin sorumlulukları takip etmesini kolaylaştırır.
- **Alternatif:** İki ayrı repository veya tek kökte karışık kaynak dosyaları.
- **Sonuç/Sınırlama:** Ortak kod kendiliğinden paylaşılmaz; her uygulamanın bağımlılıkları ve çalıştırma komutları ayrı olur.

## ADR-002 - Paket yönetimi

- **Durum:** Kabul edildi (Aşama 2)
- **Karar:** Frontend ve backend için ayrı `package.json` dosyaları ve npm kullanılacak.
- **Neden:** npm, Node.js ile birlikte gelir; ayrı dosyalar iki uygulamanın bağımlılık sınırını açık tutar.
- **Alternatif:** pnpm/yarn veya kök workspace yapısı.
- **Sonuç/Sınırlama:** Kurulum ve çalıştırma iki klasörde ayrı komutlar gerektirir; bu komutlar README'de açıkça yazılmalıdır.

## ADR-003 - Frontend başlangıç aracı ve dil

- **Durum:** Kabul edildi (Aşama 2)
- **Karar:** React uygulaması Vite ve JavaScript ile kurulacak.
- **Neden:** Vite küçük bir React uygulaması için hızlı ve az yapılandırmalı; JavaScript ise kaynakta TypeScript zorunluluğu olmadığı için başlangıç kapsamını sade tutar.
- **Alternatif:** Başka bir React build aracı veya TypeScript.
- **Sonuç/Sınırlama:** TypeScript'in derleme zamanı tip kontrolleri bulunmaz; veri şekilleri isimlendirme, validasyon ve testlerle anlaşılır tutulmalıdır.

## ADR-004 - Backend yapısı ve dil

- **Durum:** Kabul edildi (Aşama 3)
- **Karar:** Backend Express ve JavaScript ile; route, controller/service, validation/middleware ve data sorumlulukları ayrılarak kurulacak.
- **Neden:** Kaynak Express'i zorunlu kılar; küçük sorumluluk ayrımı REST tasarımını ve hata yollarını okunabilir tutar.
- **Alternatif:** Bütün sunucu mantığını tek dosyada tutmak veya TypeScript kullanmak.
- **Sonuç/Sınırlama:** Aşama 3'te `routes`, `controllers`, `services`, `data` ve `middleware`; Aşama 4'te `validators` ve küçük bir `errors` klasörü eklenmiştir. HTTP cevabı controller/middleware katmanında, veri değişikliği service katmanında kalır.

## ADR-005 - Veritabanı olmadan ürün verisi

- **Durum:** Kabul edildi (Aşama 3)
- **Karar:** Başlangıç ürünleri backend içindeki bir JavaScript dizisinde tutulacak ve CRUD işlemleri çalışan süreçte bu diziyi değiştirecek.
- **Neden:** PDF veritabanını yasaklar; bellek içi dizi beş CRUD işlemini en az ek teknolojiyle göstermeye yeterlidir.
- **Alternatif:** Bir JSON dosyasını çalışma zamanında okuyup yazmak.
- **Sonuç/Sınırlama:** Aşama 3 yalnızca bu diziyi okur. Sonraki aşamada eklenebilecek oluşturma, güncelleme ve silme değişiklikleri sunucu yeniden başladığında başlangıç verisine dönecektir. Kalıcı veri sözü verilmez.

## ADR-006 - Başlangıç ürün modeli

- **Durum:** Kabul edildi (Aşama 3)
- **Karar:** Ürün için benzersiz `id`, `name`, `description`, pozitif `price`, `category` ve metin `imageUrl` alanları kullanılacak. Başlangıç kimlikleri `p-001` biçimindedir; yeni ürün oluşturma eklendiğinde kimlik backend tarafından üretilecektir.
- **Neden:** Bu alanlar liste, detay, arama, kategori filtresi, fiyat sıralaması ve sepet toplamını destekleyen küçük bir model oluşturur.
- **Alternatif:** Marka, stok, puan veya çoklu görsel gibi daha geniş bir model.
- **Sonuç/Sınırlama:** Kaynak bu alanları zorunlu kılmaz. Oluşturmada `name`, `price` ve `category` zorunlu; `description` ile `imageUrl` isteğe bağlıdır ve gönderilmezse boş metin olarak saklanır. Aşama 3 veri kümesi 10 ürün ve 6 kategori içerir; stok/envanter davranışı eklenmez. Görseller harici placeholder URL'lerine bağlıdır ve frontend daha sonra yükleme hatasına karşı kendi placeholder'ını göstermelidir.

## ADR-007 - REST endpoint tasarımı

- **Durum:** Kabul edildi (Aşama 4)
- **Karar:** API tabanı `/api/products` olacak: `GET /api/products`, `GET /api/products/:id`, `POST /api/products`, `PATCH /api/products/:id` ve `DELETE /api/products/:id` kullanılacak.
- **Neden:** Kaynak odaklı yollar ile listeleme, tek kayıt ve CRUD işlemleri doğrudan eşleşir. `PATCH`, yalnızca gönderilen alanları güncelleyerek küçük arayüzler için daha kolay bir sözleşme sağlar.
- **Alternatif:** Tam kayıt değişimi için `PUT` veya hem `PUT` hem `PATCH` desteği.
- **Sonuç/Sınırlama:** Beş işlem Aşama 4'te çalışır. Tam değiştirme semantiğine sahip `PUT` eklenmemiştir; desteklenmeyen bu istek ortak JSON `404` cevabına gider.

## ADR-008 - Validasyon ve hata cevapları

- **Durum:** Kabul edildi (Aşama 4)
- **Karar:** İstek verisi backend sınırında doğrulanacak; hata cevapları tutarlı JSON biçiminde en az `message` alanı içerecek. Bulunamayan ürün için `404`, geçersiz veri için `400`, oluşturma için `201`, başarılı silme için `204` önerilir.
- **Neden:** Hatalı isteklerin kontrollü ele alınmasını ve frontend'in hata mesajlarını tek biçimde işlemesini sağlar.
- **Alternatif:** Harici bir şema validasyon kütüphanesi veya her route içinde ayrı kontroller.
- **Sonuç/Sınırlama:** Validasyon hataları `400` ve alan bazlı `details`; bulunamayan ürün/route `404`; beklenmeyen hata iç ayrıntı vermeyen `500` döndürür. Oluşturma `201`, PATCH `200`, silme gövdesiz `204` kullanır. Geçersiz JSON ayrıca kontrollü `400` olur.

## ADR-009 - Frontend HTTP istemcisi

- **Durum:** Kabul edildi (Aşama 5)
- **Karar:** Frontend-backend iletişiminde tarayıcının yerleşik `fetch` API'si kullanılacak ve ortak istek/hata davranışı küçük bir API modülünde toplanacak.
- **Neden:** Zorunlu akışlar için ek bağımlılık gerekmez; ortak modül tekrarlanan hata kontrolünü azaltır.
- **Alternatif:** Axios veya her component içinde doğrudan `fetch` çağrısı.
- **Sonuç/Sınırlama:** `frontend/src/api/productsApi.js`, `response.ok` ve JSON biçimini açıkça kontrol eder; HTTP durumu ile kullanıcıya güvenli mesajı `ApiError` içinde taşır. Ağ hatası ile istek iptali birbirinden ayrılır.

## ADR-010 - Sepet state yönetimi

- **Durum:** Kabul edildi ve kalıcılıkla genişletildi (Aşama 11A)
- **Karar:** Sepet React Context ve `useReducer` ile yönetilir.
- **Neden:** Sepete ekleme, adet değiştirme, kaldırma ve temizleme gibi ilişkili geçişleri tek yerde toplar; harici state kütüphanesi gerektirmez.
- **Alternatif:** Üst componentte `useState`, prop aktarımı veya Redux benzeri bir kütüphane.
- **Sonuç/Sınırlama:** Çalışan sepet state'i yine Context/reducer içindedir. İsteğe bağlı BON-004 kapsamında başlangıç state'i `localStorage` üzerinden yüklenir ve değişiklikler reducer dışında kaydedilir; reducer saf kalır.

## ADR-011 - Sepet yönetimi davranışları

- **Durum:** Kabul edildi (Aşama 7)
- **Karar:** Ürün hem katalog kartından hem detay sayfasından sepete eklenebilir. Aynı ürün yeniden eklendiğinde yeni satır açılmaz, mevcut adet artar. Sepette adet artırılır veya azaltılır; adet `1` iken azaltma kontrolü kaldırma kontrolüne dönüşür. Ayrıca doğrudan ürün kaldırma ve tüm sepeti temizleme eylemleri bulunur.
- **Neden:** Kaynaktaki “sepetteki ürünler yönetilebilmelidir” ifadesini kullanıcı açısından gözlemlenebilir ve test edilebilir hâle getirir.
- **Alternatif:** Yalnızca kaldırma veya doğrudan adet girişi.
- **Sonuç/Sınırlama:** Adet hiçbir zaman sıfır veya negatif olarak gösterilmez; son adet kaldırılınca satır sepetten çıkar. Aşama 11A'dan itibaren bu state aynı origin'in `localStorage` alanına da yazılır. Ayrıntılı etkileşimler kaynakta tek tek sayılmış değildir; sepet yönetimi gereksinimini somutlaştıran uygulama kararıdır. Stok kontrolü kapsam dışıdır.

## ADR-012 - Arama, filtre ve sıralamanın yeri

- **Durum:** Kabul edildi ve uygulandı (Aşama 6)
- **Karar:** Backend'den alınan ham ürün kümesi frontend'de `arama → kategori filtresi → sıralama` sırasıyla işlenecek. Kullanıcının Aşama 6 isteğine uygun olarak arama yalnız `name` alanında, Türkçe karakterleri ve büyük/küçük harfi normalleştirerek yapılır. Filtre seçenekleri API verisindeki benzersiz `category` değerlerinden üretilir. Zorunlu iki sıralama fiyat artan ve fiyat azalandır; “Önerilen sıra” API sırasını koruyan başlangıç seçeneğidir. Gösterilen ürünler `useMemo` ile ham ürünler ve kontrol state'lerinden türetilir; sıralamadan önce dizi kopyalanır.
- **Neden:** 10 ürünlük bellek içi katalogda yeni backend sorgu sözleşmesi gerekmeden üç zorunlu davranışı birlikte ve okunabilir biçimde sağlar. Ham API dizisi tek source of truth kalır, türetilmiş sonuç ayrıca state'e kopyalanmaz ve JavaScript `sort` mutasyonu kaynak sıraya sızmaz. Kategori filtresi seçilerek bonus fiyat aralığı temel kapsama karıştırılmaz.
- **Alternatif:** Arama, filtre ve sıralama query parametreleriyle backend'de yapmak.
- **Sonuç/Sınırlama:** Çok büyük veya sayfalanmış veri kümeleri için verimli değildir; sunucu tarafı sorgulama seçilirse bu karar gözden geçirilmelidir. Liste sayfasından ayrılıp geri dönüldüğünde component yeniden kurulduğu için kontrol seçimleri başlangıç değerlerine döner; URL veya kalıcı state kullanımı bu aşamada eklenmemiştir.

## ADR-013 - Stil ve responsive yaklaşım

- **Durum:** Kabul edildi ve uygulandı (Aşama 5)
- **Karar:** Tek ve tutarlı bir düz CSS yaklaşımı kullanılacak; düzen önce küçük ekranlarda kullanılabilir olacak, sonra içerik tabanlı breakpoint'lerle genişletilecek.
- **Neden:** Kaynak belirli bir CSS kütüphanesi istemez. Düz CSS başlangıç seviyesinde ek soyutlama olmadan responsive davranışı görünür kılar.
- **Alternatif:** CSS Modules, Tailwind veya bir component kütüphanesi.
- **Sonuç/Sınırlama:** Ürün grid'i 320 px'de iki, 600 px'den sonra üç, 960 px'den sonra dört sütundur. Detay 800 px altında dikey, üstünde iki sütundur. 320 px görünümde yatay taşma olmadığı doğrulanmıştır.

## ADR-014 - Test yaklaşımı

- **Durum:** Kabul edildi (Aşama 2)
- **Karar:** Her aşamada [manuel test kontrol listesi](./manual-test-checklist.md) güncellenecek; kritik hesaplama ve API davranışları oluştuğunda küçük, hedefli otomatik testler değerlendirilecek.
- **Neden:** PDF çalışan davranışı ve kaliteyi değerlendirir ancak belirli bir otomatik test aracı veya kapsam yüzdesi zorunlu kılmaz.
- **Alternatif:** Baştan geniş bir uçtan uca test paketi kurmak veya yalnızca manuel test yapmak.
- **Sonuç/Sınırlama:** Otomatik testler kaynak zorunluluğu gibi sunulmaz. Araç ve kapsam, uygulama yapısı görüldükten sonra Aşama 9'daki ADR-016 ile kesinleştirilmiştir.

## ADR-015 - UI durumları ve temel erişilebilirlik

- **Durum:** Uygulandı; manuel kontrol bekliyor (Aşama 8)
- **Karar:** Liste ve detay sayfaları `loading`, `error`, `empty`/`not-found` ve `success` durumlarını açık state değerleriyle ayırır. Ağ ve API ayrıntıları kullanıcıya aktarılmaz; ortak `ErrorState` güvenli Türkçe mesaj ve yeni istek başlatan **Yeniden dene** eylemi gösterir. Skeleton, fallback, skip link, görünür focus, `aria-current`, `role="status"`/`role="alert"`, `aria-live` ve kontrol grubu etiketleri düz CSS ve semantik HTML ile uygulanır.
- **Neden:** Kullanıcı her anda ne olduğunu ve sonraki eylemini anlayabilmeli; klavye ve ekran okuyucu kullanıcıları da aynı temel akışlara ulaşabilmelidir. Mevcut küçük projede yeni UI veya erişilebilirlik kütüphanesi eklemek gereksizdir.
- **Alternatif:** Tek bir genel spinner/hata görünümü kullanmak veya kapsamlı bir component/UI kütüphanesi eklemek.
- **Sonuç/Sınırlama:** Durumlar birbirinden ayrılır ve teknik hata metinleri sızmaz. Bu çalışma tam WCAG sertifikası veya otomatik erişilebilirlik denetimi değildir. Kullanıcının kararıyla lint, build ve viewport testleri Codex tarafından çalıştırılmadığı için son uygunluk manuel kontrollere bağlıdır.

## ADR-016 - Minimal otomatik test altyapısı

- **Durum:** Kabul edildi ve uygulandı (Aşama 9)
- **Karar:** Frontend ve backend için Node.js'in yerleşik `node:test` çalıştırıcısı kullanılacak. Backend testleri Express uygulamasını rastgele boş bir portta başlatıp yerleşik `fetch` ile gerçek HTTP istekleri gönderecek; her testten önce bellek ürünleri başlangıç kopyasından sıfırlanacak. Frontend'de arama/filtre/sıralama ile sepet reducer ve selector gibi saf JavaScript mantıkları doğrudan test edilecek. JSX componentleri için bu aşamada ayrı DOM test kütüphanesi yerine lint ve production build derleme smoke kontrolü kullanılacak.
- **Neden:** Projenin mevcut test altyapısı yoktu. Yerleşik çalıştırıcı yeni bağımlılık, ikinci framework veya E2E kurulumu gerektirmeden kritik davranışları tek komutla ve başlangıç seviyesinde okunabilir biçimde güvenceye alır.
- **Alternatif:** Backend için Vitest + Supertest; frontend için Vitest + React Testing Library; tam tarayıcı E2E aracı. Bu seçenekler component etkileşimleri ve daha büyük test yardımcıları çoğaldığında daha güçlüdür, ancak mevcut küçük proje için ek paket ve yapılandırma maliyeti getirir.
- **Sonuç/Sınırlama:** Backend CRUD/hata akışı gerçek HTTP sınırından, frontend'in kritik saf mantıkları birim düzeyinde test edilir. Production build bütün JSX import ve derleme zincirini kontrol eder fakat görünür metin, focus, responsive düzen veya gerçek tarayıcı etkileşimini kanıtlamaz; bunlar kullanıcı manuel testidir. Coverage yüzdesi ve E2E altyapısı eklenmemiştir.

## ADR-017 - Teslim kanıtlarının sınıflandırılması

- **Durum:** Kabul edildi ve uygulandı (Aşama 10)
- **Karar:** Teslim denetimi üç kanıt türünü ayrı gösterecek: otomatik test/build/lint sonucu, salt okunur kod-doküman incelemesi ve kullanıcı manuel doğrulaması. Gereksinimlerin karşılıkları `traceability.md`, test sınırları `test-strategy.md` içinde tutulacak.
- **Neden:** Derlemenin geçmesi responsive görünümün veya gerçek kullanıcı akışının çalıştığını tek başına kanıtlamaz. Kanıt türlerini ayırmak, yapılmayan manuel testleri yapılmış gibi göstermeden teslim durumunu açıklanabilir kılar.
- **Alternatif:** Bütün kontrolleri tek bir “geçti” listesinde toplamak veya tam E2E altyapısı kurmak.
- **Sonuç/Sınırlama:** Otomatik olarak doğrulanan maddeler doğrudan kanıtlanır; responsive, klavye ve tarayıcı akışları kullanıcı sonucu gelene kadar “Manuel doğrulama gerekli” kalır. Bu aşamada yeni E2E bağımlılığı eklenmez.

## ADR-018 - Sepetin `localStorage` ile kalıcılığı

- **Durum:** Kabul edildi ve uygulandı (Aşama 11A, bonus `BON-004`)
- **Karar:** Storage okuma, doğrulama ve yazma işlemleri ayrı `cartStorage.js` modülünde tutulacak. `CartProvider`, `useReducer` için lazy initializer ile başlangıç sepetini bir kez yükleyecek ve state değiştiğinde `useEffect` ile güvenli kopyayı kaydedecek. `cartReducer` storage erişimi yapmayacak.
- **Neden:** Reducer'ın aynı state ve action için yalnızca yeni state üretmesi test edilebilirliği korur. Ayrı modül, tarayıcıdan gelen veriye güvenmeyip JSON biçimini, ürün alanlarını, pozitif tam sayı adedi ve benzersiz ürün kimliklerini tek yerde doğrular. Okuma/yazma veya erişim hatası uygulamaya yayılmaz.
- **Değerlendirilen alternatifler:** (1) Storage işlemlerini reducer içine koymak az dosya kullanır fakat side effect ekleyerek reducer'ı saf olmaktan çıkarır. (2) Bütün okuma/yazma kodunu doğrudan Provider içinde tutmak küçük uygulamada çalışır fakat doğrulama kodunu JSX yaşam döngüsüyle karıştırır ve saf Node testini zorlaştırır. (3) Ayrı yardımcı modül ile Provider lazy init + effect kullanmak bir ek dosya oluşturur fakat sorumlulukları ayırır; bu proje için seçilmiştir.
- **Sonuç/Sınırlama:** Sepet aynı tarayıcı ve origin'de yenileme/yeniden açma boyunca korunur. Tarayıcı verisi temizlenirse veya storage kullanılamazsa boş sepet kullanılır. Saklanan ürün anlık kopyası backend'deki sonraki fiyat/silme değişiklikleriyle otomatik uzlaştırılmaz; hesap ve cihazlar arası senkronizasyon yoktur. Hassas veri saklanmaz.

## Aşama 4 teknik kararları (K1-K9)

Bu kararlar PDF'deki zorunlu beş REST işlemini ve kontrollü hata davranışını somutlaştırır. Endpoint ayrıntıları, ürün alan kuralları ve aşağıdaki uygulama biçimleri kaynak PDF'nin dayattığı şema değil, bu proje için seçilen teknik çözümlerdir.

### K1 - Güncelleme yöntemi

- **Seçilen yaklaşım:** Yalnızca `PATCH /api/products/:id`.
- **Değerlendirilen alternatifler:**
  - `PUT`, bütün kaydı değiştirme anlamını açık taşır; buna karşılık istemcinin her alanı göndermesini ve eksik alan davranışının ayrıca tanımlanmasını gerektirir.
  - `PATCH`, yalnızca gönderilen alanları değiştirir ve ilerideki küçük düzenleme formlarını kolaylaştırır; boş gövde ve alan bazlı validasyonun açıkça ele alınması gerekir.
  - `PUT` ile `PATCH` birlikte daha esnektir; ancak aynı küçük uygulama için iki sözleşme, iki dokümantasyon ve daha fazla test üretir.
- **Seçim nedeni:** Görev tek bir güncelleme işlemi ister. Kısmi form güncellemesi, API sadeliği ve test kolaylığı için PATCH yeterlidir; gönderilmeyen alanlar korunur, boş güncelleme `400` olur.
- **Diğerleri ne zaman uygun olur?:** Tam kayıt değişimi iş kuralıysa PUT; farklı istemciler iki semantiğe de gerçekten ihtiyaç duyuyorsa ikisi birlikte uygun olabilir.

### K2 - Validasyon yaklaşımı

- **Seçilen yaklaşım:** Yeni bağımlılık olmadan ayrı, saf `validators/productValidator.js` fonksiyonları; controller bu sonucu HTTP hatasına çevirir.
- **Değerlendirilen alternatifler:**
  - Ayrı manuel validator kuralları görünür, bağımlılıksız ve doğrudan test edilebilirdir; model büyüdükçe tekrar artabilir.
  - Zod/Joi gibi şema kütüphaneleri büyük ve iç içe şemalarda güçlüdür; bu altı alanlı görevde yeni paket ve öğrenme maliyeti getirir.
  - Route middleware'i controller'ı sade tutar ve birçok route aynı şemayı kullanınca tekrar azaltır; küçük projede request mutasyonu ve fazladan akış katmanı oluşturabilir.
  - Controller içinde doğrudan kontroller ilk anda kısadır; oluşturma ile güncellemede tekrar ve kalabalık üretir.
- **Seçim nedeni:** Kuralları HTTP ve veri değişikliğinden ayırırken başlangıç seviyesinde izlenebilirliği korur; yeni paket gerekmez.
- **Diğerleri ne zaman uygun olur?:** Çok sayıda model/karmaşık şema için Zod/Joi; birçok route aynı doğrulamayı paylaşıyorsa route middleware'i; tek ve çok küçük bir istek için controller içi kontrol yeterli olabilir.

### K3 - Ürün kimliği üretimi

- **Seçilen yaklaşım:** Node.js'in yerleşik `crypto.randomUUID()` fonksiyonu.
- **Değerlendirilen alternatifler:**
  - `randomUUID()` çok düşük çakışma riskiyle ek paket istemez; `p-001` kadar insan tarafından okunabilir değildir.
  - Artan sayısal kimlik basittir; silme, yeniden başlatma ve eşzamanlı üretimde sayaç yönetimi ister.
  - Artan `p-001` metni başlangıç verisiyle uyumludur; en büyük değeri tarama ve silinen kimliğin yeniden kullanılmasını önleme mantığı gerekir.
  - Timestamp bağımlılıksızdır; aynı milisaniyedeki isteklerde çakışabilir ve tahmin edilebilirdir.
  - Harici UUID paketi benzer güvence verir; modern Node.js varken gereksiz bağımlılıktır.
- **Seçim nedeni:** Kimliği backend üretir, istemci kimliği reddedilir ve sayaç/çakışma yönetimi eklenmeden güvenli benzersizlik elde edilir.
- **Diğerleri ne zaman uygun olur?:** İnsan tarafından okunur sıra numarası iş gereksinimiyse veritabanı destekli sayaç; eski Node sürümünde harici UUID paketi uygun olabilir.

### K4 - Hata yönetimi mimarisi

- **Seçilen yaklaşım:** Küçük `AppError` sınıfı ve mevcut merkezi `errorHandler` middleware'ini geliştirmek.
- **Değerlendirilen alternatifler:**
  - Her controller'ın doğrudan cevap vermesi akışı yerel gösterir; cevap biçimi tekrarlanır ve zamanla tutarsızlaşabilir.
  - Özel hata + merkezi handler controller'ları sade, cevapları tutarlı ve 500 ayrıntılarını güvenli tutar; küçük bir ek soyutlama getirir.
  - Service'in sonuç nesnesi döndürmesi exception kullanmaz; her başarı/hata dalında daha çok boilerplate ve HTTP'ye benzeyen durum taşıyabilir.
  - Basit hata kodlarını merkezi eşlemek hafiftir; mesaj/details bilgisini ayrı bir eşleme tablosunda tutmayı gerektirir.
- **Seçim nedeni:** Aşama 3'teki merkezi handler korunup genişletildi. Controller hata **oluşturur**, yalnız son middleware HTTP hata cevabını **gönderir**.
- **Diğerleri ne zaman uygun olur?:** Tek endpoint'li prototipte doğrudan cevap; exception kullanılmayan fonksiyonel tasarımda sonuç nesnesi; çok dilli/kurumsal hata kataloğunda hata kodu eşlemesi uygun olabilir.

### K5 - DELETE başarı cevabı

- **Seçilen yaklaşım:** `204 No Content` ve tamamen boş response body.
- **Değerlendirilen alternatifler:**
  - `204`, silmenin başarılı olduğunu en küçük cevapla bildirir; istemci body okuyamaz.
  - `200` ve silinen ürün, geri alma veya denetim ekranında faydalıdır; bu görevde istemci ürünü zaten bilir ve gereksiz veri taşır.
  - `200` ve başarı mesajı kullanıcı metni sağlayabilir; API istemcisine özel bir mesaj sözleşmesi ekler.
- **Seçim nedeni:** Frontend silinen kimliği zaten bildiği için REST anlamı ve sadelik önceliklidir.
- **Diğerleri ne zaman uygun olur?:** Silinen kaydın snapshot'ı gerçekten kullanılacaksa ürün; iş akışı ek bilgi vermek zorundaysa mesaj içeren `200` uygun olabilir.

### K6 - Başarılı API cevap biçimi

- **Seçilen yaklaşım:** Ürün veya ürün dizisini doğrudan döndürmek.
- **Değerlendirilen alternatifler:**
  - Doğrudan cevap mevcut GET sözleşmesini korur ve frontend erişimini sade tutar; ortak metadata alanı için yer bırakmaz.
  - `{ "data": ... }` ortak zarf sağlar; mevcut GET tüketicisini kırar ve bu aşamada fazladan iç içelik getirir.
  - `{ "data": ..., "meta": ... }` sayfalama için uygundur; henüz sayfalama yokken boş/uydurma metadata üretir.
- **Seçim nedeni:** Aşama 3 geriye dönük uyumluluğu ve küçük API sadeliği korunur. POST/PATCH de doğrudan ürün döndürür.
- **Diğerleri ne zaman uygun olur?:** Baştan standartlaştırılan büyük API'de `data`; sayfalama ve bağlantılar gerçekten varsa `data + meta` uygun olabilir.

### K7 - Hata cevabı biçimi

- **Seçilen yaklaşım:** Her hatada `message`, alan hataları gerektiğinde ek `details` nesnesi.
- **Değerlendirilen alternatifler:**
  - Yalnız `message` çok sadedir; frontend form alanına özgü mesaj gösteremez.
  - `message + details` genel mesajı ve alan bazlı geri bildirimi az yapıyla birlikte sağlar; istemci `details` alanının isteğe bağlı olduğunu bilmelidir.
  - İç içe `error.code/message/details` kurumsal sınıflandırma ve çeviri için güçlüdür; bu görevde kod ve dokümantasyon yükünü artırır.
- **Seçim nedeni:** Form için yeterli ayrıntıyı Aşama 3'teki `message` sözleşmesini bozmadan ekler.
- **Diğerleri ne zaman uygun olur?:** Form alanı yoksa yalnız mesaj; çok sayıda istemci, yerelleştirme ve hata analitiği varsa kodlu iç içe yapı uygun olabilir.

### K8 - Bilinmeyen request alanları

- **Seçilen yaklaşım:** Bilinmeyen alanı `400` ile reddetmek; `id` için backend tarafından üretildiğini açıkça belirtmek.
- **Değerlendirilen alternatifler:**
  - Bilinmeyen alanı yok saymak istemciye hoşgörülüdür; yazım hatalarını ve istemcinin kimlik belirleme girişimini gizler.
  - Bilinmeyen alanı reddetmek güvenli veri sınırı ve erken geri bildirim sağlar; API'ye yeni alan eklenirken istemciler sözleşmeyle birlikte güncellenmelidir.
  - Whitelist alanlarını alıp diğerlerini sessizce çıkarmak mass-assignment riskini sınırlar; hatalı isteğin başarılı görünmesine neden olabilir.
- **Seçim nedeni:** Küçük ve belgeli modelde katı geri bildirim anlaşılırdır; yalnız desteklenen alanlar service'e ulaşır ve istemci `id` değerine güvenilmez.
- **Diğerleri ne zaman uygun olur?:** Geriye dönük uyumluluğu çok yüksek, gevşek istemci ekosisteminde sessiz whitelist; telemetriyle izlenen tolerant API'de yok sayma seçilebilir.

### K9 - Bellekteki ürün verisinin yönetimi

- **Seçilen yaklaşım:** Tek ürün dizisini yalnız service modülünde, kontrollü biçimde mutate etmek; Aşama 4 smoke testlerinde izolasyonu süreç yeniden başlatmayla sağlamak.
- **Değerlendirilen alternatifler:**
  - Aynı diziyi service içinde `push`, indeks ataması ve `splice` ile değiştirmek küçük ve okunabilirdir; mutasyon başka yerlere sızarsa yan etki riski vardır.
  - Her işlemde yeni dizi üretmek referans değişimini görünür kılar; paylaşılan modül değişkenini yeniden atama ve daha fazla depo yönetimi gerektirir.
  - Controller/data katmanının diziyi doğrudan değiştirmesi en kısa yoldur; sorumlulukları karıştırır ve test edilebilirliği düşürür.
  - Reset fonksiyonu test izolasyonunu kolaylaştırır; otomatik test altyapısı henüz yokken production koduna test amaçlı API ekler.
- **Seçim nedeni:** Veri erişimi service sınırında kalır, küçük görev için akış açıktır ve backend yeniden başlayınca modül başlangıç dizisini yeniden yükler.
- **Diğerleri ne zaman uygun olur?:** Karmaşık state geçişlerinde immutable store; Aşama 9'da izole otomatik testler eklendiğinde açık reset/fixture mekanizması; kalıcılık gerektiğinde gerçek repository/veritabanı uygundur.

## Aşama 5 frontend teknik kararları

Bu kararlar ürün listesi ve detayının kaynak gereksinimlerine uygun, küçük ve anlaşılır bir React uygulaması olmasını sağlar. Route yolları, marka metni, TRY sunumu ve aşağıdaki bileşen ayrımı kaynak PDF'nin dayattığı ayrıntılar değil, bu proje için seçilen uygulama kararlarıdır.

### F1 - Frontend yönlendirme

- **Seçilen yaklaşım:** Resmî `react-router` paketiyle `BrowserRouter`, `Routes`, `Route`, `Link` ve `useParams` kullanmak.
- **Değerlendirilen alternatifler:** `window.history` ve `popstate` ile elle SPA yönlendirmesi ek bağımlılık istemez ancak route/geri-ileri davranışını tekrar uygular; liste ve detayı tek URL'de koşullu göstermek daha kısa olsa da doğrudan detay URL'sini ve yenilemeyi karşılamaz.
- **Seçim nedeni:** `/`, `/products/:productId` ve genel `*` yollarını açıkça ayırır; kartları gerçek bağlantı yapar ve URL parametresini standart yolla okur.
- **Sınırlama:** Production sunucusu bilinmeyen dosya yollarını `index.html` dosyasına yönlendirmelidir. Vite geliştirme sunucusunda doğrudan detay yenilemesi doğrulanmıştır.

### F2 - API base URL ve ortak istek modülü

- **Seçilen yaklaşım:** Varsayılan `http://localhost:3000` adresini `VITE_API_BASE_URL` ile değiştirilebilir tutmak; bütün ürün isteklerini `productsApi.js` içinde toplamak.
- **Değerlendirilen alternatifler:** Adresi her componentte yazmak tekrara ve ortam değişikliğinde hataya açıktır; Vite proxy yapılandırması kısa URL sağlar ancak gerçek frontend-backend origin ayrımını ve mevcut CORS kararını gizler.
- **Seçim nedeni:** Componentler yalnız `getProducts` ve `getProductById` fonksiyonlarını bilir; ortam adresi tek noktadan değişir.
- **Sınırlama:** `VITE_` değişkenleri frontend build'ine gömülür ve gizli bilgi için kullanılmamalıdır. Değişiklikten sonra Vite yeniden başlatılmalıdır.

### F3 - Asenkron UI state'i ve istek yaşam döngüsü

- **Seçilen yaklaşım:** Liste ve detay sayfalarında `useState` + `useEffect`; açık `loading`, `success`, `error` ve gerektiğinde `not-found` state'leri; cleanup için `AbortController`; hatada kullanıcı tetiklemeli yeniden deneme.
- **Değerlendirilen alternatifler:** React Router loader'ları route verisini merkezileştirir fakat bu küçük aşamada yeni veri-router yapısı gerektirir; TanStack Query önbellek/retry sağlar fakat tek liste ve detay isteği için ek bağımlılık ve kavram maliyeti oluşturur.
- **Seçim nedeni:** Veri akışını başlangıç seviyesinde görünür tutar, unmount sonrası gereksiz isteği iptal eder ve backend kapalıyken sonsuz loading yerine kontrollü hata gösterir.
- **Sınırlama:** Önbellek, otomatik arka plan yenileme ve karmaşık retry politikası yoktur.

### F4 - Ürün görseli, fiyat ve görsel sistem

- **Seçilen yaklaşım:** Kullanıcının önceki projesindeki mavi (`#3B82F6`) ve mor (`#8B5CF6`) görsel dili, bu projede `#2563EB → #7C3AED → #EC4899` marka gradient'iyle **Yata Market** adına uyarlanmıştır. Tasarım araştırması raporundan 8 px tabanlı boşluk, sistem fontu, açık yüzey, 1:1 `object-fit: contain` ürün görseli, görünür focus, skeleton ve mobil-first grid kararları korunur. İlk açılışta 720 ms yükleme perdesi; route/sayfa, başlık, bölüm, kart, görsel, fiyat, durum ve detay bileşenlerinde kademeli giriş animasyonu bulunur. `prefers-reduced-motion` bütün dekoratif hareketleri devre dışı bırakır. Fiyatlar `Intl.NumberFormat('tr-TR', { currency: 'TRY' })` ile biçimlendirilir; yüklenemeyen görsel yerel fallback gösterir.
- **Değerlendirilen alternatifler:** Harici UI/CSS kütüphanesi hızlı bileşen sağlar fakat mevcut küçük projeye bağımlılık ve tasarım soyutlaması ekler; ham sayı ve para simgesi birleştirmek kısa olsa da yerel binlik/ondalık kurallarını güvenilir uygulamaz.
- **Seçim nedeni:** Kullanıcının istediği daha renkli ve önceki projeyle tutarlı kimliği verir; animasyonlar içerik hiyerarşisini görünür kılarken ürün verisini ve Aşama 5 işlevsel kapsamını değiştirmez.
- **Sınırlama:** Kaynak PDF para birimini veya marka adını belirlemez. `TRY` teknik sunum kararı, “Yata Market” kullanıcı tarafından verilen marka kararıdır; gerçek ürün görselleri harici URL'lere bağlıdır.

### F5 - Başarılı, boş, hata ve 404 görünümleri

- **Seçilen yaklaşım:** Başarıda ürün/detayı doğrudan göstermek; boş dizi için ayrı `EmptyState`; ağ/API hatası için mesaj + “Tekrar dene”; API `404` için “Ürün bulunamadı”; bilinmeyen frontend route'u için “Sayfa bulunamadı”.
- **Değerlendirilen alternatifler:** Tüm başarısızlıkları tek mesajda birleştirmek daha az kod üretir fakat kullanıcıya doğru geri dönüş yolunu vermez; redirect ile otomatik ana sayfaya dönmek hatayı saklar ve yanlış URL'yi anlaşılmaz kılar.
- **Seçim nedeni:** Kaynaktaki kontrollü geçersiz/bulunamayan durumları ve temel loading/error/empty zorunluluğunu açık, test edilebilir state'lere dönüştürür.
- **Sınırlama:** Bu aşamada toast sistemi, hata telemetrisi veya otomatik çoklu retry eklenmemiştir.

## Aşama 2 uygulama kaydı

- Hedef klasör, mevcut `.../quiz-sinav-react/02` Git repository'sinin içinde tutulmuştur; iç içe yeni bir repository oluşturulmamıştır.
- Frontend ve backend ayrı npm paketleri olarak kurulmuş, kesin bağımlılık sürümleri iki `package-lock.json` dosyasına kaydedilmiştir.
- Desteklenen Node.js aralığı Vite gereksinimiyle uyumlu olarak `^20.19.0 || >=22.12.0` seçilmiştir.
- Varsayılan frontend adresi başlangıçta `http://localhost:5173` idi; eski quiz projesinin kullandığı 5173/5174 portlarıyla karışmayı önlemek için Yata Market'e özel `http://localhost:5180` adresine alınmış ve Vite `strictPort` ile sabitlenmiştir. Backend adresi `http://localhost:3000` olarak kalır.
- CORS yalnızca `CORS_ORIGIN` değişkenindeki origin'e; değişken yoksa Yata Market'in güncel `http://localhost:5180` adresine izin verecek şekilde yapılandırılmıştır.
- `.env` isteğe bağlı yerel ayar dosyasıdır ve Git tarafından yok sayılır; hassas bilgi içermeyen `.env.example` izlenebilir.

## Aşama 3 uygulama kaydı

- Ürün verisi yalnızca `backend/src/data/products.js` içindeki JavaScript dizisinde tutulur; veritabanı ve dosyaya çalışma zamanı yazımı yoktur.
- Veri kümesi 10 ürün, 6 kategori, benzersiz `p-001` - `p-010` kimlikleri ve birbirinden farklı pozitif fiyatlar içerir.
- `GET /api/products` listeyi, `GET /api/products/:id` tek ürünü döndürür.
- Route, controller, service ve data sorumlulukları ayrı dosyalardadır; HTTP bilgisi data/service katmanına taşınmaz.
- Ortak 404 ve hata middleware'leri route'lardan sonra bağlanmıştır. Health endpoint'i ürün route'larından bağımsız kalır.
- Ürün görselleri harici placeholder URL'leri kullanır; görsel servisi kullanılamazsa ileride frontend fallback göstermelidir.

## Aşama 4 uygulama kaydı

- `POST /api/products`, `PATCH /api/products/:id` ve `DELETE /api/products/:id` eklenerek kaynakta istenen beş REST işlemi tamamlanmıştır.
- Validasyon ayrı ve bağımlılıksız fonksiyonlarda; veri değişiklikleri service katmanında; HTTP cevapları controller ve son error middleware'inde tutulur.
- Yeni ürün kimliği yerleşik `crypto.randomUUID()` ile backend tarafından üretilir. İstemcinin `id` veya başka bilinmeyen alan göndermesi `400` ile reddedilir.
- Başarılı cevaplar Aşama 3 ile uyumlu olarak doğrudan ürün/dizi biçimindedir. Validasyon hataları `message + details`, diğer hatalar en az `message` içerir.
- Bellek dizisi çalışma sırasında değişir; süreç yeniden başladığında kaynak dosyadaki 10 başlangıç ürünü geri gelir. Dosyaya kalıcı yazma eklenmemiştir.
- Frontend, arama/filtre/sıralama, veritabanı, authentication, yönetim ekranı ve bonuslar Aşama 4 kapsamında değiştirilmemiştir.

## Aşama 5 uygulama kaydı

- Frontend ürünleri yalnız `GET /api/products` üzerinden alır; kaynak kodda sabit ürün dizisi yoktur.
- `/` responsive ürün kartlarını, `/products/:productId` tek ürün detayını, `*` bilinmeyen frontend yolunu gösterir. Bilinmeyen API ürün kimliği ayrı “Ürün bulunamadı” görünümüne çevrilir.
- API iletişimi `productsApi.js`; sayfa state'i `pages`; tekrar kullanılabilir kart/görsel/fiyat/durum parçaları `components` sorumluluğundadır.
- Liste ve detay isteklerinde skeleton loading, ağ/API hatasında güvenli mesaj ve yeniden deneme, boş dizide ayrı empty görünümü vardır. İstek cleanup'ında `AbortController` kullanılır.
- Tasarım araştırması raporunun temel tipografi, boşluk, görsel oranı, kart, responsive grid, detay düzeni, focus ve reduced-motion önerileri; kullanıcının istediği Yata Market mavi-mor-pembe gradient kimliğiyle uygulandı. İlk açılış yükleyicisi ve kademeli bileşen/route animasyonları eklendi. Rapordaki arama, filtre, sepet ve diğer sonraki aşama özellikleri eklenmedi.
- Gerçek backend ile 10 ürün/kart eşleşmesi, karttan `p-001` detayına geçiş, detay yenilemesi, ürün ve route 404'leri, 320 px yatay taşmama, backend-kapalı hata/retry, boş liste ve hatasız tarayıcı konsolu doğrulandı.

## Aşama 6 uygulama kaydı

- Arama, kategori filtresi ve fiyat sıralaması yalnız frontend'de uygulanır; backend endpoint'leri ve ürün verisi değiştirilmemiştir.
- `searchTerm`, `selectedCategory` ve `sortBy` kullanıcı seçimlerini tutan state'lerdir. Ekrandaki liste ayrı bir state değildir; ham API ürünleriyle bu üç seçimden `deriveProducts` üzerinden türetilir.
- Arama yalnız ürün adında çalışır; baş/son boşlukları, büyük/küçük harfi ve Türkçe karakter farklarını normalleştirir. Boş arama bütün ürünleri bırakır.
- Kategori seçenekleri API ürünlerinden benzersiz ve Türkçe sıralı üretilir. “Tüm kategoriler” filtreyi kaldırır.
- “Fiyat: düşükten yükseğe” ve “Fiyat: yüksekten düşüğe” gerçek iki sıralama seçeneğidir. “Önerilen sıra” API'nin başlangıç sırasını korur.
- Hiçbir ürün eşleşmezse API hatası yerine ayrı “Aramana uygun ürün bulunamadı” paneli ve bütün seçimleri temizleyen kurtarma eylemi görünür.
- Kontrol paneli mavi-mor-pembe Yata Market görsel sistemini, görünür `label` etiketlerini, 48 px form kontrollerini, focus halkalarını ve responsive tek/iki/beş sütun düzenini kullanır.
- Saf veri fonksiyonu, frontend lint/build ve gerçek tarayıcı akışları doğrulandı. 320 px'de kontrol paneli tek sütun, ürün grid'i iki sütun ve yatay taşmasızdır.

## Aşama 7 uygulama kaydı

- Sepet uygulama genelinde `CartProvider` ile paylaşılır; `useReducer` içindeki eylemler ekleme, artırma, azaltma, kaldırma ve temizleme geçişlerini tek yerde yönetir.
- Katalog kartındaki hızlı ekleme düğmesi ürün detayına gitmeden ürünü sepete ekler. Eklemeden sonra hem katalogda hem detayda aynı **sil | adet | artır** kontrolü görünür; böylece iki sayfanın davranışı tutarlı kalır.
- Bu üç parçalı kontrolde çöp kutusu ürünü doğrudan kaldırır, ortadaki değer mevcut adedi gösterir ve artı düğmesi yeni satır açmadan adedi artırır.
- Sepet sayfasında artı ve eksi kontrolleri bulunur. Adet `1` olduğunda eksi yerine erişilebilir etiketli çöp kutusu görünür ve yalnız ilgili satırı kaldırır; ayrı “Kaldır” düğmesi de korunur.
- Toplam ürün adedi, satır toplamı ve ara toplam saf selector fonksiyonlarıyla hesaplanır. Para hesaplarında kayan nokta sapmasını azaltmak için fiyatlar küçük para birimine çevrilip toplanır.
- Aşama 7 tamamlandığında sepet kalıcılığı bonus olduğu için `localStorage` henüz eklenmemişti. Bu tarihsel sınır daha sonra Aşama 11A'daki `ADR-018` ile değiştirilmiştir.
- Kullanıcının isteği üzerine son değişikliklerden sonra otomatik test çalıştırılmamıştır; Aşama 7 sonucu manuel kontrollere bağlıdır.

## Aşama 8 uygulama kaydı

- Liste ve detay yüklenme durumları güncel kart, fiyat, eylem ve detay metadata alanlarını taklit eden skeleton’larla eşleştirildi; içerik alanı yüklenirken korunur.
- Liste hatası ve detay hatası aynı güvenli `ErrorState` yapısını kullanır. Alt seviye `ApiError` mesajları kullanıcıya doğrudan yazılmaz; yeniden deneme mevcut `requestNumber` akışıyla yeni API isteği başlatır.
- Başarılı fakat boş API dizisi, arama/filtre sonucunun boş olması, bilinmeyen ürün ve bilinmeyen frontend yolu ayrı component ve metinlerle korunur.
- Ürün görseli yüklenemezse 1:1 alan korunur ve fallback, hangi ürün görselinin yüklenemediğini erişilebilir adla bildirir.
- Skip link, sticky header için `scroll-padding`, güçlü focus halkası, aktif navigasyonda `aria-current`, sepet/adet kontrollerinde `role="group"` ve durumlarda `role`/`aria-live` kullanıldı. Reduced-motion tercihinde başlangıç yükleme perdesinin bekleme süresi de kaldırıldı.
- Mavi-mor-pembe marka teması korunurken beyaz metin kullanılan ana gradient tonları daha koyu değerlere çekildi. Bu değişiklik erişilebilir kontrastı iyileştirmeyi amaçlayan teknik karardır; ölçümlü tam WCAG doğrulaması değildir.
- `frontend-list-detail-design.md`, `search-filter-sort-design.md` ve `cart-design-and-state.md` repository’de bulunamadı. Mevcut gerçek kod, karar kaydı ve kaynak PDF’ler esas alındı; eksik belgeler tahmin edilerek oluşturulmadı.
- İş mantığı, backend, API sözleşmesi, arama/filtre/sıralama ve reducer davranışı değiştirilmedi. Aşama 8 otomatik test edilmedi; kullanıcı manuel kontrolleri bekleniyor.

## Aşama 9 uygulama kaydı

- Backend'e 11 bağımsız HTTP integration testi eklendi. Health, liste, detay, kontrollü 404, oluşturma, geçersiz oluşturma, kısmi PATCH, bilinmeyen PATCH, DELETE sonrası 404, bilinmeyen route ve test izolasyonu doğrulanır.
- Frontend'e 9 arama/filtre/sıralama ve 12 sepet reducer/hesap testi olmak üzere 21 saf mantık testi eklendi.
- Test izolasyonu için başlangıç ürünleri her testte yeni nesne kopyaları olarak üretilir ve çalışan bellek dizisi sıfırlanır. Bu yardımcı üretim davranışını değiştirmez; production sunucusu yine başlangıçta aynı 10 ürünü kullanır.
- Sepet selector'ları geçersiz fiyat veya adet değerini toplam hesabına `0` katkı olarak kabul edecek biçimde güvenli hâle getirildi; böylece bozuk veri `NaN` olarak kullanıcı arayüzüne yayılmaz. Geçerli ürünlerdeki fiyat × adet davranışı değişmedi.
- Kalite incelemesinde API hata ayrıştırmasının `productsApi.js`, para biçimlendirmenin `formatCurrency.js` içinde zaten ortaklaştırıldığı; frontend'e backend veri yazma sorumluluğu veya backend'e UI kararı sızmadığı görüldü. Kaynak dosyalarda gömülü parola, token ya da API anahtarı bulunmadı; bu alanlarda gereksiz refaktör yapılmadı.
- Yeni paket eklenmedi. Backend `npm test` 11/11, frontend `npm test` 21/21, backend `npm run check`, frontend `npm run lint` ve `npm run build` başarılı oldu; build 106 modülü dönüştürdü.
- Tarayıcı, responsive viewport, klavye, konsol ve backend-kapalı görünüm testleri Codex tarafından çalıştırılmadı; kullanıcı manuel kontrol listesinde bekliyor.

## Aşama 10 uygulama kaydı

- README gerçek `package.json` scriptleriyle eşleştirildi; temiz ve tekrarlanabilir kurulum için lockfile tabanlı `npm ci` öne çıkarıldı.
- API belgesinde altı endpoint'in metot, yol, path/query parametresi, body, başarı ve hata sözleşmeleri gerçek route/controller koduyla karşılaştırıldı.
- `traceability.md` ile 26 zorunlu gereksinim kod, test ve doküman kanıtlarına bağlandı; `test-strategy.md` otomatik ve manuel sınırı açıklar.
- Git geçmişi salt okunur incelendi; geçmiş yeniden yazılmadı ve otomatik commit oluşturulmadı. Kullanıcının `learning-notes.md` içeriği ve boş `test.js` dosyası korunmuştur.
- Son teslim durumu, tarayıcı ve responsive kontroller kullanıcı tarafından tamamlanana ve çalışma ağacı gözden geçirilip commit edilene kadar “Manuel kontrole bağlı”dır.

## Aşama 11A uygulama kaydı

- Yalnız `BON-004` uygulandı; favori, fiyat aralığı, sayfalama, loglama ve ürün yönetim arayüzüne başlanmadı.
- `cartStorage.js` geçerli sepeti `yata-market-cart` anahtarıyla JSON olarak kaydeder; yüklemede yalnız whitelist içindeki ürün alanlarını ve pozitif tam sayı adedi kabul eder.
- Bozuk JSON, geçersiz alan/tür, yinelenen ürün satırı ve storage erişim hatası boş sepet fallback'i üretir. Sepeti temizleme `{ "items": [] }` kaydını yazar.
- `CartProvider` lazy başlangıç yüklemesi ve state değişiminde effect kullanır; `cartReducer` değiştirilmemiş ve saf kalmıştır.
- Yeni bağımlılık eklenmedi. Frontend 31/31 test, lint ve 107 modüllü production build; backend 11/11 test ve syntax kontrolü başarılıdır. Tarayıcı yenileme ve yeniden açma akışı kullanıcı manuel testine bırakılmıştır.

## Açık kararlar ve riskler

- Hedef `04-05` klasörü kendi `.git` klasörüne sahip değildir; commit'ler üstteki `.../quiz-sinav-react/02` repository'sine ait olacaktır. Üst repository'deki ilgisiz kullanıcı değişiklikleri bu aşamada korunmuştur.
- Kesin tarayıcı destek matrisi kaynakta belirtilmemiştir; uygulama geliştikçe kullanılan web özelliklerine göre kaydedilmelidir.
- Kaynak PDF görsel tasarım ve marka adı belirlemez. “Yata Market” adı ve mavi-mor-pembe renkli tema kullanıcının açık görsel tercihidir; kaynak zorunluluğu değildir.
- Para birimi kaynakta belirtilmez. Türkçe içerik ve tasarım raporundaki fiyat örnekleri nedeniyle Aşama 5'te TRY seçilmiştir; gerçek iş gereksinimi farklıysa biçimlendirici tek noktadan değiştirilebilir.
- Başlangıç ürün görselleri harici `placehold.co` adreslerine bağlıdır. Servis yüklenmezse fallback görünür; gerçek ürün varlıklarının sahipliği ve barındırılması hâlâ açık bir ürün kararıdır.
- Aşama 6 kontrol seçimleri route veya yenileme boyunca kalıcı değildir. Liste componenti yeniden kurulduğunda arama, kategori ve sıralama başlangıç değerlerine döner; kaynak görev kalıcılık istemediği için URL parametresi veya global state eklenmemiştir.
- Aşama 11A ile sepet aynı tarayıcı origin'inde `localStorage` kullanılarak korunur. Storage kaydı backend ürünleriyle otomatik uzlaştırılmadığı ve cihazlar arasında paylaşılmadığı için eski ürün anlık kopyası kalabilir.
- Aşama 8 tam WCAG denetimi değildir. Özellikle gerçek cihaz, tarayıcı yakınlaştırması, renk kontrast ölçümü ve ekran okuyucu davranışı manuel veya uzman araçlarıyla ayrıca doğrulanmalıdır.

## Karar değişikliği şablonu

Bir öneri değişirse eski kaydı silmek yerine aşağıdaki bilgileri ekle:

```text
Tarih:
Yeni durum: Kabul edildi | Değiştirildi | İptal edildi
Yeni karar:
Değişiklik nedeni:
Etkilenen gereksinimler/dosyalar:
```
