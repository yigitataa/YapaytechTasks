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

- **Hangi ihtiyacı çözdüm?** _Doldurulacak._
- **Ne öğrendim?** _Doldurulacak._
- **Veri hangi dosyalar/katmanlar arasında hareket etti?** _Doldurulacak._
- **En önemli state veya veri yapısı neydi?** _Doldurulacak._
- **Hangi hata veya sınır senaryosunu ele aldım?** _Doldurulacak._
- **Hangi teknik kararı neden verdim?** _Doldurulacak._
- **Hangi testi yaptım; kanıtım neydi?** _Doldurulacak._
- **Anlamadığım konular / sorularım:** _Doldurulacak._

## Aşama 5 - Frontend ürün liste ve detay

- **Hangi ihtiyacı çözdüm?** _Doldurulacak._
- **Ne öğrendim?** _Doldurulacak._
- **Veri backend'den componentlere nasıl ulaştı?** _Doldurulacak._
- **En önemli state veya veri yapısı neydi?** _Doldurulacak._
- **Hangi hata veya sınır senaryosunu ele aldım?** _Doldurulacak._
- **Hangi teknik kararı neden verdim?** _Doldurulacak._
- **Hangi testi yaptım; kanıtım neydi?** _Doldurulacak._
- **Anlamadığım konular / sorularım:** _Doldurulacak._

## Aşama 6 - Arama, filtre ve sıralama

- **Hangi ihtiyacı çözdüm?** _Doldurulacak._
- **Ne öğrendim?** _Doldurulacak._
- **Kullanıcı girdisi ürün listesine nasıl etki etti?** _Doldurulacak._
- **En önemli state veya veri yapısı neydi?** _Doldurulacak._
- **Hangi boş sonuç veya birleşik filtre senaryosunu ele aldım?** _Doldurulacak._
- **Hangi teknik kararı neden verdim?** _Doldurulacak._
- **Hangi testi yaptım; kanıtım neydi?** _Doldurulacak._
- **Anlamadığım konular / sorularım:** _Doldurulacak._

## Aşama 7 - Sepet yönetimi

- **Hangi ihtiyacı çözdüm?** _Doldurulacak._
- **Ne öğrendim?** _Doldurulacak._
- **Sepet verisi hangi componentler arasında hareket etti?** _Doldurulacak._
- **En önemli state veya reducer davranışı neydi?** _Doldurulacak._
- **Hangi boş sepet veya adet senaryosunu ele aldım?** _Doldurulacak._
- **Hangi teknik kararı neden verdim?** _Doldurulacak._
- **Toplamı hangi test ve hesapla doğruladım?** _Doldurulacak._
- **Anlamadığım konular / sorularım:** _Doldurulacak._

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
