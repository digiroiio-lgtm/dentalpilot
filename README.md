# DentalPilot CRM

DentalPilot için Next.js + Prisma tabanlı, Türkçe arayüzlü CRM. Lead pipeline'ı, deal akışı ve ayar panelleriyle klinik operasyonlarını tek yerden yönetin.

## Özellikler

- **Lead pipeline**: İlk temas, Foto bekleniyor, Fiyat verildi, Pozitif, Deal confirmed, Kaybedildi kolonlarıyla Kanban görünümü.
- **Lead detayları**: Görev yönetimi, aktivite kayıtları, tedavi planları ve fiyat listesi entegrasyonu.
- **Deal akışı**: Hotel/transfer seçimi, e-posta gönderim durumları ve deal onaylama süreçleri.
- **Dosya yükleme**: Her lead için belgeleri `public/uploads` dizinine kaydeder, CRM üzerinden görüntülenir.
- **Ayarlar**: Oteller, transfer seçenekleri, fiyat listesi ve e-posta şablonları için yönetim ekranı.

## Kurulum

1. Bağımlılıkları yükleyin:

   ```bash
   npm install
   ```

2. Ortam değişkenlerini çoğaltın:

   ```bash
   cp .env.example .env
   ```

   `DATABASE_URL` değerini PostgreSQL bağlantınıza göre güncelleyin.

3. Prisma şemasını veritabanına uygulayın:

   ```bash
   npx prisma migrate dev
   ```

4. Geliştirme sunucusunu başlatın:

   ```bash
   npm run dev
   ```

## Önemli Diziler

- `src/app/page.tsx`: Pipeline ve yeni lead formu.
- `src/app/leads/[leadId]/page.tsx`: Lead detay ekranı, görevler, aktiviteler, tedavi planı, deal ve dosyalar.
- `src/app/ayarlar/page.tsx`: Otel, transfer, fiyat listesi ve şablon yönetimi.
- `src/app/actions.ts`: Server action'lar ile CRUD mantığı.
- `prisma/schema.prisma`: Postgres veri modeli.

## File Upload

API route'u (`app/api/leads/[leadId]/files`) dosyaları `public/uploads/<leadId>` dizinine yazar. Üretim ortamında kalıcı ve güvenli bir dosya depolaması kullanmanız önerilir.

## Geliştirme Notları

- UI tamamen Türkçe ve Tailwind CSS ile hazırlanmıştır.
- Server Actions, formlarda otomatik revalidate için `revalidatePath` kullanır.
- Pipeline durumları `src/lib/statuses.ts` üzerinden merkezi olarak yönetilir.
