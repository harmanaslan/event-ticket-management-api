# Event & Ticket Management API    18.06.2026  22:30

Bu proje, kullanıcıların yaklaşan etkinlikleri listeleyebildiği ve etkinliklere bilet satın alabildiği bir NestJS API projesidir.

Proje MongoDB/Mongoose ile çalışır ve bilet satın alma işleminde MongoDB transaction/session kullanır.

## Kullanılan Teknolojiler

* NestJS
* MongoDB
* Mongoose
* TypeScript
* Class Validator
* Class Transformer
* Swagger
* MongoDB Transaction / Session

## Temel Özellikler

* Etkinlik oluşturma
* Etkinlik listeleme
* ID ile etkinlik görüntüleme
* Bilet satın alma
* Bilet listeleme
* Generic Repository Pattern
* Global Response Interceptor
* Logging Interceptor
* Custom Class Validator Decorator
* Swagger API dokümantasyonu
* MongoDB transaction/session ile güvenli bilet satın alma

## Proje Kurulumu

Projeyi klonladıktan sonra bağımlılıkları yükleyin:

npm install

## Ortam Değişkenleri

Proje ana dizininde `.env` dosyası oluşturulmalıdır.

Örnek local MongoDB bağlantısı:

PORT=3000
MONGODB_URI=mongodb://localhost:27017/event-ticket-management

Not: Local standalone MongoDB transaction/session desteklemez. Transaction testleri için MongoDB Atlas veya replica set destekli MongoDB bağlantısı kullanılmalıdır.

MongoDB Atlas replica set bağlantısı örneği:

PORT=3000
MONGODB_URI=mongodb://USERNAME:PASSWORD@HOST-1:27017,HOST-2:27017,HOST-3:27017/event-ticket-management?ssl=true&replicaSet=REPLICA_SET_NAME&authSource=admin&retryWrites=true&w=majority

Güvenlik notu: `.env` dosyası GitHub’a gönderilmemelidir.

## Projeyi Çalıştırma

Geliştirme modunda çalıştırmak için:

npm run start:dev

API varsayılan olarak şu adreste çalışır:

http://localhost:3000

Swagger dokümantasyonu:

http://localhost:3000/api-docs

## API Response Formatı

Tüm başarılı response’lar global response interceptor üzerinden standart formatta döner:

{
  "success": true,
  "timestamp": "2026-06-18T19:00:00.000Z",
  "data": {}
}

## Events Endpoints

### POST /events

Yeni etkinlik oluşturur.

Örnek request body:

{
  "title": "Atlas Test Event",
  "description": "MongoDB Atlas transaction test",
  "startDate": "2026-07-01T19:00:00.000Z",
  "totalTickets": 100,
  "ticketPrice": 250
}

Kurallar:

* `title` zorunludur.
* `description` zorunludur.
* `startDate` geçerli tarih formatında olmalıdır.
* `startDate` bugünden en az 3 gün sonra olmalıdır.
* `totalTickets` minimum 1 olmalıdır.
* `ticketPrice` minimum 1 olmalıdır.
* `availableTickets` kullanıcıdan alınmaz, otomatik olarak `totalTickets` değeri ile oluşturulur.

Başarılı response örneği:

{
  "success": true,
  "timestamp": "2026-06-18T19:11:47.902Z",
  "data": {
    "title": "Atlas Test Event",
    "description": "MongoDB Atlas transaction test",
    "startDate": "2026-07-01T19:00:00.000Z",
    "totalTickets": 100,
    "availableTickets": 100,
    "ticketPrice": 250,
    "_id": "68a3442f30b50f94f3707a0c5",
    "createdAt": "2026-06-18T19:11:47.788Z",
    "updatedAt": "2026-06-18T19:11:47.788Z"
  }
}

### GET /events

Tüm etkinlikleri listeler.

Örnek response:

{
  "success": true,
  "timestamp": "2026-06-18T19:16:27.029Z",
  "data": [
    {
      "_id": "68a3442f30b50f94f3707a0c5",
      "title": "Atlas Test Event",
      "description": "MongoDB Atlas transaction test",
      "startDate": "2026-07-01T19:00:00.000Z",
      "totalTickets": 100,
      "availableTickets": 98,
      "ticketPrice": 250,
      "createdAt": "2026-06-18T19:11:47.788Z",
      "updatedAt": "2026-06-18T19:18:19.159Z"
    }
  ]
}

### GET /events/:id

ID ile tek etkinlik getirir.

Örnek endpoint:

GET /events/68a3442f30b50f94f3707a0c5

Etkinlik bulunamazsa `404 Not Found` döner.

## Tickets Endpoints

### POST /tickets/buy

Bir etkinlik için bilet satın alır.

Örnek request body:

{
  "eventId": "68a3442f30b50f94f3707a0c5",
  "buyerName": "AslanHarman",
  "buyerEmail": "harmandevopler@gmail.com",
  "quantity": 2
}

Başarılı işlemde:

* Ticket kaydı oluşturulur.
* Event üzerindeki `availableTickets` değeri satın alınan adet kadar azaltılır.
* `totalPrice`, `ticketPrice * quantity` şeklinde hesaplanır.
* İşlem MongoDB transaction/session içinde yapılır.

Örnek hesaplama:

ticketPrice: 250
quantity: 2
totalPrice: 500
availableTickets: 100 → 98

Başarılı response örneği:

{
  "success": true,
  "timestamp": "2026-06-18T19:18:11.308Z",
  "data": {
    "ticket": {
      "event": "68a3442f30b50f94f3707a0c5",
      "buyerName": "AslanHarman",
      "buyerEmail": "harmandevopler@gmail.com",
      "quantity": 2,
      "totalPrice": 500,
      "_id": "68a3443e0a5d694f3707e0c6",
      "createdAt": "2026-06-18T19:18:11.078Z",
      "updatedAt": "2026-06-18T19:18:11.078Z"
    },
    "event": {
      "_id": "68a3442f30b50f94f3707a0c5",
      "title": "Atlas Test Event",
      "description": "MongoDB Atlas transaction test",
      "startDate": "2026-07-01T19:00:00.000Z",
      "totalTickets": 100,
      "availableTickets": 98,
      "ticketPrice": 250,
      "createdAt": "2026-06-18T19:11:47.788Z",
      "updatedAt": "2026-06-18T19:18:19.159Z"
    }
  }
}

Yeterli bilet yoksa veya event bulunamazsa işlem yapılmaz ve hata döner:

{
  "message": "Etkinlik bulunamadı veya yeterli bilet yok",
  "error": "Bad Request",
  "statusCode": 400
}

### GET /tickets

Tüm biletleri listeler.

## Generic Repository Pattern

Projede ortak veritabanı işlemleri için abstract `BaseRepository` sınıfı kullanılmıştır.

Dosya:

src/commons/repositories/base.repository.ts

Bu sınıf temel olarak şu metotları sağlar:

* `find`
* `findOne`
* `findById`
* `create`
* `update`

`EventRepository` ve `TicketRepository`, bu base repository üzerinden çalışır.

Event repository dosyası:

src/events/repositories/event.repository.ts

Ticket repository dosyası:

src/tickets/repositories/ticket.repository.ts

Bu sayede servisler doğrudan Mongoose model ile konuşmak yerine repository katmanı üzerinden veritabanı işlemlerini yapar.

## Custom Validator

Event oluştururken `startDate` alanı için özel validator kullanılmıştır.

Dosya:

src/commons/validators/is-advanced-date.validator.ts

Decorator:

@IsAdvancedDate()

Kural:

Etkinlik tarihi bugünden en az 3 gün sonra olmalıdır.

Geçersiz tarih örneğinde dönen hata:

{
  "message": [
    "startDate must be at least 3 days after today"
  ],
  "error": "Bad Request",
  "statusCode": 400
}

## Interceptorlar

### ResponseInterceptor

Dosya:

src/commons/interceptors/response.interceptor.ts

Başarılı response’ları standart formata çevirir.

Standart response formatı:

{
  "success": true,
  "timestamp": "...",
  "data": {}
}

### LoggingInterceptor

Dosya:

src/commons/interceptors/logging.interceptor.ts

Her request için method, URL ve işlem süresini NestJS Logger ile loglar.

Örnek:

POST /tickets/buy 367ms
GET /events 133ms

## Transaction Mantığı

Bilet satın alma işlemi `POST /tickets/buy` endpointinde MongoDB transaction/session ile yapılır.

İşlem sırasında:

1. MongoDB session başlatılır.
2. Transaction başlatılır.
3. Event, `availableTickets >= quantity` şartı ile aranır.
4. Yeterli bilet varsa `availableTickets` değeri `$inc` ile azaltılır.
5. Ticket kaydı aynı session içinde oluşturulur.
6. İşlem başarılıysa transaction commit edilir.
7. Hata olursa transaction rollback yapılır.
8. Session kapatılır.

Bu sayede:

* Ticket oluşup event güncellenmeden kalmaz.
* Event güncellenip ticket oluşmadan kalmaz.
* `availableTickets` eksiye düşmez.

## Önemli Transaction Notu

MongoDB transaction/session kullanımı için MongoDB’nin replica set destekli çalışması gerekir.

Local standalone MongoDB ile transaction testlerinde hata alınabilir.

Bu nedenle transaction testi için:

* MongoDB Atlas
* Local MongoDB replica set
* Replica set destekli MongoDB deployment

kullanılmalıdır.

## Test Edilen Senaryolar

Aşağıdaki senaryolar Swagger üzerinden test edilmiştir:

* Event oluşturma başarılı.
* Event listeleme başarılı.
* ID ile event getirme başarılı.
* Geçersiz tarih ile event oluşturma 400 döndürür.
* Bilet satın alma başarılı.
* `availableTickets` doğru şekilde azalır.
* `totalPrice` doğru hesaplanır.
* Yetersiz bilet talebinde 400 döner.
* Yetersiz bilet talebinde `availableTickets` eksiye düşmez.
* ResponseInterceptor başarılı response’ları standart formata çevirir.
* LoggingInterceptor request method, URL ve süre bilgisini loglar.

## Örnek Test Akışı

Önce event oluşturulur:

{
  "title": "Atlas Test Event",
  "description": "MongoDB Atlas transaction test",
  "startDate": "2026-07-01T19:00:00.000Z",
  "totalTickets": 100,
  "ticketPrice": 250
}

Sonra dönen `_id` ile bilet alınır:

{
  "eventId": "68a3442f30b50f94f3707a0c5",
  "buyerName": "AslanHarman",
  "buyerEmail": "harmandevopler@gmail.com",
  "quantity": 2
}

Beklenen sonuç:

availableTickets: 100 → 98
totalPrice: 500

Fazla bilet testi:

{
  "eventId": "68a3442f30b50f94f3707a0c5",
  "buyerName": "Test User",
  "buyerEmail": "test@example.com",
  "quantity": 123456
}

Beklenen sonuç:

{
  "message": "Etkinlik bulunamadı veya yeterli bilet yok",
  "error": "Bad Request",
  "statusCode": 400
}

## Proje Klasör Yapısı

```text
src
├── commons
│   ├── interceptors
│   │   ├── logging.interceptor.ts
│   │   └── response.interceptor.ts
│   ├── repositories
│   │   └── base.repository.ts
│   └── validators
│       └── is-advanced-date.validator.ts
├── events
│   ├── dto
│   │   └── create-event.dto.ts
│   ├── repositories
│   │   └── event.repository.ts
│   ├── schemas
│   │   └── event.schema.ts
│   ├── events.controller.ts
│   ├── events.module.ts
│   └── events.service.ts
├── tickets
│   ├── dto
│   │   └── buy-ticket.dto.ts
│   ├── repositories
│   │   └── ticket.repository.ts
│   ├── schemas
│   │   └── ticket.schema.ts
│   ├── tickets.controller.ts
│   ├── tickets.module.ts
│   └── tickets.service.ts
├── app.controller.ts
├── app.module.ts
└── main.ts
