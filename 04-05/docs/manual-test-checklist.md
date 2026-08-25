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
