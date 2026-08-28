# Öğrenme Notları

## Amaç

Bu dosya teslim için zorunlu bir özellik değildir. Her aşamada ne yaptığını kendi cümlelerinle açıklayabilmen, veri akışını takip edebilmen ve anlamadığın konuları kaybetmemen için hazırlanmış kişisel öğrenme günlüğüdür.

## Nasıl doldurulur?

- Her aşama bittiğinde ilgili başlığın altındaki soruları kısa cümlelerle yanıtla.
- Kodu veya dokümanı kopyalamak yerine kendi anladığını yaz.
- Emin olmadığın şeyi tahmin etme; “Anlamadığım konular” kısmına soru olarak ekle.
- Test kanıtı olarak komut, gözlenen ekran davranışı veya ilgili test kimliğini yaz.
- Bir karar değişirse eski açıklamanın yanına tarihli bir düzeltme ekle.

## Aşama 1 - Kapsam ve teknik kararlar

- **Bu aşamada hangi kullanıcı/proje ihtiyacını çözdüm?**
  - Projenin genel gidişatına ve geliştirme aşamaları çözüldü. Teknik mimari açısından önemli bir durum ve ne geliştireceğimizi nasıl değerlendirmemiz gerektiği böylelikle daha açık olacak.
- **Ne öğrendim?**
  - Mern mimarisinin kurulumunu ve genel hatları ve oluşumunu deneyimledim.
- **Veri akışı nasıldı?**
  - Henüz bu aşamada bir veri akışı yok. Veri akışını REST API ile endpoint ile sağlayacağız
- **En önemli state veya veri yapısı neydi?**
  - Henüz bu aşamada bir state ve bir veri yapısı yok. Ancak temel hatlarıyla state yapıları belli bunu ilerleyen aşamada testlerle birlikte daha da optimize edeceğim.
- **Hangi hata veya sınır senaryosunu ele aldım?**
  - Manuel Test Checklist'te hata ve test senaryolarına detaylıca yer verdim. Bu aşamadan sonraki gelişimlerde her bir aşama için yapılan testleri not alacağım.
- **Hangi teknik kararı neden verdim?**
  - Genel yapıyı şirketin çalışma modeli olan MERN yapısı üzerine geliştirmeye çalıştım. Detay teknik planlar henüz taslak olduğu için değişebilir. bu değişen kararları ilerleyen aşamalarda not alacağım
- **Hangi testi yaptım ve çalıştığını hangi kanıtla gördüm?**
  - Bu aşamada bir test uygulamadım.
- **Anlamadığım konular / sorularım:**
  - Henüz anlamadığım bir konu veya sorum yok.

## Aşama 2 - Proje iskeleti ve çalıştırma

- **Hangi ihtiyacı çözdüm?** 
  - Frontend ve backend iskeletini kurduk. Buradan sonraki eklemeleri bu iskeletler üzerinden gerçekleştireceğiz.
- **Ne öğrendim?**
  - Temel Frontend ve Backend mimarisini kurgulamayı öğrendim.
- **Hangi hata veya sınır senaryosunu ele aldım?** _Doldurulacak._
- **Hangi teknik kararı neden verdim?**
  - Ayrı json dosyalarıyla frontend ve backendi ayırdım. Böylelikle ikisinden birinde oluşabilecek sıkıntıyı daha rahat tespit edip çözebileceğimizi düşündüm
- **Hangi testi yaptım; kanıtım neydi?**
  - npm ile hem frontendi hem de backendi çalıştırdım ve çalıştığını gördüm. İkisinin arasındaki bağlantıları daha sonraki aşamalarda değerlendireceğim.
- **Anlamadığım konular / sorularım:**
  - Henüz anlamadığım bir konu veya sorum yok.

## Aşama 3 - Backend ürün okuma API'si

- **Hangi ihtiyacı çözdüm?** 
  - Ürünlerin doğruca elde edilebilmesi için gerekli api endpointleri oluşturdum.
- **Ne öğrendim?**
  - Api üzerinden nasıl istek - cevap ilişkisi kurulur bunu öğrendim.
- **Veri hangi dosyalar/katmanlar arasında hareket etti?**
  - Veri anlık olarak backend/data/product.js dosyasından okunur. Bu daha sonra teknik revizelere göre değişiklik göstererebilir.
- **En önemli state veya veri yapısı neydi?**
  - Anlık olarak bu bölümde değişiklik gösterebilen bir state yoktu. Kullandığımız veri yapısı da json formatına uygundu.
- **Hangi hata veya sınır senaryosunu ele aldım?**
  - Bu aşamada işimiz sadece product'larla olduğu için product edinebilmek için id kullandık. Bu nedenle test edebileceğimiz tek alan doğru id'ye ulaşıp ulaşamadığımız olur.
- **Hangi teknik kararı neden verdim?** 
  - Teknik olarak bu aşamada sadece product verisi çekme kısmına odaklandık. Projemizin temel yapı taşı olduğu için ona odaklnmak gerekliydi.
- **Anlamadığım konular / sorularım:**
  - Neden direkt json dosyası kullanmadık kullansaydık ne olurdu merak ediyorum.

## Aşama 4 - Backend CRUD, validasyon ve hata yönetimi

- **Hangi ihtiyacı çözdüm?**
  - Api Tarafındaki CRUD operasyonlarını hayata geçirdim. Bundan sonra projemde ürün ekleme, okuma, güncelleme, silme işlemleri yapabiliriz
- **Ne öğrendim?**
  - CRUD işlemlerinin teknik detaylarını ve bunları nasıl test etmem gerektiğini öğrendim.
- **Veri hangi dosyalar/katmanlar arasında hareket etti?**
  - Anlık olarak sorguları terminal üzerinden gerçekleştirdik. Yani sadece backend katmanında veriyi kullandık.
- **Hangi hata veya sınır senaryosunu ele aldım?**
  - Sorgunun yanlış yapılması, parametrelerin eksik girilmesi, parametrelerin kurallara uygun olmaması (negatif fiyat girme vb.) senaryoları değerlendirdim.
- **Hangi teknik kararı neden verdim?**
  - Teknik kararları alırken genel olarak yapının basitliğini korumayı ve fazladan materyal kullanmamaya özen gösterdim. Bu nedenle genel olarak teknik çözümleri seçerken seçeneklerden mevcut paketlerle çözebileceğim alternatiflere odaklandım.
- **Hangi testi yaptım; kanıtım neydi?**
  - CRUD testleri ve hata testleri yaptım. Öncesinde alınması gereken çıktıları netleştirdim ve testleri bu sonuçlara göre yaptım. Daha sonrasında ise sonuçları bu önizlemelerle karşılaştırdım. Hata kodları ve fonksiyonun çıktı etkisini değerlendirdim.
- **Anlamadığım konular / sorularım:**
  - Bu aşamada anlamadığım bir konu yok.

## Aşama 5 - Frontend ürün liste ve detay

- **Hangi ihtiyacı çözdüm?**
  - Uygulamanın frontend kısmını geliştirdik. Ürünler daha kolay gözlemlenebilir bir hale geldi
- **Ne öğrendim?**
  - Bir alışveriş uygulaması için gerekli tasarım kalıpları ve sunumda dikkat çekici detayların önemini öğrendim.
- **Veri backend'den componentlere nasıl ulaştı?**
  - Kurmuş olduğumuz REST API sistemiyle istek atarak ürünlerin bilgilerine ulaşarak frontend kısmında sergiliyoruz.
- **En önemli state veya veri yapısı neydi?**
  - Şu anlık kullandığımız en önemli veri yapısı "product" nesnesidir. Onun dışında hata durumlarını tespit edip ona göre uygulamanın tepki vermesini sağlamak için hata değişkenleri kullanıyoruz.
- **Hangi hata veya sınır senaryosunu ele aldım?**
  - Frontend ve backend bağlantısı koparsa ne olur, kullanıcı ne görür bu senaryoları değerlendirdim.
- **Hangi teknik kararı neden verdim?**
  - Ürün verilerini frontend içinde sabit tutmak yerine backend API’den fetch ile almaya karar verdim. Böylece frontend ile backend arasındaki sorumluluklar ayrıldı ve ürünler tek bir kaynaktan yönetildi. Liste ve detay sayfaları arasında geçiş yapmak için React Router kullandım.
- **Hangi testi yaptım; kanıtım neydi?**
  - Ürünlerin API’den gelip gelmediğini, ürün detayına geçişi, bilinmeyen ürün 404 görünümünü ve responsive tasarımı test ettim. API’deki 10 ürünün ekranda 10 kart olarak görünmesi, doğru detay sayfasının açılması, hata durumlarının kontrollü gösterilmesi ve lint/build komutlarının başarıyla tamamlanması test kanıtlarımdı.
- **Anlamadığım konular / sorularım:**
  - Frontend ve Backend bağlantısı koptuğunda kullanıcının ön belleğinde yüklü olan verileri gösterip yine de bağlantının koptuğunu belirtebilir miyiz?

## Aşama 6 - Arama, filtre ve sıralama

- **Hangi ihtiyacı çözdüm?**
  - Kullanıcı deneyimi arama, filtreleme ve sıralama özelliğiyle zenginleştirildi.
- **Ne öğrendim?**
  - Arama çubuğunu nasıl oluşturacağımı ve değişen sayfa boyutlara göre nasıl optimize edeceğimi öğrendim.
- **Kullanıcı girdisi ürün listesine nasıl etki etti?**
  - Daha dinamik bir hal aldı ve kullanıcı istediği ürüne daha kolay ulaşabilir.
- **En önemli state veya veri yapısı neydi?**
  - Ürünler, arama metni, seçilen kategori ve sıralama seçeneği state içinde tutuldu.
- **Hangi boş sonuç veya birleşik filtre senaryosunu ele aldım?**
  - Arama ve kategoriye uygun ürün olmadığında “Ürün bulunamadı” mesajı gösterildi. Arama, kategori ve sıralamanın birlikte çalışması sağlandı.
- **Hangi teknik kararı neden verdim?**
  - Ürün sayısı az olduğu için arama, filtreleme ve sıralamayı frontend tarafında yaptım.
- **Hangi testi yaptım; kanıtım neydi?**
  - Arama, kategori ve fiyat sıralamasını tarayıcıda test ettim. Doğru ürünlerin ekranda görünmesi ve build işleminin başarılı olması kanıtımdı.
- **Anlamadığım konular / sorularım:**
  - Bu aşamada sorum yok.

## Aşama 7 - Sepet yönetimi

- **Hangi ihtiyacı çözdüm?**
  - Kullanıcının beğendiği ve almak istediği ürünü sepetinde saklamasını sağladım.
- **Ne öğrendim?**
  - Sepet mantığını ve bunların kaydını nasıl tutacağımı öğrendim.
- **Sepet verisi hangi componentler arasında hareket etti?**
  - Sepet verisi CartProvider üzerinden ürün kartı, ürün detay sayfası, header ve sepet sayfası arasında paylaşıldı.
- **En önemli state veya reducer davranışı neydi?**
  - En önemli state, sepetteki ürünleri ve adetlerini tutan items dizisiydi. Aynı ürün tekrar eklenince yeni satır oluşturmak yerine adedi artırıldı.
- **Hangi boş sepet veya adet senaryosunu ele aldım?**
  - Sepet boşken kullanıcıya boş sepet görünümü gösterildi. Sepet sayfasında adet bire düştüğünde azaltma düğmesi, ürünü kaldıran silme düğmesine dönüştürüldü.
- **Hangi teknik kararı neden verdim?**
  - Sepeti bütün sayfalarda ortak kullanabilmek için React Context ve useReducer kullandım. Böylece sepet işlemleri tek yerde ve düzenli biçimde yönetildi.
- **Toplamı hangi test ve hesapla doğruladım?**
  - Manuel testte satır toplamını ürün fiyatı × adet, genel toplamı ise bütün satır toplamlarının toplamı olarak kontrol edeceğim. Otomatik test çalıştırılmadığı için doğrulama henüz manuel teste bağlıdır.
- **Anlamadığım konular / sorularım:**
  - Şu an sorum yok.

## Aşama 8 - UI durumları ve responsive kullanım

- **Hangi ihtiyacı çözdüm?** _Doldurulacak._
- **Ne öğrendim?** _Doldurulacak._
- **Loading, error ve empty durumları nasıl üretildi?** _Doldurulacak._
- **En önemli UI state'i neydi?** _Doldurulacak._
- **Hangi ekran genişliği veya erişilebilirlik sorununu ele aldım?** _Doldurulacak._
- **Hangi teknik kararı neden verdim?** _Doldurulacak._
- **Hangi cihaz boyutlarını/testleri kullandım?** _Doldurulacak._
- **Anlamadığım konular / sorularım:** _Doldurulacak._

## Aşama 9 - Test, kalite ve refaktör

- **Hangi kalite ihtiyacını çözdüm?** _Doldurulacak._
- **Ne öğrendim?** _Doldurulacak._
- **Test edilen veri akışı neydi?** _Doldurulacak._
- **Hangi tekrar veya karmaşıklığı azalttım?** _Doldurulacak._
- **Hangi hata senaryosunu otomatik veya manuel doğruladım?** _Doldurulacak._
- **Hangi teknik kararı neden verdim?** _Doldurulacak._
- **Test sonucu ve kanıtım neydi?** _Doldurulacak._
- **Anlamadığım konular / sorularım:** _Doldurulacak._

## Aşama 10 - Dokümantasyon, Git ve teslim

- **Hangi teslim ihtiyacını çözdüm?** _Doldurulacak._
- **Ne öğrendim?** _Doldurulacak._
- **Yeni bir geliştirici projeyi hangi bilgi akışıyla çalıştırabilir?** _Doldurulacak._
- **En önemli teslim kararı neydi?** _Doldurulacak._
- **Hangi son hata/risk senaryosunu ele aldım?** _Doldurulacak._
- **Hangi teknik kararı neden verdim?** _Doldurulacak._
- **Son smoke test ve teslim kanıtım neydi?** _Doldurulacak._
- **Anlamadığım konular / sorularım:** _Doldurulacak._

## İsteğe bağlı bonus aşaması

- **Seçtiğim bonus ve seçme nedenim:** _Doldurulacak._
- **Zorunlu kapsamın önce tamamlandığını hangi kanıtla gördüm?** _Doldurulacak._
- **Bonus hangi yeni veri/state'i ekledi?** _Doldurulacak._
- **Hangi yeni hata senaryosu oluştu?** _Doldurulacak._
- **Hangi testi yaptım; kanıtım neydi?** _Doldurulacak._
- **Anlamadığım konular / sorularım:** _Doldurulacak._
