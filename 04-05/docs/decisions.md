# Teknik Karar Kaydı

## Kullanım

Bu belge, gereksinimlerin **nasıl** karşılanabileceğine ilişkin başlangıç kararlarını kaydeder. Kaynak PDF teknik ayrıntıların geliştirici tarafından seçilmesini ister. Aşama 1'de uygulama oluşturulmadığı için aşağıdaki teknik tercihlerin durumu **Öneri**dir; uygulama aşamasında doğrulanıp “Kabul edildi” veya “Değiştirildi” olarak güncellenmelidir.

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
- **Sonuç/Sınırlama:** Aşama 3'te gerçek ürün okuma sorumlulukları oluştuğu için `routes`, `controllers`, `services`, `data` ve `middleware` klasörleri eklenmiştir. Henüz ihtiyaç olmayan `validators` klasörü Aşama 4'e bırakılmıştır.

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
- **Sonuç/Sınırlama:** Kaynak bu alanları zorunlu kılmaz. Aşama 3 veri kümesi 10 ürün ve 6 kategori içerir; stok/envanter davranışı eklenmez. Görseller harici placeholder URL'lerine bağlıdır ve frontend daha sonra yükleme hatasına karşı kendi placeholder'ını göstermelidir.

## ADR-007 - REST endpoint tasarımı

- **Durum:** Kısmen kabul edildi (Aşama 3)
- **Karar:** API tabanı `/api/products` olacak: `GET /api/products`, `GET /api/products/:id`, `POST /api/products`, `PATCH /api/products/:id` ve `DELETE /api/products/:id` kullanılacak.
- **Neden:** Kaynak odaklı yollar ile listeleme, tek kayıt ve CRUD işlemleri doğrudan eşleşir. `PATCH`, yalnızca gönderilen alanları güncelleyerek küçük arayüzler için daha kolay bir sözleşme sağlar.
- **Alternatif:** Tam kayıt değişimi için `PUT` veya hem `PUT` hem `PATCH` desteği.
- **Sonuç/Sınırlama:** Aşama 3'te yalnızca `GET /api/products` ve `GET /api/products/:id` uygulanmıştır. `POST`, `PATCH` ve `DELETE` Aşama 4'e bırakılmıştır; henüz çalışıyor gibi belgelenmez.

## ADR-008 - Validasyon ve hata cevapları

- **Durum:** Kısmen kabul edildi (Aşama 3)
- **Karar:** İstek verisi backend sınırında doğrulanacak; hata cevapları tutarlı JSON biçiminde en az `message` alanı içerecek. Bulunamayan ürün için `404`, geçersiz veri için `400`, oluşturma için `201`, başarılı silme için `204` önerilir.
- **Neden:** Hatalı isteklerin kontrollü ele alınmasını ve frontend'in hata mesajlarını tek biçimde işlemesini sağlar.
- **Alternatif:** Harici bir şema validasyon kütüphanesi veya her route içinde ayrı kontroller.
- **Sonuç/Sınırlama:** Aşama 3'te bilinmeyen ürün `404 {"message":"Ürün bulunamadı"}`, bilinmeyen route ise `404 {"message":"Endpoint bulunamadı"}` döndürür. İstek gövdesi validasyonu ve yazma durum kodları Aşama 4'e bırakılmıştır.

## ADR-009 - Frontend HTTP istemcisi

- **Durum:** Öneri
- **Karar:** Frontend-backend iletişiminde tarayıcının yerleşik `fetch` API'si kullanılacak ve ortak istek/hata davranışı küçük bir API modülünde toplanacak.
- **Neden:** Zorunlu akışlar için ek bağımlılık gerekmez; ortak modül tekrarlanan hata kontrolünü azaltır.
- **Alternatif:** Axios veya her component içinde doğrudan `fetch` çağrısı.
- **Sonuç/Sınırlama:** `fetch` HTTP hata kodlarında kendiliğinden hata fırlatmadığı için `response.ok` açıkça kontrol edilmelidir.

## ADR-010 - Sepet state yönetimi

- **Durum:** Öneri
- **Karar:** Sepet React Context ve `useReducer` ile yönetilecek.
- **Neden:** Sepete ekleme, adet değiştirme, kaldırma ve temizleme gibi ilişkili geçişleri tek yerde toplar; harici state kütüphanesi gerektirmez.
- **Alternatif:** Üst componentte `useState`, prop aktarımı veya Redux benzeri bir kütüphane.
- **Sonuç/Sınırlama:** Bu yaklaşım yalnızca istemci belleğinde çalışır. Sayfa yenilemede sepeti korumak BON-004'tür ve temel kapsamda eklenmez.

## ADR-011 - Sepet yönetimi davranışları

- **Durum:** Öneri
- **Karar:** Aynı ürün yeniden eklendiğinde adedi artırılacak; kullanıcı adedi artırabilecek, azaltabilecek, ürünü kaldırabilecek ve sepeti temizleyebilecek. Adet sıfırın altına inemeyecek.
- **Neden:** Kaynaktaki “sepetteki ürünler yönetilebilmelidir” ifadesini kullanıcı açısından gözlemlenebilir ve test edilebilir hâle getirir.
- **Alternatif:** Yalnızca kaldırma veya doğrudan adet girişi.
- **Sonuç/Sınırlama:** Bu, kaynakta tek tek sayılmış bir işlem listesi değil, güvenli bir uygulama önerisidir. Stok kontrolü kapsam dışıdır.

## ADR-012 - Arama, filtre ve sıralamanın yeri

- **Durum:** Öneri
- **Karar:** İlk sürümde backend'den alınan ürün kümesi frontend'de aranacak, filtrelenecek ve sıralanacak. Arama `name` ve `description` üzerinde büyük/küçük harf duyarsız; zorunlu filtre `category`; iki sıralama seçeneği fiyat artan ve fiyat azalan olacak.
- **Neden:** Küçük bellek içi veri kümesinde API sözleşmesini gereksiz karmaşıklaştırmadan üç zorunlu UI davranışını açıkça gösterir. Kategori filtresi kullanılarak bonus olan fiyat aralığı filtresi temel kapsama karıştırılmaz.
- **Alternatif:** Arama, filtre ve sıralama query parametreleriyle backend'de yapmak.
- **Sonuç/Sınırlama:** Çok büyük veri kümeleri için verimli değildir; sayfalama veya sunucu tarafı sorgulama daha sonra seçilirse bu karar gözden geçirilmelidir.

## ADR-013 - Stil ve responsive yaklaşım

- **Durum:** Kabul edildi (Aşama 2)
- **Karar:** Tek ve tutarlı bir düz CSS yaklaşımı kullanılacak; düzen önce küçük ekranlarda kullanılabilir olacak, sonra içerik tabanlı breakpoint'lerle genişletilecek.
- **Neden:** Kaynak belirli bir CSS kütüphanesi istemez. Düz CSS başlangıç seviyesinde ek soyutlama olmadan responsive davranışı görünür kılar.
- **Alternatif:** CSS Modules, Tailwind veya bir component kütüphanesi.
- **Sonuç/Sınırlama:** Sınıf isimleri ve dosya sorumlulukları disiplinli tutulmalıdır; belirli breakpoint değerleri arayüz oluşunca doğrulanacaktır.

## ADR-014 - Test yaklaşımı

- **Durum:** Kabul edildi (Aşama 2)
- **Karar:** Her aşamada [manuel test kontrol listesi](./manual-test-checklist.md) güncellenecek; kritik hesaplama ve API davranışları oluştuğunda küçük, hedefli otomatik testler değerlendirilecek.
- **Neden:** PDF çalışan davranışı ve kaliteyi değerlendirir ancak belirli bir otomatik test aracı veya kapsam yüzdesi zorunlu kılmaz.
- **Alternatif:** Baştan geniş bir uçtan uca test paketi kurmak veya yalnızca manuel test yapmak.
- **Sonuç/Sınırlama:** Otomatik testler kaynak zorunluluğu gibi sunulmaz; seçilecek araç ve test kapsamı uygulama yapısı görüldükten sonra kayda eklenmelidir.

## Aşama 2 uygulama kaydı

- Hedef klasör, mevcut `.../quiz-sinav-react/02` Git repository'sinin içinde tutulmuştur; iç içe yeni bir repository oluşturulmamıştır.
- Frontend ve backend ayrı npm paketleri olarak kurulmuş, kesin bağımlılık sürümleri iki `package-lock.json` dosyasına kaydedilmiştir.
- Desteklenen Node.js aralığı Vite gereksinimiyle uyumlu olarak `^20.19.0 || >=22.12.0` seçilmiştir.
- Varsayılan frontend adresi `http://localhost:5173`, backend adresi `http://localhost:3000` olarak belirlenmiştir.
- CORS yalnızca `CORS_ORIGIN` değişkenindeki origin'e; değişken yoksa `http://localhost:5173` adresine izin verecek şekilde yapılandırılmıştır.
- `.env` isteğe bağlı yerel ayar dosyasıdır ve Git tarafından yok sayılır; hassas bilgi içermeyen `.env.example` izlenebilir.

## Aşama 3 uygulama kaydı

- Ürün verisi yalnızca `backend/src/data/products.js` içindeki JavaScript dizisinde tutulur; veritabanı ve dosyaya çalışma zamanı yazımı yoktur.
- Veri kümesi 10 ürün, 6 kategori, benzersiz `p-001` - `p-010` kimlikleri ve birbirinden farklı pozitif fiyatlar içerir.
- `GET /api/products` listeyi, `GET /api/products/:id` tek ürünü döndürür.
- Route, controller, service ve data sorumlulukları ayrı dosyalardadır; HTTP bilgisi data/service katmanına taşınmaz.
- Ortak 404 ve hata middleware'leri route'lardan sonra bağlanmıştır. Health endpoint'i ürün route'larından bağımsız kalır.
- Ürün görselleri harici placeholder URL'leri kullanır; görsel servisi kullanılamazsa ileride frontend fallback göstermelidir.

## Açık kararlar ve riskler

- Hedef `04-05` klasörü kendi `.git` klasörüne sahip değildir; commit'ler üstteki `.../quiz-sinav-react/02` repository'sine ait olacaktır. Üst repository'deki ilgisiz kullanıcı değişiklikleri bu aşamada korunmuştur.
- Kesin tarayıcı destek matrisi kaynakta belirtilmemiştir; uygulama geliştikçe kullanılan web özelliklerine göre kaydedilmelidir.
- Görsel tasarım, marka dili ve ürün görsellerinin kaynağı belirtilmemiştir; erişilebilir ve sade bir başlangıç arayüzü önerilir.
- Para birimi belirtilmemiştir; veri ve sunum kararı uygulama başlamadan önce kesinleştirilmelidir.

## Karar değişikliği şablonu

Bir öneri değişirse eski kaydı silmek yerine aşağıdaki bilgileri ekle:

```text
Tarih:
Yeni durum: Kabul edildi | Değiştirildi | İptal edildi
Yeni karar:
Değişiklik nedeni:
Etkilenen gereksinimler/dosyalar:
```
