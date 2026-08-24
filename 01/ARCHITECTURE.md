# Mimari

## Yaklaşım

Uygulama, sunucu bağımlılığı olmayan küçük bir React istemcisidir. Görevler tek bir reducer içinde yönetilir ve her değişiklikten sonra `localStorage` alanına yazılır. Görünüm filtresi görev verisinden türetildiği için ayrıca saklanmaz.

```text
App
├── usePersistentTodos ── todoReducer ── localStorage
├── useGeminiApiKey ── localStorage
├── TodoForm
├── TodoFilters
├── TodoList
│   └── TodoItem
├── ApiKeyDialog
├── PlanningDialog ── geminiPlanner ── Gemini GenerateContent API
├── PlanTimeline
└── EmptyState
```

## Sınırlar

- `domain/todo.ts`: Model, eylemler, doğrulama/sanitizasyon ve saf reducer.
- `hooks/usePersistentTodos.ts`: Depolamadan güvenli başlangıç ve değişikliklerin kalıcılaştırılması.
- `hooks/useGeminiApiKey.ts`: API anahtarını arayüzden yönetir ve tarayıcıda saklar.
- `services/geminiPlanner.ts`: Gemini isteğini, yapılandırılmış JSON doğrulamasını ve Flash model kota geçişini kapsüller.
- `components/`: Yalnızca kullanıcı etkileşimi ve sunum.
- `App.tsx`: Filtrelenmiş görünümü türetir ve componentleri birleştirir.

## Veri modeli

Her görev benzersiz kimlik, başlık, tamamlanma durumu, öncelik, isteğe bağlı son tarih ve oluşturma/güncelleme zamanlarını içerir. Depolamadaki bozuk veya eski kayıtlar çalışma zamanında doğrulanır; geçersiz satırlar uygulamayı çökertmek yerine atlanır.

## Tasarım kararları

- Redux gibi global bir kütüphane bu kapsam için gereksizdir; `useReducer` eylemleri görünür ve test edilebilir tutar.
- `localStorage` veritabanı öncesi kalıcılık beklentisini ek altyapısız karşılar.
- Form doğrulaması hem eklemede hem düzenlemede uygulanır.
- Öncelik ve son tarih zorunlu akışları etkilemeyen bonus özelliklerdir.
- AI planı kalıcı görev modeline yazılmaz. Görev değiştiğinde eski plan temizlenir; böylece ekrandaki süre dağılımı güncelliğini yitirmiş görevlerle gösterilmez.
- Planlayıcı yalnızca bugünün tamamlanmamış görevlerini ve önceliklerini gönderir. Kota yanıtında `3.7 → 3.6 → 3.5 Flash` sırasıyla denenir; geçersiz anahtar gibi kota dışı hatalar doğrudan kullanıcıya iletilir.
- Her model çağrısı ayrı bir `AbortController` ile 30 saniyede sınırlandırılır. Kullanıcı iptali bekleyen ağ isteğine iletilir; zaman aşımı ve geçici servis hataları sıradaki Flash modeline geçer.
- Basit görev sıralamasında gereksiz gecikmeyi azaltmak için Gemini düşünme seviyesi `low`, çıktı sınırı 1024 token olarak ayarlanır.
- Zaman şeridi ve çubuk grafik ek paket kullanmadan CSS ile çizilir; üretim paket boyutu düşük tutulur.
