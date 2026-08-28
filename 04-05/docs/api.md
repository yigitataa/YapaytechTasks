# Ürün REST API Dokümantasyonu

## Genel bilgi

- Varsayılan adres: `http://localhost:3000`
- Veri biçimi: JSON
- Veri kaynağı: Backend sürecinin belleğindeki JavaScript dizisi
- Başarılı ürün cevapları: Ürün/ürün dizisi doğrudan döner; `data` zarfı kullanılmaz.
- Kalıcılık: POST, PATCH ve DELETE değişiklikleri yalnız çalışan süreçte yaşar. Backend yeniden başlayınca 10 başlangıç ürünü geri yüklenir.

API'yi başlatmak için proje kökünden:

```powershell
cd backend
npm install
npm run dev
```

## Endpoint özeti

| Yöntem | Yol | Path/query parametresi | Request body | Başarı | Temel hatalar |
|---|---|---|---|---|---|
| `GET` | `/api/health` | Yok | Yok | `200` sağlık nesnesi | - |
| `GET` | `/api/products` | Yok | Yok | `200` ürün dizisi | - |
| `GET` | `/api/products/:id` | `id`: zorunlu ürün kimliği | Yok | `200` tek ürün | `404` |
| `POST` | `/api/products` | Yok | Ürün oluşturma alanları | `201` oluşturulan ürün | `400` |
| `PATCH` | `/api/products/:id` | `id`: zorunlu ürün kimliği | Değiştirilecek en az bir alan | `200` güncel ürün | `400`, `404` |
| `DELETE` | `/api/products/:id` | `id`: zorunlu ürün kimliği | Yok | `204`, boş gövde | `404` |

`PUT` desteklenmez. Bu projede güncelleme, yalnız gönderilen alanları değiştiren `PATCH` ile yapılır.

Bu sürüm query parametresi kullanmaz. Arama, kategori filtresi ve fiyat sıralaması backend listesi alındıktan sonra frontend'de uygulanır.

## Ürün modeli ve validasyon

Örnek ürün:

```json
{
  "id": "p-001",
  "name": "Kablosuz Kulaklık",
  "description": "Günlük kullanım için kısa ürün açıklaması.",
  "price": 2499,
  "category": "Elektronik",
  "imageUrl": "https://placehold.co/600x400/png?text=Kablosuz+Kulaklik"
}
```

| Alan | Oluşturmada | Kural |
|---|---|---|
| `id` | Gönderilmemeli | Backend `crypto.randomUUID()` ile üretir. İstemciden gelirse `400` olur. |
| `name` | Zorunlu | Metin ve trim sonrası dolu olmalıdır. |
| `price` | Zorunlu | Sonlu, sayısal ve sıfırdan büyük olmalıdır. `"125"` gibi metin kabul edilmez. |
| `category` | Zorunlu | Metin ve trim sonrası dolu olmalıdır. |
| `description` | İsteğe bağlı | Gönderilirse metin olmalıdır; gönderilmezse boş metin saklanır. |
| `imageUrl` | İsteğe bağlı | Gönderilirse metin olmalıdır; gönderilmezse boş metin saklanır. |

PATCH isteğinde yalnız gönderilen desteklenen alanlar doğrulanıp değişir; diğer alanlar korunur. Boş nesne ve bilinmeyen alanlar `400` olur.

Bu alan şeması kaynak PDF'nin zorunlu ürün modeli değildir; projenin tutarlı API davranışı için alınmış teknik karardır.

## Başarılı istekler

### Sağlık kontrolü

```text
GET /api/health
200 OK
```

```json
{
  "status": "ok"
}
```

### Bütün ürünleri listeleme

```text
GET /api/products
200 OK
```

Cevap köşeli parantezle başlayan bir JSON dizisidir:

```json
[
  {
    "id": "p-001",
    "name": "Kablosuz Kulaklık",
    "description": "Günlük kullanım için dengeli ses sunan, katlanabilir Bluetooth kulaklık.",
    "price": 2499,
    "category": "Elektronik",
    "imageUrl": "https://placehold.co/600x400/png?text=Kablosuz+Kulaklik"
  }
]
```

### Tek ürün getirme

```text
GET /api/products/p-001
200 OK
```

Cevap süslü parantezle başlayan tek JSON ürün nesnesidir.

### Ürün oluşturma

```text
POST /api/products
Content-Type: application/json
```

```json
{
  "name": "USB-C Masa Şarjı",
  "description": "Çoklu cihazlar için masaüstü şarj ünitesi.",
  "price": 1899,
  "category": "Elektronik",
  "imageUrl": "https://example.com/usb-c-sarj.png"
}
```

Başarı cevabı `201 Created` ve backend tarafından üretilmiş `id` içeren doğrudan ürün nesnesidir:

```json
{
  "id": "d63dd166-30ec-4df4-a641-a509478b8e9f",
  "name": "USB-C Masa Şarjı",
  "description": "Çoklu cihazlar için masaüstü şarj ünitesi.",
  "price": 1899,
  "category": "Elektronik",
  "imageUrl": "https://example.com/usb-c-sarj.png"
}
```

UUID örneği temsili değerdir; her yeni üründe farklı bir kimlik üretilir.

### Ürünü kısmi güncelleme

```text
PATCH /api/products/{oluşturulan-id}
Content-Type: application/json
```

```json
{
  "price": 1749
}
```

Başarı cevabı `200 OK` ve güncel ürün nesnesidir. Bu örnekte yalnız `price` değişir; ad, kategori ve diğer alanlar korunur.

### Ürün silme

```text
DELETE /api/products/{oluşturulan-id}
204 No Content
```

`204` cevabında response body bulunmaz. Silinen kimlik sonraki GET isteğinde `404` olur.

## Hata cevapları

Her hata JSON'dur ve en az `message` alanı içerir. Alan bazlı validasyon hatalarında `details` eklenir:

```json
{
  "message": "Geçersiz ürün verisi",
  "details": {
    "name": "Zorunlu alandır",
    "price": "Sıfırdan büyük olmalıdır"
  }
}
```

| Durum | Kod | Cevap özeti |
|---|---:|---|
| Eksik/geçersiz ürün alanı | `400` | `message` ve alan bazlı `details` |
| Boş PATCH nesnesi | `400` | `details.body` en az bir alan ister |
| İstemci `id` veya bilinmeyen alan gönderir | `400` | İlgili alan `details` içinde açıklanır |
| JSON sözdizimi bozuktur | `400` | `{"message":"Geçersiz JSON gövdesi"}` |
| Ürün bulunamaz | `404` | `{"message":"Ürün bulunamadı"}` |
| API route'u/metodu desteklenmez | `404` | `{"message":"Endpoint bulunamadı"}` |
| Beklenmeyen backend hatası | `500` | `{"message":"Sunucu hatası"}`; stack trace/iç mesaj gönderilmez |

## PowerShell ile hızlı CRUD zinciri

Aşağıdaki örnek hem Windows PowerShell 5.1 hem PowerShell 7 ile uyumludur. Windows PowerShell 5.1'de bulunmayan `-SkipHttpErrorCheck` parametresi kullanılmaz; hata durum kodları `try/catch` içinde okunur.

URL değerlerini Markdown bağlantısı olarak değil, tam olarak aşağıdaki gibi düz metin yaz:

```powershell
$baseUrl = 'http://localhost:3000/api/products'
```

Backend çalışırken ayrı bir PowerShell terminalinde:

```powershell
$baseUrl = 'http://localhost:3000/api/products'
$healthUrl = 'http://localhost:3000/api/health'

function Invoke-ApiRequest {
  param(
    [string]$Method,
    [string]$Url,
    [object]$Body,
    [switch]$RawBody
  )

  $requestParameters = @{
    Uri = $Url
    Method = $Method
    UseBasicParsing = $true
  }

  if ($PSBoundParameters.ContainsKey('Body')) {
    $json = if ($RawBody) {
      [string]$Body
    } else {
      $Body | ConvertTo-Json -Compress
    }

    $requestParameters.ContentType = 'application/json; charset=utf-8'
    $requestParameters.Body = [System.Text.Encoding]::UTF8.GetBytes($json)
  }

  try {
    $response = Invoke-WebRequest @requestParameters

    [pscustomobject]@{
      StatusCode = [int]$response.StatusCode
      Content = [string]$response.Content
    }
  } catch {
    $response = $_.Exception.Response

    if ($null -eq $response) {
      throw
    }

    $content = [string]$_.ErrorDetails.Message

    if ([string]::IsNullOrEmpty($content)) {
      $reader = New-Object System.IO.StreamReader(
        $response.GetResponseStream(),
        [System.Text.Encoding]::UTF8
      )

      try {
        $content = $reader.ReadToEnd()
      } finally {
        $reader.Dispose()
      }
    }

    [pscustomobject]@{
      StatusCode = [int]$response.StatusCode
      Content = $content
    }
  }
}

# Başlangıç listesi
$listResponse = Invoke-ApiRequest Get $baseUrl
$list = $listResponse.Content | ConvertFrom-Json
$listResponse.StatusCode
$list.Count

# Ürün oluşturma
$createResponse = Invoke-ApiRequest Post $baseUrl @{
  name = 'Manual Test Urunu'
  description = 'Gecici test urunu'
  price = 1899
  category = 'Test'
  imageUrl = 'https://example.com/manual-test.png'
}

$created = $createResponse.Content | ConvertFrom-Json
$createResponse.StatusCode
$created

# Detay
$detailResponse = Invoke-ApiRequest Get "$baseUrl/$($created.id)"
$detailResponse.StatusCode
$detailResponse.Content

# Yalnız fiyatı güncelle
$patchResponse = Invoke-ApiRequest Patch "$baseUrl/$($created.id)" @{
  price = 1749
}

$patchResponse.StatusCode
$patchResponse.Content

# Silme: 204 ve boş Content beklenir
$deleteResponse = Invoke-ApiRequest Delete "$baseUrl/$($created.id)"
$deleteResponse.StatusCode
$deleteResponse.Content.Length

# Silinen ürünü yeniden okuma: 404 beklenir
$deletedGetResponse = Invoke-ApiRequest Get "$baseUrl/$($created.id)"
$deletedGetResponse.StatusCode
$deletedGetResponse.Content

# Geçersiz ürün: 400 beklenir
$invalidResponse = Invoke-ApiRequest Post $baseUrl @{
  price = -10
  category = 'Test'
}

$invalidResponse.StatusCode
$invalidResponse.Content

# Bozuk JSON: 400 beklenir
$invalidJsonResponse = Invoke-ApiRequest Post $baseUrl '{"name":' -RawBody
$invalidJsonResponse.StatusCode
$invalidJsonResponse.Content

# Health: 200 beklenir
$healthResponse = Invoke-ApiRequest Get $healthUrl
$healthResponse.StatusCode
$healthResponse.Content
```

Beklenen temel sonuçlar sırasıyla liste için `200`, oluşturma için `201`, detay ve PATCH için `200`, DELETE için `204`, silinen ürün için `404`, geçersiz veri/JSON için `400` ve health için `200` değerleridir.
