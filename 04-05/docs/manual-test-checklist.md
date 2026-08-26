# Manuel Test Kontrol Listesi

## Amaç

Bu belge, sonraki aşamalarda uygulamanın elle doğrulanması için yaşayan bir kontrol listesidir. Aşama 1'de uygulama kodu bulunmadığından aşağıdaki testlerin hiçbiri çalıştırılmış veya geçmiş sayılmaz.

Gereksinim kimlikleri [requirements.md](./requirements.md) belgesine bağlanır.

## Nasıl kullanılmalı?

1. İlgili geliştirme aşaması tamamlandığında testi uygula.
2. Kutuyu yalnızca beklenen sonucu gerçekten gördüysen işaretle.
3. Sonucu `Bekliyor`, `Geçti`, `Kaldı` veya gerekçesiyle `Uygulanamaz` olarak kaydet.
4. Hata varsa gerçekleşen sonucu, hata mesajını ve mümkünse ekran görüntüsü/komut çıktısı yolunu yaz.
5. Düzeltmeden sonra aynı testi yeniden çalıştır ve yeni tarihi ekle.

Her test için kullanılabilecek kayıt:

```text
Tarih:
Testi yapan:
Ortam (işletim sistemi, tarayıcı, Node sürümü):
Sonuç: Bekliyor | Geçti | Kaldı | Uygulanamaz
Gerçekleşen sonuç / kanıt:
Notlar:
```

## 1. Kurulum ve çalıştırma

- [ ] **MT-SET-001 - Temiz kurulum** (`REQ-022`, `REQ-023`): README adımları temiz bir ortamda izlenir; frontend ve backend bağımlılıkları hatasız kurulur.
- [ ] **MT-SET-002 - Backend'i başlatma** (`REQ-002`, `REQ-022`): Belgelenen komut Express sunucusunu beklenen portta başlatır.
- [ ] **MT-SET-003 - Frontend'i başlatma** (`REQ-001`, `REQ-022`): Belgelenen komut React uygulamasını açar ve başlangıç ekranı görünür.
- [ ] **MT-SET-004 - Uçtan uca bağlantı** (`REQ-020`, `REQ-022`): İki uygulama çalışırken frontend ürünleri backend API'sinden alır.
- [ ] **MT-SET-005 - Veritabanı bağımsızlığı** (`REQ-003`): Kurulum veya çalıştırma için veritabanı servisi, bağlantı bilgisi ya da ORM migration'ı gerekmez.

## 2. Backend CRUD

- [ ] **MT-API-001 - Ürün listesi** (`REQ-013`, `REQ-014`): Liste endpoint'i başarılı durum koduyla bir ürün koleksiyonu döndürür.
- [ ] **MT-API-002 - Tek ürün** (`REQ-015`): Var olan kimlik yalnızca ilgili ürünü döndürür.
- [ ] **MT-API-003 - Ürün oluşturma** (`REQ-016`): Geçerli veri yeni ürün oluşturur; ürün sonraki liste/tek kayıt isteğinde bulunur.
- [ ] **MT-API-004 - Ürün güncelleme** (`REQ-017`): Geçerli kimlik ve veri yalnızca hedef ürünü beklenen biçimde değiştirir.
- [ ] **MT-API-005 - Ürün silme** (`REQ-018`): Geçerli kimlikteki ürün silinir ve sonraki istekte bulunamaz.
- [ ] **MT-API-006 - Geçersiz oluşturma verisi** (`REQ-019`, `QLT-006`, `QLT-008`): Eksik veya geçersiz veri kontrollü 4xx cevabı ve anlaşılır hata mesajı üretir; sunucu çalışmaya devam eder.
- [ ] **MT-API-007 - Geçersiz güncelleme verisi** (`REQ-019`, `QLT-006`, `QLT-008`): Geçersiz değişiklik reddedilir ve mevcut kayıt bozulmaz.
- [ ] **MT-API-008 - Bulunamayan ürün** (`REQ-019`): Okuma, güncelleme ve silmede olmayan kimlik başarı yerine uygun bulunamadı cevabı üretir.
- [ ] **MT-API-009 - Dokümanla uyum** (`REQ-024`): Belgelenen her endpoint örneği gerçek API davranışıyla aynı metot, yol, veri ve durum kodunu kullanır.

### Aşama 3 - Ürün okuma API'si

- [ ] **MT-A3-001 - Health gerileme kontrolü** (`REQ-002`, `REQ-022`): `GET /api/health` hâlâ `200` ve `{"status":"ok"}` döndürür.
- [ ] **MT-A3-002 - Ürün dizisi** (`REQ-013`, `REQ-014`): `GET /api/products` `200` ve köşeli parantezli JSON dizisi döndürür.
- [ ] **MT-A3-003 - Veri kalitesi** (`QLT-002`, `QLT-005`): Liste 10 ürün ve birden fazla kategori içerir; kimlikler benzersiz, fiyatlar pozitif sayıdır ve temel alanlar doludur.
- [ ] **MT-A3-004 - Gerçek ürün detayı** (`REQ-015`): Listeden kopyalanan kimlikle detay isteği `200` döndürür ve cevap listedeki aynı ürünle eşleşir.
- [ ] **MT-A3-005 - Bilinmeyen ürün** (`REQ-019`, `QLT-008`): `GET /api/products/bilinmeyen-id` `404` ve `{"message":"Ürün bulunamadı"}` döndürür; backend çalışmaya devam eder.
- [ ] **MT-A3-006 - Yeniden başlatma** (`REQ-003`): Backend durdurulup açıldığında aynı 10 başlangıç ürünü yeniden gelir.
- [ ] **MT-A3-007 - Yazma kapsamı sınırı**: `POST`, `PUT`, `PATCH` ve `DELETE` ürün endpoint'leri uygulanmış veya README'de çalışıyor gibi gösterilmiş değildir.

### Aşama 4 - CRUD, validasyon ve hata yönetimi

Bu testleri çalıştırmadan önce README'deki komutla backend'i başlat. Windows PowerShell 5.1 ve PowerShell 7 ile uyumlu, kopyalanabilir request örnekleri [API dokümantasyonunda](./api.md#powershell-ile-hızlı-crud-zinciri) bulunur.

- [ ] **MT-A4-001 - Başlangıç listesi** (`REQ-014`): `GET /api/products` `200` ve 10 başlangıç ürünü döndürür.
- [ ] **MT-A4-002 - Ürün oluşturma** (`REQ-016`): Geçerli POST `201` ve oluşturulan ürün nesnesini döndürür.
- [ ] **MT-A4-003 - Backend kimliği** (`REQ-016`): Cevap dolu ve benzersiz bir `id` içerir; istemci kimliği belirleyemez.
- [ ] **MT-A4-004 - Oluşturulan ürünü okuma** (`REQ-015`, `REQ-016`): Yeni kimlikle GET `200` ve POST cevabındaki aynı ürünü döndürür.
- [ ] **MT-A4-005 - Oluşturulan ürünü listede görme** (`REQ-014`, `REQ-016`): Yeni ürün sonraki listede bulunur.
- [ ] **MT-A4-006 - Kısmi güncelleme** (`REQ-017`): Yalnız `price` gönderen PATCH `200` döndürür; fiyat değişir, gönderilmeyen alanlar korunur.
- [ ] **MT-A4-007 - Ürün silme** (`REQ-018`): DELETE `204` ve tamamen boş response body döndürür.
- [ ] **MT-A4-008 - Silinen ürünü okuma** (`REQ-019`): Silinen kimliğin GET isteği `404` ve JSON ürün-bulunamadı mesajı döndürür.
- [ ] **MT-A4-009 - Eksik ad** (`REQ-019`): `name` olmadan POST `400` ve `details.name` döndürür.
- [ ] **MT-A4-010 - Negatif fiyat** (`REQ-019`): Negatif `price` ile POST `400` ve `details.price` döndürür.
- [ ] **MT-A4-011 - Metin fiyat** (`REQ-019`): Metin türündeki `price` ile POST `400` ve `details.price` döndürür.
- [ ] **MT-A4-012 - Eksik kategori** (`REQ-019`): `category` olmadan POST `400` ve `details.category` döndürür.
- [ ] **MT-A4-013 - Boş güncelleme** (`REQ-019`): `{}` body ile PATCH `400` ve neyin eksik olduğunu açıklayan JSON döndürür.
- [ ] **MT-A4-014 - Bilinmeyen ürünü güncelleme** (`REQ-019`): Geçerli body ile bilinmeyen kimliğe PATCH `404` döndürür.
- [ ] **MT-A4-015 - Bilinmeyen ürünü silme** (`REQ-019`): Bilinmeyen kimliğe DELETE `404` döndürür.
- [ ] **MT-A4-016 - Bilinmeyen API route'u** (`REQ-019`): Bilinmeyen route `404`, JSON içerik türü ve `Endpoint bulunamadı` mesajı döndürür.
- [ ] **MT-A4-017 - İstemci kimliğini reddetme** (`REQ-016`, `REQ-019`): POST body içindeki `id` `400` ve backend-kimliği açıklamasıyla reddedilir.
- [ ] **MT-A4-018 - Geçersiz JSON** (`REQ-019`): Bozuk JSON body `400` ve `Geçersiz JSON gövdesi` mesajı döndürür; backend çalışmaya devam eder.
- [ ] **MT-A4-019 - Yeniden başlatma sınırı** (`REQ-003`): Backend yeniden başlayınca geçici CRUD değişiklikleri kaybolur ve 10 başlangıç ürünü geri gelir.
- [ ] **MT-A4-020 - Health gerileme kontrolü** (`REQ-002`, `REQ-022`): Bütün hata senaryolarından sonra `/api/health` hâlâ `200` ve `{"status":"ok"}` döndürür.

## 3. Ürün liste ve detay

- [ ] **MT-PRD-001 - Liste görünümü** (`REQ-004`, `REQ-020`): Backend'den gelen ürünler okunabilir biçimde listelenir.
- [ ] **MT-PRD-002 - Detaya geçiş** (`REQ-005`): Bir ürün seçildiğinde doğru ürünün detayları gösterilir.
- [ ] **MT-PRD-003 - Geçersiz detay kimliği** (`REQ-019`, `REQ-021`): Olmayan ürün yolu boş/kırık sayfa yerine anlaşılır geri bildirim verir.
- [ ] **MT-PRD-004 - Veri kaynağı** (`REQ-020`): Backend'deki görünür bir ürün değişikliği yeniden veri alındığında frontend'e yansır; ana ürün verisi frontend'e gömülü değildir.

## 4. Arama, filtre ve sıralama

- [ ] **MT-FND-001 - Arama eşleşmesi** (`REQ-006`): Eşleşen arama değeri yalnızca ilgili ürünleri gösterir.
- [ ] **MT-FND-002 - Arama eşleşmemesi** (`REQ-006`, `REQ-021`): Eşleşme yokken açık bir boş sonuç durumu görülür.
- [ ] **MT-FND-003 - Filtre** (`REQ-007`): Seçilen filtre yalnızca ölçüte uyan ürünleri bırakır; filtre temizlenince liste geri gelir.
- [ ] **MT-FND-004 - Birinci sıralama** (`REQ-008`): İlk sıralama seçeneğinin görünen ürün sırası beklenen ölçüte uyar.
- [ ] **MT-FND-005 - İkinci sıralama** (`REQ-008`): İkinci ve farklı sıralama seçeneğinin ürün sırası beklenen ölçüte uyar.
- [ ] **MT-FND-006 - Birleşik kullanım** (`REQ-006` - `REQ-008`): Arama, filtre ve sıralama birlikte kullanıldığında görünen sonuçların tamamı üç seçime de uyar.

## 5. Sepet

- [ ] **MT-CRT-001 - Sepete ekleme** (`REQ-009`): Bir ürün eklendiğinde doğru ürün ve adet sepet görünümünde yer alır.
- [ ] **MT-CRT-002 - Aynı ürünü tekrar ekleme** (`REQ-010`, `REQ-011`): Uygulamanın belgelenen davranışına göre adet doğru güncellenir ve yinelenen tutarsız satır oluşmaz.
- [ ] **MT-CRT-003 - Adet artırma/azaltma** (`REQ-010`, `REQ-011`): Yönetim kontrolleri adedi ve toplamı her işlemde doğru günceller.
- [ ] **MT-CRT-004 - Ürün kaldırma** (`REQ-010`, `REQ-011`): Hedef ürün kaldırılır; diğer sepet satırları değişmez ve toplam yeniden hesaplanır.
- [ ] **MT-CRT-005 - Toplam hesaplama** (`REQ-011`): Birden fazla ürün ve adet için görünen toplam, elle hesaplanan fiyat x adet toplamına eşittir.
- [ ] **MT-CRT-006 - Boş sepet** (`REQ-012`): İlk açılışta ve son ürün kaldırıldığında açık boş sepet mesajı görülür; geçersiz toplam görünmez.
- [ ] **MT-CRT-007 - Yenileme sınırı** (`BON-004`): Bonus seçilmediyse sayfa yenilemede sepetin sıfırlanmasının hata olmadığı dokümantasyonla uyumlu olduğu doğrulanır. Bonus seçildiyse kalıcılık ayrıca test edilir.

## 6. Loading, error ve empty durumları

- [ ] **MT-UI-001 - Yüklenme** (`REQ-021`): Yavaşlatılmış API isteği sırasında kullanıcıya yüklenme geri bildirimi gösterilir.
- [ ] **MT-UI-002 - Ağ/API hatası** (`REQ-021`): Backend kapalıyken veya istek hata verdiğinde anlaşılır hata durumu görünür; uygulama beyaz ekrana düşmez.
- [ ] **MT-UI-003 - Boş ürün koleksiyonu** (`REQ-021`): API boş liste döndürdüğünde “ürün yok” anlamı açıkça gösterilir.
- [ ] **MT-UI-004 - Hata sonrası kullanım** (`REQ-021`, `QLT-010`): Varsa yeniden deneme/geri dönüş yolu çalışır veya kullanıcı ne yapacağını anlayabilir.

## 7. Responsive kullanım

- [ ] **MT-RSP-001 - Dar ekran** (`REQ-025`): Yaklaşık 320-375 px genişlikte ürün liste, detay ve sepet temel işlemleri yatay taşma olmadan kullanılabilir.
- [ ] **MT-RSP-002 - Orta ekran** (`REQ-025`): Tablet benzeri genişlikte içerik üst üste binmez ve temel kontroller erişilebilirdir.
- [ ] **MT-RSP-003 - Geniş ekran** (`REQ-025`): Masaüstünde içerik okunabilir genişlikte, hizalı ve kullanılabilirdir.
- [ ] **MT-RSP-004 - Klavye ve görünür odak** (`QLT-010`): Temel bağlantı, form ve butonlara klavyeyle ulaşılır; odak görünürdür.

## 8. Dokümantasyon ve teslim

- [ ] **MT-DOC-001 - README kapsamı** (`REQ-023`): Ön koşullar, kurulum, frontend/backend çalıştırma ve temel kullanım adımları eksiksizdir.
- [ ] **MT-DOC-002 - API dokümantasyonu** (`REQ-024`): Beş CRUD işlemi, veri alanları, örnekler ve temel hata cevapları belgelenmiştir.
- [ ] **MT-DOC-003 - Git geçmişi** (`REQ-026`): Commit mesajları yapılan işi açıklar ve birbirinden anlamlı geliştirme adımlarını gösterir.
- [ ] **MT-DOC-004 - Gereksinim izlenebilirliği**: `REQ-001` - `REQ-026` için uygulama veya teslim belgesinde doğrulanabilir bir karşılık vardır.
- [ ] **MT-DOC-005 - Bonus ayrımı**: Uygulanan bonuslar açıkça “bonus” diye belirtilir; uygulanmayan bonuslar eksik zorunlu özellik gibi gösterilmez.
- [ ] **MT-DOC-006 - Son smoke test** (`REQ-022`): Temiz başlatmadan sonra ürün listeleme, detay, arama/filtre/sıralama, sepete ekleme ve temel API akışı çalışır.

## Bonus test alanı

Yalnızca ilgili bonus bilinçli olarak seçilip geliştirildiyse doldur:

- [ ] **MT-BON-001 - Favoriler** (`BON-001`): _Beklenen davranış ve kanıt daha sonra yazılacak._
- [ ] **MT-BON-002 - Fiyat aralığı filtresi** (`BON-002`): _Beklenen davranış ve kanıt daha sonra yazılacak._
- [ ] **MT-BON-003 - Sayfalama** (`BON-003`): _Beklenen davranış ve kanıt daha sonra yazılacak._
- [ ] **MT-BON-004 - Yenilemede sepet kalıcılığı** (`BON-004`): _Beklenen davranış ve kanıt daha sonra yazılacak._
- [ ] **MT-BON-005 - Basit loglama** (`BON-005`): _Beklenen davranış ve kanıt daha sonra yazılacak._
- [ ] **MT-BON-006 - Ürün yönetim arayüzü** (`BON-006`): _Beklenen davranış ve kanıt daha sonra yazılacak._

## Test özeti

| Tarih | Aşama/sürüm | Geçti | Kaldı | Bekliyor | Testi yapan | Not |
|---|---|---:|---:|---:|---|---|
| - | Aşama 1 - yalnızca dokümantasyon | 0 | 0 | Tümü | - | Uygulama henüz oluşturulmadı. |
| 2026-08-25 | Aşama 2 - otomatik kontroller | 13 | 0 | Kullanıcı manuel testleri | Codex | Kurulum, lint, build, syntax, iki dev server, health/CORS, yeniden başlatma ve tarayıcı konsolu doğrulandı. |
| 2026-08-25 | Aşama 3 - otomatik kontroller | 19 | 0 | Kullanıcı manuel testleri | Codex | Health, ürün liste/detay, veri kalitesi, JSON 404, kapsam sınırı, yeniden başlatma ve süreç temizliği doğrulandı. |
| 2026-08-26 | Aşama 4 - otomatik kontroller | 48 | 0 | Kullanıcı manuel testleri | Codex | 38 gerçek süreç/API doğrulaması, 7 validator sınır kontrolü, backend syntax, frontend lint ve son süreç/port temizliği geçti. |

## Aşama 2 otomatik doğrulama kaydı

Bu sonuçlar kullanıcının yukarıdaki manuel test kutularının yerine geçmez; Aşama 2 sırasında Codex'in gerçekten çalıştırdığı kontrolleri kaydeder.

| Kontrol | Sonuç | Kanıt özeti |
|---|---|---|
| Frontend bağımlılık kurulumu | Geçti | `npm install` tamamlandı; lockfile ve React/Vite paketleri doğrulandı. |
| Backend bağımlılık kurulumu | Geçti | `npm install` tamamlandı; lockfile, Express ve CORS paketleri doğrulandı. |
| Frontend lint | Geçti | `npm run lint` çıkış kodu `0`. |
| Frontend production build | Geçti | `npm run build` çıkış kodu `0`; Vite production çıktısı üretildi. |
| Backend syntax kontrolü | Geçti | `npm run check` çıkış kodu `0`. |
| Backend başlangıcı | Geçti | `npm start` ve README'deki `npm run dev` ayrı ayrı sunucuyu başlattı. |
| Frontend başlangıcı | Geçti | README'deki `npm run dev`, `http://localhost:5173` adresini açtı. |
| Health durum kodu | Geçti | Gerçek HTTP isteği `200` döndürdü. |
| Health JSON cevabı | Geçti | Cevap tam olarak `{"status":"ok"}` olarak ayrıştırıldı. |
| CORS başlığı | Geçti | İzin verilen origin `http://localhost:5173` olarak döndü. |
| Yeniden başlatma | Geçti | Backend durdurulup `npm run dev` ile yeniden açıldı; health kontrolü tekrar geçti. |
| React ekranı | Geçti | Proje başlığı ve “Frontend çalışıyor” durumu tarayıcı DOM'unda görünür bulundu. |
| Tarayıcı konsolu | Geçti | Yeni sayfa yüklemesinde error veya warning kaydı bulunmadı. |

## Aşama 3 otomatik doğrulama kaydı

Bu sonuçlar kullanıcının Aşama 3 manuel test kutularının yerine geçmez; gerçek backend süreci üzerinde çalıştırılan kontrolleri kaydeder.

| Kontrol | Sonuç | Kanıt özeti |
|---|---|---|
| Değişiklik öncesi backend syntax | Geçti | Aşama 2 kodu `npm run check` ile hatasız doğrulandı. |
| Değişiklik öncesi başlangıç/health | Geçti | Backend başladı; `/api/health` `200` ve `{"status":"ok"}` döndürdü. |
| Yeni backend dosyalarının syntax kontrolü | Geçti | Güncellenen `npm run check` bütün data/service/controller/route/middleware dosyalarında çıkış kodu `0` verdi. |
| Ürün liste durum kodu ve türü | Geçti | `/api/products` `200` ve `application/json` içerik türüyle dizi döndürdü. |
| Ürün ve kategori sayısı | Geçti | 10 ürün ve 6 benzersiz kategori bulundu. |
| Kimlik benzersizliği | Geçti | 10 ürünün 10 benzersiz kimliği vardı. |
| Temel alanlar ve fiyatlar | Geçti | Her üründe altı temel alan, dolu metinler, HTTPS görsel adresi ve pozitif sayısal fiyat doğrulandı. |
| Gerçek ürün detayı | Geçti | `p-001` isteği `200` döndürdü ve liste içindeki “Kablosuz Kulaklık” nesnesiyle eşleşti. |
| Bilinmeyen ürün | Geçti | `/api/products/bilinmeyen-id` `404` ve `{"message":"Ürün bulunamadı"}` döndürdü. |
| Hata sonrası sağlık | Geçti | 404 isteğinden sonra health endpoint'i tekrar `200` döndürdü. |
| Yazma route'larının yokluğu | Geçti | Ürün koleksiyonuna POST, PUT, PATCH ve DELETE isteklerinin tamamı `404` döndürdü. |
| Yeniden başlatma | Geçti | Backend durdurulup yeniden başlatıldı. |
| Başlangıç verisinin geri yüklenmesi | Geçti | Yeniden başlatmadan önce ve sonra liste 10 üründü; SHA-256 özeti aynı kaldı. |
| Süreç temizliği | Geçti | Geçici backend süreci kapatıldı ve port `3000` boş bırakıldı. |

## Aşama 4 otomatik doğrulama kaydı

Bu sonuçlar kullanıcının Aşama 4 manuel test kutularının yerine geçmez. Gerçek backend süreci iki kez başlatılmış, gerçek HTTP istekleri yapılmış ve süreçler test sonunda kapatılmıştır.

| Kontrol | Sonuç | Kanıt özeti |
|---|---|---|
| Değişiklik öncesi Aşama 3 kontrolü | Geçti | `npm run check`; health `200`; liste `200`/10 ürün; `p-001` detay `200`; bilinmeyen kimlik JSON `404`. |
| Backend syntax | Geçti | Güncel `npm run check` bütün app/server/data/error/validator/service/controller/route/middleware dosyalarında çıkış kodu `0` verdi. Backend'de ayrıca lint veya test script'i bulunmadı. |
| Frontend lint gerileme kontrolü | Geçti | Frontend değiştirilmedi; mevcut `npm run lint` yine de çalıştırıldı ve çıkış kodu `0` verdi. Frontend/backend paketlerinde test script'i bulunmadı. |
| Başlangıç veri kalitesi | Geçti | Liste 10 ürün/6 kategori içerdi; 10/10 kimlik benzersiz, bütün fiyatlar pozitif sonlu sayı ve temel alanlar doğru türdeydi. |
| Eski GET sözleşmeleri | Geçti | Health `200 {"status":"ok"}`; liste doğrudan JSON dizisi; `p-001` detayı listedeki nesneyle birebir eşleşti. |
| Ürün oluşturma | Geçti | POST `201`; gerçek üretilen kimlik `26ca50bf-6059-4ac7-9d35-f433319a01d8`; ürün detaydan geldi ve liste 10'dan 11'e çıktı. |
| Kimlik benzersizliği | Geçti | Yeni kimlik Node.js `randomUUID()` biçimindeydi; oluşturma sonrasında 11/11 kimlik benzersizdi. |
| Kısmi güncelleme | Geçti | Yalnız fiyat PATCH edildi; `200`, fiyat `1499`; ad, açıklama, kategori ve görsel adresi korundu. |
| Silme | Geçti | DELETE `204` ve response body tam `0` bayt; aynı kimliğin sonraki GET isteği `404 {"message":"Ürün bulunamadı"}`. |
| Oluşturma validasyonu | Geçti | Eksik ad, negatif fiyat, metin fiyat ve eksik kategori ayrı isteklerde `400`; ilgili alan `details` içinde açıklandı. |
| Validator sınırları | Geçti | 7/7: boşluk adı, sayısal kategori, sayısal açıklama/görsel, metin trim, isteğe bağlı alan varsayılanları ve nesne olmayan body doğru ele alındı. |
| Güncelleme validasyonu | Geçti | `{}` PATCH `400`; `details.body` en az bir güncellenebilir alan istedi. |
| Bulunamayan yazma işlemleri | Geçti | Bilinmeyen kimliğe geçerli PATCH ve DELETE ayrı ayrı `404 {"message":"Ürün bulunamadı"}` döndürdü. |
| Bilinmeyen API route'u | Geçti | `GET /api/bilinmeyen-route` `404`, `application/json` ve `{"message":"Endpoint bulunamadı"}` döndürdü. |
| Geçersiz JSON | Geçti | Sözdizimi bozuk POST body `400 {"message":"Geçersiz JSON gövdesi"}` döndürdü; süreç çalışmaya devam etti. |
| İstemci `id` alanı | Geçti | İstemci kimliği içeren POST `400`; `details.id` kimliğin backend tarafından üretildiğini belirtti. |
| Diğer bilinmeyen alan | Geçti | `stock` içeren POST `400`; `details.stock` alanı “Desteklenmeyen alan” dedi. |
| Kapsam sınırı | Geçti | PUT route'u eklenmedi; istek ortak JSON `404` cevabına gitti. Frontend dosyaları değiştirilmedi. |
| Güvenli 500 | Geçti | Gerçek `errorHandler`, beklenmeyen `Error("gizli-iç-hata")` için yalnız `500 {"message":"Sunucu hatası"}` üretti; iç mesaj ve stack sızmadı. |
| Hata sonrası gerileme kontrolü | Geçti | Tüm hata isteklerinden sonra health tekrar `200`, ürün listesi tekrar `200` ve 10 ürün döndürdü. |
| Yeniden başlatma/kalıcılık sınırı | Geçti | Geçici ürünle liste 11 oldu; süreç durdurulup başlatılınca ürün kayboldu ve liste 10 başlangıç ürününe döndü. |
| Süreç temizliği | Geçti | İki geçici backend süreci güvenli biçimde kapatıldı; son kontrolde port `3000` boştu. |
