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
- [ ] **MT-SET-003 - Frontend'i başlatma** (`REQ-001`, `REQ-022`): Belgelenen komut React uygulamasını açar ve ürün katalog ekranı görünür.
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

### Aşama 5 - Frontend API iletişimi, ürün listesi ve detay

Bu testlerde backend `http://localhost:3000`, frontend `http://localhost:5180` adresinde birlikte çalışmalıdır.

- [ ] **MT-A5-001 - Gerçek API listesi** (`REQ-004`, `REQ-020`): `/api/products` cevabındaki ürün sayısı ile `/` sayfasındaki kart sayısı aynıdır.
- [ ] **MT-A5-002 - Kart içeriği** (`REQ-004`): Her kartta ürün görseli/fallback, ad, kategori ve TRY biçimli fiyat okunur; bütün kart tek bir detay bağlantısıdır.
- [ ] **MT-A5-003 - Karttan detaya geçiş** (`REQ-005`): İlk karta tıklama `/products/{id}` adresine gider ve karttaki ürün adı detay başlığıyla eşleşir.
- [ ] **MT-A5-004 - Doğrudan detay ve yenileme** (`REQ-005`, `REQ-022`): Geçerli detay URL'si doğrudan açılır ve sayfa yenilenince aynı ürün yeniden API'den gelir.
- [ ] **MT-A5-005 - Bilinmeyen ürün** (`REQ-019`, `REQ-021`): `/products/bilinmeyen-id` “Ürün bulunamadı” ve çalışan “Ürünlere dön” bağlantısını gösterir; uygulama çökmez.
- [ ] **MT-A5-006 - Bilinmeyen frontend yolu** (`REQ-019`): `/bilinmeyen-sayfa` kontrollü “Sayfa bulunamadı” görünümü verir.
- [ ] **MT-A5-007 - Liste loading** (`REQ-021`): Ağ yavaşlatıldığında ürünler gelmeden önce skeleton kartlar görünür ve başarı/hata sonucunda kaybolur.
- [ ] **MT-A5-008 - Detay loading** (`REQ-021`): Ağ yavaşlatıldığında tek ürün gelmeden önce detay skeleton'ı görünür ve sonuçla yer değiştirir.
- [ ] **MT-A5-009 - Backend kapalı** (`REQ-021`, `QLT-010`): Backend'e ulaşılamadığında sonsuz loading yerine güvenli açıklama ve “Tekrar dene” düğmesi görünür.
- [ ] **MT-A5-010 - Yeniden deneme** (`REQ-021`): Backend açıldıktan sonra “Tekrar dene” ürün listesini yeniden getirir.
- [ ] **MT-A5-011 - Boş API listesi** (`REQ-021`): API `[]` döndürürse kart yerine “Henüz ürün bulunmuyor” görünür.
- [ ] **MT-A5-012 - Görsel fallback** (`REQ-004`, `QLT-008`): Bozuk/erişilemeyen `imageUrl` uygulamayı bozmaz ve “Görsel yok” fallback'i gösterir.
- [ ] **MT-A5-013 - 320 px responsive** (`REQ-025`, `QLT-003`): 320 px genişlikte iki kart sütunu vardır, metinler okunur ve yatay sayfa taşması oluşmaz.
- [ ] **MT-A5-014 - Geniş ekran responsive** (`REQ-025`): Geniş ekranda liste dört sütuna, detay görsel ve bilgi için iki sütuna geçer.
- [ ] **MT-A5-015 - Klavye ve focus** (`QLT-003`): Tab tuşuyla marka, ürünler ve kart bağlantılarına ulaşılır; focus görünür ve Enter doğru detayı açar.
- [ ] **MT-A5-016 - Tarayıcı konsolu** (`QLT-008`, `QLT-010`): Normal liste ve detay kullanımında açıklanamayan error kaydı yoktur.
- [ ] **MT-A5-017 - Kapsam sınırı**: Arama, filtre, sıralama, sepet, favori ve frontend CRUD yönetim arayüzü Aşama 5'te bulunmaz.
- [ ] **MT-A5-018 - Yata Market kimliği**: Header, ilk açılış yükleyicisi ve footer “Yata Market” adını; marka işareti `Y` harfini gösterir.
- [ ] **MT-A5-019 - Renkli tema** (`QLT-003`): Hero, marka, buton, kart vurgusu ve fiyatlarda mavi-mor-pembe gradient görünür; metin kontrastı okunabilir kalır.
- [ ] **MT-A5-020 - İlk açılış animasyonu** (`REQ-021`): Yeni sekmede kısa Yata Market yükleme perdesi ve ilerleme çubuğu görünür; yaklaşık 720 ms sonra içerik kullanıma açılır.
- [ ] **MT-A5-021 - Bileşen animasyonları** (`QLT-003`): Başlıklar, bölüm başlığı, kartlar, görseller, fiyatlar, durum panelleri ve detay parçaları kademeli giriş yapar; kart gecikmeleri sırayla artar.
- [ ] **MT-A5-022 - Route animasyonu** (`REQ-005`): Karttan detaya geçişte yeni sayfa üstten başlar ve detay görseli ile metni ayrı giriş animasyonu kullanır.
- [ ] **MT-A5-023 - Azaltılmış hareket** (`QLT-003`): İşletim sisteminde “hareketi azalt” açıkken dekoratif animasyonlar yaklaşık sıfır süreye iner ve içerik hemen kullanılabilir olur.

## 4. Arama, filtre ve sıralama

- [ ] **MT-FND-001 - Arama eşleşmesi** (`REQ-006`): Eşleşen arama değeri yalnızca ilgili ürünleri gösterir.
- [ ] **MT-FND-002 - Arama eşleşmemesi** (`REQ-006`, `REQ-021`): Eşleşme yokken açık bir boş sonuç durumu görülür.
- [ ] **MT-FND-003 - Filtre** (`REQ-007`): Seçilen filtre yalnızca ölçüte uyan ürünleri bırakır; filtre temizlenince liste geri gelir.
- [ ] **MT-FND-004 - Birinci sıralama** (`REQ-008`): İlk sıralama seçeneğinin görünen ürün sırası beklenen ölçüte uyar.
- [ ] **MT-FND-005 - İkinci sıralama** (`REQ-008`): İkinci ve farklı sıralama seçeneğinin ürün sırası beklenen ölçüte uyar.
- [ ] **MT-FND-006 - Birleşik kullanım** (`REQ-006` - `REQ-008`): Arama, filtre ve sıralama birlikte kullanıldığında görünen sonuçların tamamı üç seçime de uyar.

### Aşama 6 - Ürün arama, kategori filtresi ve fiyat sıralaması

Bu testlerde backend `http://localhost:3000`, frontend `http://localhost:5180` adresinde birlikte çalışmalıdır. Başlangıçta `10 / 10 ürün` görünür.

- [ ] **MT-A6-001 - Tam ad araması** (`REQ-006`): “Kablosuz Kulaklık” yazıldığında yalnız bu kart kalır ve sayaç `1 / 10 ürün` olur.
- [ ] **MT-A6-002 - Büyük/küçük harf ve Türkçe karakter** (`REQ-006`): “KULAKLIK” ve “kulaklık” aynı ürünü gösterir.
- [ ] **MT-A6-003 - Kısmi ad araması** (`REQ-006`): “kulak” yazıldığında “Kablosuz Kulaklık” bulunur.
- [ ] **MT-A6-004 - Boş arama** (`REQ-006`): Arama alanı temizlendiğinde diğer kontroller izin verdiği ölçüde ürünler geri gelir.
- [ ] **MT-A6-005 - Sonuç bulunamadı** (`REQ-006`, `REQ-021`): “olmayan ürün” yazıldığında kart görünmez; hata yerine “Aramana uygun ürün bulunamadı” ve “Tüm ürünleri göster” görünür.
- [ ] **MT-A6-006 - Dinamik kategori seçenekleri** (`REQ-007`, `REQ-020`): Kategori listesinde API verisindeki 6 benzersiz kategori ve “Tüm kategoriler” vardır.
- [ ] **MT-A6-007 - Kategori filtresi** (`REQ-007`): “Spor” seçildiğinde yalnız “Paslanmaz Çelik Matara” ve “Kaymaz Yoga Matı” kalır.
- [ ] **MT-A6-008 - Artan fiyat** (`REQ-008`): “Fiyat: düşükten yükseğe” seçildiğinde ilk fiyat `₺479`, son fiyat `₺3.299` olur.
- [ ] **MT-A6-009 - Azalan fiyat** (`REQ-008`): “Fiyat: yüksekten düşüğe” seçildiğinde ilk fiyat `₺3.299`, son fiyat `₺479` olur.
- [ ] **MT-A6-010 - Birleşik kullanım** (`REQ-006` - `REQ-008`): “mat” araması + “Spor” kategorisi + azalan fiyat seçildiğinde önce “Kaymaz Yoga Matı”, sonra “Paslanmaz Çelik Matara” görünür; üç seçim de korunur.
- [ ] **MT-A6-011 - Toplu temizleme** (`REQ-006` - `REQ-008`): “Seçimleri temizle” bütün kontrolleri başlangıç değerlerine ve listeyi `10 / 10 ürün` durumuna döndürür.
- [ ] **MT-A6-012 - Ham sıra korunumu** (`QLT-005`): Bir fiyat sırası seçilip “Seçimleri temizle” denince başlangıç API sırası geri gelir.
- [ ] **MT-A6-013 - Responsive kontroller** (`REQ-025`): 320 px genişlikte kontroller tek sütun, ürünler iki sütundur; yatay taşma yoktur.
- [ ] **MT-A6-014 - Klavye ve etiketler** (`QLT-003`, `QLT-010`): Arama, kategori, sıralama ve temizleme kontrolüne Tab ile ulaşılır; her alanın görünür etiketi ve focus halkası vardır.
- [ ] **MT-A6-015 - Route sonrası state sınırı**: Ürün detayına gidip listeye dönüldüğünde arama, kategori ve sıralama başlangıç değerlerine döner; bu davranış README ile uyumludur.
- [ ] **MT-A6-016 - Kapsam sınırı**: Fiyat aralığı, sayfalama, backend query parametreleri, sepet ve favori eklenmemiştir.

## 5. Sepet

- [ ] **MT-CRT-001 - Sepete ekleme** (`REQ-009`): Bir ürün eklendiğinde doğru ürün ve adet sepet görünümünde yer alır.
- [ ] **MT-CRT-002 - Aynı ürünü tekrar ekleme** (`REQ-010`, `REQ-011`): Uygulamanın belgelenen davranışına göre adet doğru güncellenir ve yinelenen tutarsız satır oluşmaz.
- [ ] **MT-CRT-003 - Adet artırma/azaltma** (`REQ-010`, `REQ-011`): Yönetim kontrolleri adedi ve toplamı her işlemde doğru günceller.
- [ ] **MT-CRT-004 - Ürün kaldırma** (`REQ-010`, `REQ-011`): Hedef ürün kaldırılır; diğer sepet satırları değişmez ve toplam yeniden hesaplanır.
- [ ] **MT-CRT-005 - Toplam hesaplama** (`REQ-011`): Birden fazla ürün ve adet için görünen toplam, elle hesaplanan fiyat x adet toplamına eşittir.
- [ ] **MT-CRT-006 - Boş sepet** (`REQ-012`): İlk açılışta ve son ürün kaldırıldığında açık boş sepet mesajı görülür; geçersiz toplam görünmez.
- [ ] **MT-CRT-007 - Yenilemede kalıcılık** (`BON-004`): Sepette ürün varken sayfa yenilendiğinde aynı ürünler, adetler ve toplamlar geri gelir.

### Aşama 7 - Uygulanacak kullanıcı testleri

Bu kontroller kullanıcı tarafından yapılacaktır. Başlamadan önce backend `http://localhost:3000`, frontend `http://localhost:5180` adresinde çalışmalıdır.

- [ ] **MT-A7-001 - Katalogdan hızlı ekleme** (`REQ-009`): Ana sayfada ürün detayına girmeden bir kartın “Sepete ekle” düğmesine basınca header rozeti `1` olur.
- [ ] **MT-A7-002 - Katalog kontrolüne dönüşme** (`REQ-010`): Ürün eklenince karttaki düğmenin yerini **çöp kutusu | 1 | +** kontrolü alır. `+` tıklanınca orta değer ve header rozeti `2` olur; sepette iki satır oluşmaz.
- [ ] **MT-A7-003 - Detayda ortak kontrol** (`REQ-009`, `REQ-010`): Ürün detayında ilk eklemeden sonra aynı **çöp kutusu | adet | +** kontrolü görünür. `+` mevcut adedi, çöp kutusu ise ürünü sepetten tamamen kaldırır.
- [ ] **MT-A7-004 - Ortak state** (`REQ-009` - `REQ-011`): Liste, detay ve sepet sayfaları arasında geçiş yapıldığında yenileme yapılmadığı sürece aynı sepet adedi korunur.
- [ ] **MT-A7-005 - Sepette artırma** (`REQ-010`, `REQ-011`): Sepet satırındaki `+` her tıklamada yalnız ilgili ürünün adedini, rozetini, satır toplamını ve genel toplamı artırır.
- [ ] **MT-A7-006 - Sepette azaltma** (`REQ-010`, `REQ-011`): Adet `2` veya daha fazlayken eksi kontrolü adedi bir azaltır ve toplamları doğru günceller.
- [ ] **MT-A7-007 - Son adette kaldırma** (`REQ-010`, `REQ-011`): Adet `1` olduğunda eksi yerine çöp kutusu görünür; tıklanınca yalnız o ürün satırı kaldırılır, diğer ürünler ve sepet korunur.
- [ ] **MT-A7-008 - Doğrudan kaldırma** (`REQ-010`): Satırdaki “Kaldır” düğmesi hedef ürünü siler ve diğer satırlara dokunmaz.
- [ ] **MT-A7-009 - Toplam hesabı** (`REQ-011`): En az iki farklı ürün ve farklı adetlerle satır toplamları `fiyat × adet`, ara toplam ise bütün satırların toplamına eşittir.
- [ ] **MT-A7-010 - Sepeti temizleme** (`REQ-010`): “Sepeti temizle” bütün satırları kaldırır, rozeti sıfırlar ve boş sepet görünümünü açar.
- [ ] **MT-A7-011 - Boş sepet** (`REQ-012`): Son ürün kaldırıldığında anlaşılır boş sepet mesajı ve kataloğa dönüş bağlantısı görünür.
- [ ] **MT-A7-012 - Yenilemede kalıcılık** (`BON-004`): Aşama 11A sonrasında sepette ürün varken tarayıcı yenilenince ürünler ve adetler korunur.
- [ ] **MT-A7-013 - Klavye erişimi** (`QLT-010`): Tab ile hızlı ekleme, sepet bağlantısı, adet, kaldırma ve temizleme kontrollerine ulaşılır; Enter/Space ile çalışırlar ve görünür odak vardır.
- [ ] **MT-A7-014 - Dar ekran** (`REQ-025`): 320-375 px genişlikte kart hızlı ekleme düğmeleri, sepet satırları, adet kontrolleri ve özet yatay taşma olmadan kullanılabilir.

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

### Aşama 8 - Kullanıcının yapacağı UI ve erişilebilirlik kontrolleri

Bu kontroller kullanıcı tarafından yapılacaktır. Codex, kullanıcının önceki talebi nedeniyle Aşama 8 sonrasında lint, build, tarayıcı veya otomatik erişilebilirlik testi çalıştırmamıştır.

- [ ] **MT-A8-001 - Liste loading** (`REQ-021`): Ağ `Slow 3G` yapıldığında ürün kartlarının yerini ve oranını taklit eden skeleton’lar görünür; boş beyaz ekran oluşmaz.
- [ ] **MT-A8-002 - Detay loading** (`REQ-021`): Yavaş ağda görsel, başlık, fiyat, açıklama, eylem ve metadata yerlerini temsil eden detay skeleton’ı görünür.
- [ ] **MT-A8-003 - Liste error** (`REQ-021`): Backend kapalıyken katalog teknik hata/stack yerine Türkçe bağlantı mesajı ve “Yeniden dene” düğmesi gösterir.
- [ ] **MT-A8-004 - Çalışan retry** (`REQ-021`): Backend yeniden açıldıktan sonra aynı düğmeye basınca yeni istek yapılır ve ürünler görünür.
- [ ] **MT-A8-005 - Detay error** (`REQ-021`): Backend kapalıyken geçerli bir ürün detay adresi kullanıcı dostu hata ve yeniden deneme gösterir.
- [ ] **MT-A8-006 - Boş API listesi** (`REQ-021`): API geçerli `[]` döndürdüğünde “Henüz ürün bulunmuyor” görünür; bu durum hata görünümüyle karışmaz.
- [ ] **MT-A8-007 - No results** (`REQ-006`, `REQ-007`, `REQ-021`): Eşleşmeyen aramada aranan kelime, açıklama ve “Tüm ürünleri göster” eylemi görünür; eylem kontrolleri temizler.
- [ ] **MT-A8-008 - Ürün not found** (`REQ-005`, `REQ-021`): `/products/bilinmeyen-id` “Ürün bulunamadı” ve ürünlere dönüş bağlantısı gösterir.
- [ ] **MT-A8-009 - Route not found** (`REQ-021`): `/bilinmeyen-sayfa` “Sayfa bulunamadı” ve ürünlere dönüş bağlantısı gösterir.
- [ ] **MT-A8-010 - Görsel fallback** (`QLT-010`): Geçersiz görsel URL’sinde 1:1 görsel alanı bozulmaz; ikon ve “Görsel yok” metni görünür.
- [ ] **MT-A8-011 - 320 px katalog** (`REQ-025`): Ürünler iki sütun, kontroller tek sütun olur; hızlı sepet kontrolü kırpılmaz ve yatay scrollbar oluşmaz.
- [ ] **MT-A8-012 - 320 px detay** (`REQ-025`): Görsel, ürün bilgisi ve sepet kontrolü dikey dizilir; bütün metin ve düğmeler erişilebilir kalır.
- [ ] **MT-A8-013 - 320 px sepet** (`REQ-025`): Ürün adı, kaldırma, adet seçici, satır toplamı ve özet üst üste binmez; yatay scrollbar oluşmaz.
- [ ] **MT-A8-014 - 768 px tablet** (`REQ-025`): Katalog üç sütun olur; filtre kontrolleri ve detay/sepet düzenleri kırpılmadan kullanılabilir.
- [ ] **MT-A8-015 - 1280 px masaüstü** (`REQ-025`): Katalog dört sütun, detay iki sütun ve sepet özeti sağda sticky görünür.
- [ ] **MT-A8-016 - Skip link** (`QLT-010`): Sayfa açıldıktan sonra ilk `Tab` ile “Ana içeriğe geç” görünür; Enter ana içeriğe taşır.
- [ ] **MT-A8-017 - Klavye sırası** (`QLT-010`): Logo, ürünler, sepet, arama, select’ler, kart bağlantısı, sepet eylemleri ve retry düğmesi Tab/Shift+Tab ile mantıklı sırada erişilir.
- [ ] **MT-A8-018 - Görünür focus** (`QLT-010`): Klavyeyle odaklanan bağlantı, düğme, input ve select üzerinde yalnız renk değişimine bağlı olmayan belirgin dış çizgi görünür.
- [ ] **MT-A8-019 - Ekran okuyucu bilgileri** (`QLT-010`): Aktif navigasyon, loading/error mesajları ve sepet adet değişiklikleri erişilebilir ad veya durum mesajı olarak duyurulur.
- [ ] **MT-A8-020 - Azaltılmış hareket** (`QLT-003`): İşletim sisteminde “hareketi azalt” açıldığında skeleton shimmer ve dekoratif giriş hareketleri yaklaşık sıfır süreye iner.
- [ ] **MT-A8-021 - Yakınlaştırma** (`REQ-025`, `QLT-010`): Tarayıcı %200 yakınlaştırmada temel içerik ve eylemler kaybolmadan kullanılabilir.
- [ ] **MT-A8-022 - Önceki işlevler** (`REQ-004` - `REQ-012`): Liste, detay, arama, filtre, iki fiyat sırası, katalog/detaydan sepete ekleme, adet, kaldırma ve toplam davranışları aynı şekilde çalışır.

### Aşama 9 - Kullanıcının yapacağı manuel kalite kontrolleri

Bu bölüm **Codex tarafından çalıştırılmadı, kullanıcı manuel olarak yapmalı**. Otomatik test, lint ve build sonuçları aşağıdaki otomatik doğrulama kaydında ayrıdır.

- [ ] **MT-A9-001 - Test komutlarını tekrar çalıştırma**: Backend ve frontend klasörlerinde ayrı ayrı `npm test` çalıştır; sırasıyla `11 pass / 0 fail` ve `21 pass / 0 fail` gör.
- [ ] **MT-A9-002 - Kalite komutları**: Backend'de `npm run check`; frontend'de `npm run lint` ve `npm run build` çalıştır; bütün komutlar exit code `0` ile bitmeli.
- [ ] **MT-A9-003 - Testin hatayı yakaladığını görme**: Yalnız deneme için bir testte beklenen değeri değiştir, `npm test` ile testin kaldığını gör ve değişikliği hemen geri al; tekrar çalıştırınca bütün testler geçmeli.
- [ ] **MT-A9-004 - Uygulamayı başlatma** (`REQ-022`): İki terminalde backend ve frontend'i README komutlarıyla başlat; `http://localhost:3000/api/health` ve `http://localhost:5180` açılmalı.
- [ ] **MT-A9-005 - Backend kapalı hata görünümü** (`REQ-021`): Frontend açıkken backend'i durdurup sayfayı yenile; sonsuz loading yerine Türkçe hata ve çalışan yeniden deneme görünmeli. Backend'i yeniden başlatıp düğmeyle ürünleri geri getir.
- [ ] **MT-A9-006 - CRUD zinciri** (`REQ-014` - `REQ-019`): [API belgesindeki PowerShell CRUD zincirini](./api.md#powershell-ile-hızlı-crud-zinciri) uygula; oluşturma, kısmi güncelleme, silme ve silinen kayıtta 404 sonuçlarını gör.
- [ ] **MT-A9-007 - Birleşik katalog kontrolü** (`REQ-006` - `REQ-008`): Ana sayfada `mat` ara, `Spor` seç ve fiyatı yüksekten düşüğe sırala; Yoga Matı önce, Matara sonra görünmeli.
- [ ] **MT-A9-008 - Sepet toplam örneği** (`REQ-009` - `REQ-011`): API üzerinden fiyatları `100` ve `75` olan iki geçici test ürünü oluşturup sayfayı yenile. İlk üründen 2, ikinci üründen 1 adet sepete ekle; toplam adet `3`, genel toplam `₺275` olmalı.
- [ ] **MT-A9-009 - Sepet sınırları** (`REQ-010` - `REQ-012`): Aynı ürün yeni satır açmadan artmalı; adet `1` iken çöp kutusu ürünü kaldırmalı; son ürün kalkınca boş sepet görünmeli.
- [ ] **MT-A9-010 - Responsive görünüm** (`REQ-025`): Tarayıcı geliştirici araçlarında yaklaşık 320, 768 ve 1280 px genişliklerde liste, detay ve sepeti kontrol et; yatay taşma ve erişilemeyen temel eylem olmamalı.
- [ ] **MT-A9-011 - Klavye ve focus** (`QLT-010`): Fare kullanmadan Tab, Shift+Tab, Enter ve Space ile navigasyon, filtre, ürün ve sepet kontrollerini kullan; odak halkası görünmeli.
- [ ] **MT-A9-012 - Konsol ve terminal** (`QLT-008`): Normal kullanıcı akışında tarayıcı konsolunda ve iki terminalde açıklanamayan error/stack kaydı bulunmamalı.

### Aşama 10 - Son manuel teslim provası

**Bu manuel testler Codex tarafından çalıştırılmadı.** Kutuları yalnız beklenen sonucu kendin gördükten sonra işaretle.

| Kimlik | Hazırlık | URL | İşlem | Beklenen sonuç |
|---|---|---|---|---|
| MT-A10-001 | Yeni veya temiz bir klasörde repository hazır olsun | - | README'deki sırayla backend ve frontend için `npm ci` çalıştır | İki kurulum da hatasız tamamlanır; ek veritabanı veya gizli ayar gerekmez |
| MT-A10-002 | İki terminal aç | `http://localhost:3000/api/health`, `http://localhost:5180` | Backend ve frontend'i README komutlarıyla başlat | Health `200`/`{"status":"ok"}`; Yata Market katalog ekranı açılır |
| MT-A10-003 | İki uygulama açık | `/`, `/products/p-001`, `/products/bilinmeyen-id` | Ürün kartını aç, doğrudan detaya git ve bilinmeyen kimliği dene | Liste ve doğru detay görünür; bilinmeyen ürün kontrollü mesaj gösterir |
| MT-A10-004 | Katalog açık | `/` | `mat` ara, `Spor` seç, iki fiyat sırasını ayrı ayrı ve birlikte dene | Sonuçlar arama/filtreye uyar; fiyat sırası doğru değişir; boş sonuç hata sayılmaz |
| MT-A10-005 | Sepet boş | `/`, `/products/p-001`, `/cart` | Katalogdan ve detaydan ekle; artır, azalt, kaldır ve sepeti temizle | Ortak adet korunur; son adette silme görünür; son ürün kalkınca boş sepet açılır |
| MT-A10-006 | Fiyatları 100 ve 75 olan iki geçici ürün API ile oluşturulmuş olsun | `/`, `/cart` | İlk ürünü 2, ikinci ürünü 1 adet ekle | Toplam adet `3`, genel toplam `₺275` olur |
| MT-A10-007 | Frontend açık | `/` ve geçerli detay URL'si | Backend'i durdur, sayfayı yenile; sonra backend'i açıp “Yeniden dene”ye bas | Sonsuz loading olmaz; güvenli hata görünür ve retry ürünleri geri getirir |
| MT-A10-008 | Backend açık | `http://localhost:3000` | `docs/api.md` içindeki PowerShell CRUD zincirini çalıştır | Kodlar sırasıyla `200`, `201`, `200`, `200`, `204`, `404`, `400`, `400`, `200` olur |
| MT-A10-009 | Tarayıcı geliştirici araçları açık | `/`, `/products/p-001`, `/cart` | 320, 768 ve 1280 px genişliklerde temel akışları dene | Yatay taşma, kırpılan içerik veya erişilemeyen temel eylem olmaz |
| MT-A10-010 | Fareyi kullanma | Tüm frontend route'ları | Tab, Shift+Tab, Enter ve Space ile gezin | Sıra mantıklıdır; focus görünür; buton ve bağlantılar klavyeyle çalışır |
| MT-A10-011 | DevTools Console ve iki terminal görünür | Tüm temel akışlar | Liste, detay, arama ve sepeti kullan | Açıklanamayan error, warning veya stack trace oluşmaz |
| MT-A10-012 | Manuel testler tamamlanmış | - | `git status` ve `git log --oneline` incele; yalnız istenen dosyaları seçip commit et | Gizli/üretilmiş dosya yoktur; çalışma ağacı teslim için bilinçli ve açıklanabilir durumdadır |

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
- [ ] **MT-BON-004A - Yenilemede sepet kalıcılığı** (`BON-004`): İki farklı ürünü farklı adetlerle sepete ekle, görünen adet ve toplamları not et, sayfayı yenile. Aynı satırlar, adetler, rozet ve toplamlar geri gelmelidir.
- [ ] **MT-BON-004B - Ürün kaldırma kaydı** (`BON-004`): Ürünlerden birini kaldırıp sayfayı yenile. Kaldırılan ürün geri gelmemeli; diğer ürün korunmalıdır.
- [ ] **MT-BON-004C - Sepeti temizleme kaydı** (`BON-004`): “Sepeti temizle”ye basıp sayfayı yenile. Boş sepet görünümü korunmalıdır.
- [ ] **MT-BON-004D - Uygulamayı yeniden açma** (`BON-004`): Sepete ürün ekle, frontend sekmesini kapatıp aynı `http://localhost:5180` adresini yeniden aç. Tarayıcı verisi temizlenmediyse sepet geri gelmelidir.
- [ ] **MT-BON-004E - Bozuk storage verisi** (`BON-004`): DevTools → Application → Local Storage → `http://localhost:5180` altında `yata-market-cart` değerini `{bozuk-json` yapıp sayfayı yenile. Uygulama çökmemeli ve güvenli boş sepet görünmelidir.
- [ ] **MT-BON-005 - Basit loglama** (`BON-005`): _Beklenen davranış ve kanıt daha sonra yazılacak._
- [ ] **MT-BON-006 - Ürün yönetim arayüzü** (`BON-006`): _Beklenen davranış ve kanıt daha sonra yazılacak._

## Test özeti

| Tarih | Aşama/sürüm | Geçti | Kaldı | Bekliyor | Testi yapan | Not |
|---|---|---:|---:|---:|---|---|
| - | Aşama 1 - yalnızca dokümantasyon | 0 | 0 | Tümü | - | Uygulama henüz oluşturulmadı. |
| 2026-08-25 | Aşama 2 - otomatik kontroller | 13 | 0 | Kullanıcı manuel testleri | Codex | Kurulum, lint, build, syntax, iki dev server, health/CORS, yeniden başlatma ve tarayıcı konsolu doğrulandı. |
| 2026-08-25 | Aşama 3 - otomatik kontroller | 19 | 0 | Kullanıcı manuel testleri | Codex | Health, ürün liste/detay, veri kalitesi, JSON 404, kapsam sınırı, yeniden başlatma ve süreç temizliği doğrulandı. |
| 2026-08-26 | Aşama 4 - otomatik kontroller | 48 | 0 | Kullanıcı manuel testleri | Codex | 38 gerçek süreç/API doğrulaması, 7 validator sınır kontrolü, backend syntax, frontend lint ve son süreç/port temizliği geçti. |
| 2026-08-26 | Aşama 5 - otomatik kontroller | 23 | 0 | Kullanıcı manuel testleri | Codex | Frontend lint/build, gerçek API ön kontrolleri, görünür liste/detay/404, loading, 320 px responsive, backend-kapalı, boş liste, konsol ve süreç temizliği geçti. |
| 2026-08-26 | Aşama 5 - Yata Market görsel revizyonu | 10 | 0 | Kullanıcı manuel testleri | Codex | Marka, gradient tema, ilk yükleyici, 10 kademeli kart, detay/route animasyonları, mobil taşma, lint ve build geçti. |
| 2026-08-26 | Aşama 6 - otomatik kontroller | 18 | 0 | Kullanıcı manuel testleri | Codex | Saf türetme fonksiyonu, lint/build, gerçek API, arama/kategori/iki sıra/birleşik kullanım, boş sonuç, temizleme, erişilebilir etiketler, 320 px responsive ve konsol doğrulandı. |
| 2026-08-26 | Aşama 7 - manuel kontrole bağlı | 0 | 0 | 14 kullanıcı testi | Kullanıcı | Kullanıcının isteğiyle son Aşama 7 değişikliklerinden sonra otomatik test çalıştırılmadı. |
| 2026-08-26 | Aşama 8 - manuel kontrole bağlı | 0 | 0 | 22 kullanıcı testi | Kullanıcı | UI durumları, üç viewport ve temel erişilebilirlik kontrolleri kullanıcıya bırakıldı; Codex otomatik test çalıştırmadı. |
| 2026-08-27 | Aşama 9 - otomatik kontroller | 35 | 0 | 12 kullanıcı testi | Codex + Kullanıcı | 32 otomatik test, backend syntax, frontend lint ve production build geçti; tarayıcı ve görsel kontroller kullanıcıya bırakıldı. |
| 2026-08-28 | Aşama 10 - otomatik teslim denetimi | 10 kontrol | 0 | 12 kullanıcı testi | Codex + Kullanıcı | Temiz kurulum, 32 test, syntax, lint, build, API smoke, link, izlenebilirlik ve Git hijyeni denetlendi; manuel teslim provası bekliyor. |
| 2026-08-28 | Aşama 11A - sepet kalıcılığı bonusu | 31 frontend + 11 backend testi | 0 | 5 kullanıcı testi | Codex + Kullanıcı | 10 storage testi dahil bütün testler, frontend lint/build ve backend syntax kontrolü geçti; gerçek tarayıcı yenilemesi kullanıcıya bırakıldı. |

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

## Aşama 5 otomatik doğrulama kaydı

Bu sonuçlar kullanıcının Aşama 5 manuel test kutularının yerine geçmez. Mevcut kullanıcı backend'i salt okunur isteklerle kontrol edilmiş; Codex'in başlattığı frontend ve sahte API süreçleri test sonunda kapatılmıştır.

| Kontrol | Sonuç | Kanıt özeti |
|---|---|---|
| Değişiklik öncesi backend | Geçti | `npm run check`; health `200`; liste 10 ürün; `p-001` detay listeyle eşleşti; bilinmeyen ürün JSON `404`. |
| Değişiklik öncesi frontend | Geçti | Mevcut Aşama 2 ekranında `npm run lint` ve `npm run build` çıkış kodu `0`. |
| React Router kurulumu | Geçti | Resmî `react-router` paketi kuruldu, `package-lock.json` güncellendi ve npm denetimi 0 güvenlik açığı bildirdi. |
| Güncel frontend lint | Geçti | `npm run lint` çıkış kodu `0`. |
| Güncel production build | Geçti | `npm run build` 87 modülü dönüştürdü ve `dist/` çıktısını başarıyla üretti. |
| API-kart sayısı | Geçti | Gerçek `/api/products` 10 ürün, görünür katalog 10 `.product-card__link` üretti. |
| Karttan detay | Geçti | “Kablosuz Kulaklık” kartı `/products/p-001` adresine gitti; başlık ve ürün kodu eşleşti. |
| Doğrudan detay yenilemesi | Geçti | `/products/p-001` yenilendi; aynı başlık ve çalışan “Ürünlere dön” bağlantısı yeniden göründü. |
| Bilinmeyen ürün | Geçti | `/products/bilinmeyen-id` “Ürün bulunamadı” ve katalog geri dönüşü gösterdi. |
| Bilinmeyen frontend route'u | Geçti | `/bilinmeyen-sayfa` “Sayfa bulunamadı” gösterdi. |
| 320 px responsive | Geçti | Grid `143px 143px` iki sütun; `innerWidth` ve `scrollWidth` 320 px; yatay sayfa taşması yok. |
| Geniş ekran responsive | Geçti | 1280 px görünümde grid dört sütun; detay görsel ve bilgi olarak iki sütun görsel denetimden geçti. |
| Yavaş API/loading | Geçti | 1,5 saniye gecikmeli geçici API sırasında 8 skeleton kart ve `aria-busy="true"` görüldü; cevap sonrası skeleton sayısı 0 oldu. |
| Backend kapalı | Geçti | Ayrı frontend ulaşılamayan `3999` portuna yönlendirildi; güvenli mesaj ve “Tekrar dene” göründü, skeleton sayısı 0'a indi. |
| Yeniden deneme | Geçti | Düğme yeni isteği tetikledi; backend hâlâ kapalıyken kontrollü hata görünümü yeniden oluştu. |
| Boş liste | Geçti | Geçici API `[]` döndürdü; “Henüz ürün bulunmuyor” göründü ve kart sayısı 0 kaldı. |
| Tarayıcı konsolu | Geçti | Gerçek backend'e bağlı temiz liste sayfasında error kaydı bulunmadı. |
| Kapsam sınırı | Geçti | Frontend ürün sabiti, arama, filtre, sıralama, sepet, favori, yönetim CRUD'u ve kalıcılık eklenmedi; backend kaynakları değiştirilmedi. |
| Süreç temizliği | Geçti | Codex'in açtığı `5173`, `5174`, `5175` frontend ve `3998` sahte API portları kapatıldı; kullanıcı backend'i `3000` portunda korunarak açık bırakıldı. |

## Aşama 5 Yata Market görsel revizyon doğrulama kaydı

| Kontrol | Sonuç | Kanıt özeti |
|---|---|---|
| Marka metni | Geçti | Header, yükleme perdesi ve footer “Yata Market”; marka işareti `Y` gösterdi. |
| İlk sayfa yükleyicisi | Geçti | Yeni sekmede `.page-loader` sayısı 1 ve yükleyici marka metni “Yata Market” bulundu; 720 ms sonunda bileşen DOM'dan kalktı. |
| Renkli hero | Geçti | Hesaplanan hero arka planı mavi, mor ve pembe radial/linear gradient katmanlarını içerdi. |
| Ortam ışıkları | Geçti | Arka planda üç hareketli `.theme-orb` bileşeni bulundu. |
| Kart animasyonları | Geçti | 10/10 kart `component-enter--card` kullandı; ilk dört gecikme `330`, `385`, `440`, `495` ms olarak kademeli arttı. |
| Detay animasyonları | Geçti | Route `pageEnter`, detay `componentRise`, medya `detailMediaEnter` ve içerik `componentRise` animasyonunu kullandı. |
| Route scroll başlangıcı | Geçti | `/products/p-001` geçişinden sonra detay sayfası `scrollY = 0` ile başladı. |
| 320 px responsive | Geçti | Marka okunur, grid iki adet `143px` sütun; `innerWidth = scrollWidth = 320` ve 10 animasyonlu kart bulundu. |
| Erişilebilir hareket sınırı | Geçti | `prefers-reduced-motion` media query'si animasyon ve geçiş sürelerini `0.01ms`, tekrar sayısını `1` yapıyor. |
| Lint/build | Geçti | Görsel revizyon sonrası ESLint ve Vite production build çıkış kodu `0`; 88 modül dönüştürüldü. |

## Aşama 6 otomatik doğrulama kaydı

Bu sonuçlar kullanıcının Aşama 6 manuel test kutularının yerine geçmez. Saf fonksiyonlar Node.js ile, kullanıcı arayüzü gerçek backend'e bağlı in-app tarayıcıda doğrulanmıştır.

| Kontrol | Sonuç | Kanıt özeti |
|---|---|---|
| Değişiklik öncesi frontend | Geçti | `npm run lint` ve `npm run build` çıkış kodu `0`; Aşama 5 kaynakları 88 modülle derlendi. |
| Değişiklik öncesi backend | Geçti | `npm run check` çıkış kodu `0`; health `ok`, `p-001` detayı doğru ve API kategorileri kullanılabilir durumdaydı. |
| Güncel frontend lint | Geçti | `npm run lint` çıkış kodu `0`. |
| Güncel production build | Geçti | Vite 91 modülü başarıyla dönüştürdü; build çıkış kodu `0`. |
| Dinamik kategoriler | Geçti | Saf fonksiyon API'nin 6 benzersiz kategorisini Türkçe sıralı üretti; tarayıcıda aynı 6 seçenek göründü. |
| Büyük/küçük harf araması | Geçti | `KULAKLIK` ve `kulaklik` aynı `p-001` ürününü verdi; tarayıcıda 1 kart ve `1 / 10 ürün` görüldü. |
| Kısmi arama | Geçti | `kulak` yalnız “Kablosuz Kulaklık” kartını bıraktı. |
| Sonuç bulunamadı | Geçti | `olmayan ürün` için kart sayısı `0`; ayrı boş sonuç başlığı ve “Tüm ürünleri göster” düğmesi görünürdü. |
| Kategori filtresi | Geçti | “Spor” yalnız `p-006` ve `p-007` ürünlerini bıraktı. |
| Artan fiyat | Geçti | İlk/son fiyat `479 / 3299`; tarayıcıda `₺479 / ₺3.299`. |
| Azalan fiyat | Geçti | İlk/son fiyat `3299 / 479`; tarayıcıda `₺3.299 / ₺479`. |
| Birleşik kullanım | Geçti | `mat` + `Spor` + azalan fiyat, `p-007` ardından `p-006` sonucunu ve `2 / 10 ürün` sayacını verdi. |
| Seçimleri temizleme | Geçti | Arama, kategori ve sıra başlangıç değerlerine; görünür kartlar 10'a döndü. |
| Ham dizi korunumu | Geçti | Saf fonksiyon doğrulamasında fiyat sıralamaları sonrasında kaynak ürün kimliği sırası değişmedi. |
| Erişilebilir adlar | Geçti | DOM snapshot'ta “Ürün ara” searchbox, “Kategori” ve “Sırala” combobox olarak etiketli bulundu; focus CSS'i form elemanlarını kapsıyor. |
| 320 px responsive | Geçti | Kontrol paneli tek `254.4px` sütun, ürün grid'i `143px 143px`; `innerWidth = scrollWidth = 320`, form kontrolleri 48 px. |
| Geniş ekran düzeni | Geçti | 1280 px'de kontrol paneli beş sütun ve ürün grid'i dört sütun görünümünde; görsel inceleme geçti. |
| Tarayıcı konsolu | Geçti | Uygulama kullanımında `warn` veya `error` kaydı bulunmadı; yalnız Vite debug ve React DevTools bilgi kaydı vardı. |

## Aşama 9 otomatik doğrulama kaydı

Bu kontroller gerçek komutlarla çalıştırılmıştır. Tarayıcı, responsive görünüm, klavye, browser console ve backend-kapalı frontend görünümü bu kayda dahil değildir.

| Komut/kontrol | Sonuç | Kanıt özeti |
|---|---|---|
| `backend/npm test` | Geçti | Node test runner: 11 test, 11 geçti, 0 kaldı, 0 atlandı. Test sunucusu rastgele boş port kullandı ve kapanışta güvenli biçimde kapandı. |
| Backend HTTP davranışları | Geçti | Health, liste, detay, ürün 404, POST, invalid POST 400, kısmi PATCH, unknown PATCH, DELETE sonrası GET 404 ve route JSON 404 doğrulandı. |
| Backend test izolasyonu | Geçti | Her test öncesi başlangıç ürünleri yeni kopyalardan geri yüklendi; son izolasyon testi 10 ürün ve `p-001` kaydını gördü. |
| `backend/npm run check` | Geçti | Bütün backend kaynak dosyaları syntax kontrolünden exit code `0` ile geçti. |
| `frontend/npm test` | Geçti | Node test runner: 21 test, 21 geçti, 0 kaldı, 0 atlandı. |
| Arama/filtre/sıralama | Geçti | 9 test: harf duyarsız ve trim'li arama, kategori/Tümü, iki fiyat sırası, birleşik kullanım, mutasyon yapmama ve boş sonuç doğrulandı. |
| Sepet reducer/toplamlar | Geçti | 12 test: ekleme, aynı/farklı ürün, artırma, azaltma, son adette kaldırma, doğrudan kaldırma, negatif olmama, adet/satır/genel toplam ve `NaN` koruması doğrulandı. `100 × 2 + 75 × 1 = 275`, toplam adet `3` geçti. |
| `frontend/npm run lint` | Geçti | ESLint exit code `0`; hata veya uyarı üretmedi. |
| `frontend/npm run build` | Geçti | Vite 106 modülü dönüştürdü ve production çıktısını exit code `0` ile oluşturdu. Bu bir derleme smoke kontrolüdür, tarayıcı davranış testi değildir. |

## Aşama 10 otomatik doğrulama kaydı

Tarayıcı ve kullanıcı etkileşimi testleri bu kayda dahil değildir.

| Kontrol | Sonuç | Kanıt özeti |
|---|---|---|
| Kaynak gereksinim karşılaştırması | Geçti | Kaynak PDF'nin 3 sayfası incelendi; `requirements.md` içindeki 26 zorunlu maddeyle kapsam çelişkisi bulunmadı. |
| Backend temiz kurulum | Geçti | İzole geçici klasörde `npm ci`; 70 paket kuruldu ve npm audit 0 güvenlik açığı bildirdi. |
| Frontend temiz kurulum | Geçti | İzole geçici klasörde `npm ci`; 134 paket kuruldu ve npm audit 0 güvenlik açığı bildirdi. |
| Backend test/syntax | Geçti | `npm test`: 11/11; `npm run check`: exit code `0`. |
| Frontend test/lint/build | Geçti | `npm test`: 21/21; lint hatasız; build 106 modülle başarılı. |
| API smoke zinciri | Geçti | Health/list/detail/PATCH `200`, POST `201`, DELETE `204`, invalid JSON `400`, silinen ürün ve bilinmeyen route `404`. |
| Doküman bağlantıları | Geçti | README ve `docs/*.md` içindeki bütün relative link hedefleri mevcut. |
| Doküman kapsamı | Geçti | İzlenebilirlikte 26 benzersiz gereksinim, API belgesinde 6 endpoint bulundu. |
| Git ignore ve gizli bilgi | Geçti | `.env`, `node_modules` ve `dist` takip edilmiyor; takip edilen metinlerde şüpheli gizli bilgi adı bulunmadı. |
| Git teslim durumu | Manuel işlem gerekli | Sekiz anlamlı commit mevcut; Aşama 9/10 değişiklikleri ve boş `test.js` henüz untracked/commit edilmemiş durumda. Kullanıcı dosyaları silinmedi ve commit oluşturulmadı. |

## Aşama 11A otomatik doğrulama kaydı

Bu kayıt yalnız otomatik saf fonksiyon, lint, build ve regresyon kontrolleridir. Sayfa yenileme, sekmeyi kapatıp açma ve DevTools storage müdahalesi Codex tarafından çalıştırılmadı.

| Komut/kontrol | Sonuç | Kanıt özeti |
|---|---|---|
| `frontend/npm test` | Geçti | 31 testin tamamı geçti; 12 reducer/toplam, 10 storage ve 9 arama/filtre/sıralama testi. |
| Storage round-trip | Geçti | Geçerli ürün ve adet JSON olarak kaydedilip aynı state olarak geri yüklendi. |
| Bozuk/geçersiz storage | Geçti | Bozuk JSON, yanlış ürün/adet türü ve yinelenen ürün kimliği boş sepet fallback'i üretti. |
| Storage erişim hatası | Geçti | Okuma/yazma hatası uygulamaya fırlatılmadı; yükleme boş sepet, kaydetme `false` sonucu verdi. |
| Temizleme kaydı | Geçti | Boş sepet storage'a `{ "items": [] }` olarak yazıldı ve geri yüklendi. |
| `frontend/npm run lint` | Geçti | ESLint exit code `0`; hata veya uyarı yok. |
| `frontend/npm run build` | Geçti | Vite 107 modülü dönüştürdü; production build exit code `0`. |
| Backend regresyonu | Geçti | `npm test` 11/11 ve `npm run check` başarılı; backend davranışı değiştirilmedi. |
