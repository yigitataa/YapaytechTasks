# Kişisel Kitaplık ve Okuma Günlüğü

Bu proje, PostgreSQL ile MongoDB'yi aynı backend içinde kullanmayı öğreten yerel ve tek kullanıcılı bir uygulamadır.

## İki veritabanı arasındaki tutarlılık sınırı

Bir kitap silinirken backend önce MongoDB'deki `reading_entries` koleksiyonunda kitabın UUID metnini taşıyan bir `bookId` belgesi arar. Kayıt varsa kitap silinmez ve istemciye önce günlük kayıtlarını silmesini söyleyen `409 Conflict` yanıtı verilir. MongoDB'ye erişilemiyorsa kontrol tamamlanmış sayılmaz; PostgreSQL'deki kitap silinmeden `503 Service Unavailable` döner. Yazar silme işlemi ise PostgreSQL'deki `books.author_id` foreign key ve `ON DELETE RESTRICT` kuralıyla korunur.

PostgreSQL ile MongoDB arasında ortak foreign key veya ortak transaction yoktur. Bu nedenle "MongoDB'de kontrol et, ardından PostgreSQL'de sil" akışı atomik değildir. Eşzamanlı iki istekte, MongoDB kontrolü bittikten sonra PostgreSQL silme işlemi gerçekleşmeden hemen önce aynı kitaba yeni bir günlük kaydı eklenebilir. Böyle bir yarış koşulu MongoDB'de artık var olmayan bir PostgreSQL kitabını gösteren kayıt bırakabilir.

Yerel eğitim sürümü bu sınırı bilinçli olarak kabul eder. Dağıtık transaction, mesaj kuyruğu veya benzeri bir koordinasyon altyapısı bu sürümün kapsamına eklenmemiştir.
