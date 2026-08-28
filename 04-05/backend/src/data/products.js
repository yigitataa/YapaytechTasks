const initialProducts = [
  {
    id: 'p-001',
    name: 'Kablosuz Kulaklık',
    description:
      'Günlük kullanım için dengeli ses sunan, katlanabilir Bluetooth kulaklık.',
    price: 2499,
    category: 'Elektronik',
    imageUrl: 'https://placehold.co/600x400/png?text=Kablosuz+Kulaklik',
  },
  {
    id: 'p-002',
    name: 'Mekanik Klavye',
    description:
      'Kompakt tuş düzenine ve ayarlanabilir aydınlatmaya sahip mekanik klavye.',
    price: 3299,
    category: 'Elektronik',
    imageUrl: 'https://placehold.co/600x400/png?text=Mekanik+Klavye',
  },
  {
    id: 'p-003',
    name: 'Akıllı Masa Lambası',
    description:
      'Farklı ışık sıcaklıkları ve dokunmatik parlaklık kontrolü sunan masa lambası.',
    price: 1249,
    category: 'Ev ve Yaşam',
    imageUrl: 'https://placehold.co/600x400/png?text=Akilli+Masa+Lambasi',
  },
  {
    id: 'p-004',
    name: 'Seramik Kahve Seti',
    description:
      'İki fincan ve servis tabağından oluşan el işçiliği görünümlü kahve seti.',
    price: 899,
    category: 'Ev ve Yaşam',
    imageUrl: 'https://placehold.co/600x400/png?text=Seramik+Kahve+Seti',
  },
  {
    id: 'p-005',
    name: 'Şehir Sırt Çantası',
    description:
      'Dizüstü bilgisayar bölmesi ve düzenleyici cepleri bulunan hafif sırt çantası.',
    price: 1599,
    category: 'Aksesuar',
    imageUrl: 'https://placehold.co/600x400/png?text=Sehir+Sirt+Cantasi',
  },
  {
    id: 'p-006',
    name: 'Paslanmaz Çelik Matara',
    description:
      'İçeceğin sıcaklığını uzun süre koruyan, sızdırmaz kapaklı çelik matara.',
    price: 649,
    category: 'Spor',
    imageUrl: 'https://placehold.co/600x400/png?text=Celik+Matara',
  },
  {
    id: 'p-007',
    name: 'Kaymaz Yoga Matı',
    description:
      'Evde ve stüdyoda egzersiz için yastıklama sağlayan kaymaz yüzeyli yoga matı.',
    price: 1099,
    category: 'Spor',
    imageUrl: 'https://placehold.co/600x400/png?text=Yoga+Mati',
  },
  {
    id: 'p-008',
    name: 'Minimalist Kol Saati',
    description:
      'Sade kadranı ve değiştirilebilir deri kayışıyla günlük kullanıma uygun saat.',
    price: 2799,
    category: 'Aksesuar',
    imageUrl: 'https://placehold.co/600x400/png?text=Kol+Saati',
  },
  {
    id: 'p-009',
    name: 'Strateji ve Tasarım Kitabı',
    description:
      'Ürün fikirlerini anlaşılır çözümlere dönüştürmeye yönelik uygulamalı rehber.',
    price: 479,
    category: 'Kitap',
    imageUrl: 'https://placehold.co/600x400/png?text=Tasarim+Kitabi',
  },
  {
    id: 'p-010',
    name: 'Pamuklu Günlük Tişört',
    description:
      'Rahat kesimli, nefes alan kumaştan üretilmiş bisiklet yaka günlük tişört.',
    price: 749,
    category: 'Giyim',
    imageUrl: 'https://placehold.co/600x400/png?text=Pamuklu+Tisort',
  },
]

export function createInitialProducts() {
  return initialProducts.map((product) => ({ ...product }))
}

const products = createInitialProducts()

export default products
