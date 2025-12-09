# Dental Klinik Micro CRM

Next.js 14, App Router ve Prisma ile geliştirilen Dental Klinik Micro CRM; dental turizm kliniklerinin lead yönetimi, tedavi planı, deal akışı ve operasyon takiplerini tek panelde toplar. Tüm arayüz Türkçe'dir.

## Ana Özellikler

- **Kimlik doğrulama**: NextAuth Credentials sağlayıcısı ve rol tabanlı (Admin, Koordinatör, Doktor, Viewer) yetkilendirme.
- **Dashboard**: KPI kartları, pipeline özeti, görev listesi ve aktivite zaman çizelgesi.
- **Lead yönetimi**: Tablo + drag & drop Kanban görünümü, filtreler, yeni lead formu, kayıp nedeni zorunluluğu.
- **Lead detay**: Hasta/lead kartları, görevler, aktiviteler, dosya yükleme, tedavi planları ve plan kalemleri.
- **Fiyat listesi**: Para birimi destekli PriceItem CRUD, aktif/pasif yönetimi.
- **Deal ekranı**: Deal kayıtlarını görüntüleme ve lead detayından deal confirmed sürecine yönlendirme.
- **Ayarlar**: Klinik özeti, oteller, transfer firmaları ve e-posta şablonları için yönetim sayfaları.

## Kurulum

```bash
npm install
cp .env.example .env
# .env içindeki DATABASE_URL'i PostgreSQL bağlantınıza göre güncelleyin
npx prisma generate
npx prisma migrate dev
npm run dev
```

> **Not:** NextAuth Credentials için kullanıcı kayıt UI'ı yoktur. Prisma üzerinden kullanıcıyı manuel oluşturup `passwordHash` alanını bcrypt ile üretmeniz gerekir.

## Dizim

- `prisma/schema.prisma` – Veri modeli, roller, pipeline aşamaları, price listesi vb.
- `src/app` – App Router sayfaları
  - `(app)/layout.tsx` – CRM kabuğu (sidebar + topbar)
  - `(app)/dashboard` – KPI + pipeline özeti
  - `(app)/leads` – Lead listesi, Kanban ve yeni lead formu
  - `(app)/leads/[leadId]` – Lead detay sayfası
  - `(app)/price-list`, `(app)/deals`, `(app)/settings/*` – Diğer modüller
  - `/login` – Giriş ekranı
- `src/app/actions.ts` – Server Actions (lead oluşturma, aşama değişimi, tedavi planı vb.)
- `src/app/api/leads/[leadId]/files` – Dosya yükleme API route'u
- `src/lib/auth.ts` – NextAuth yapılandırması
- `src/components` – UI atomları (Button, Card), layout bileşenleri ve Kanban + modal bileşenleri

## Geliştirme Notları

- Pipeline sürükle-bırak işlemleri `@dnd-kit` ile, kayıp aşamasına düşerken modal istemi tetikler.
- Lost reason kayıtları otomatik Activity oluşturur ve lead statüsünü günceller.
- Bütün formlar Server Action kullanır; işlem sonrası ilgili yollar `revalidatePath` ile yenilenir.
- Dosya yükleme `public/uploads/<leadId>` altında saklanır; üretimde kalıcı depolama önerilir.

Geri bildirim, yeni modüller (örn. deal sihirbazı, kullanıcı yönetimi) veya entegrasyon ihtiyaçları için katkılarınızı bekleriz.
