# FormForge — Mimari Dokümanı

## Genel Bakış

FormForge, NestJS + Prisma backend ve Next.js frontend kullanarak tasarlanmış tam yığın bir form oluşturucu ve anket zekâsı platformudur.

## Veritabanı İlişkileri

```
User (1) ──────── (N) Form
User (1) ──────── (N) Notification
User (1) ──────── (1) Subscription

Form (1) ──────── (N) Field
Form (1) ──────── (N) Response
Form (1) ──────── (N) FormAnalytics

Field (1) ─────── (N) Answer
Field (1) ─────── (N) FieldLogic

Response (1) ──── (N) Answer
```

## Backend Modülleri

| Modül | Sorumluluk |
|-------|-----------|
| AuthModule | JWT tabanlı kimlik doğrulama, kayıt, giriş |
| UsersModule | Kullanıcı profil yönetimi |
| FormsModule | Form CRUD, yayınlama, tema yönetimi |
| FieldsModule | Form alanları CRUD, sıralama, doğrulama kuralları |
| ResponsesModule | Form yanıtları toplama ve listeleme |
| AnalyticsModule | Yanıt analitiği, terk analizi, dönüşüm hunisi |
| NotificationsModule | Bildirim sistemi |
| HealthModule | Sağlık kontrolü endpoint'i |

## API Endpoint Yapısı

### Auth
- `POST /api/auth/register` → 201 (Yeni kullanıcı oluşturma)
- `POST /api/auth/login` → 200 (Giriş, JWT token döner)
- `GET /api/auth/profile` → 200 (JWT ile profil bilgisi)

### Forms
- `GET /api/forms` → 200 (Kullanıcı formlarını listele)
- `POST /api/forms` → 201 (Yeni form oluştur)
- `GET /api/forms/:id` → 200 (Form detayı)
- `PATCH /api/forms/:id` → 200 (Form güncelle)
- `DELETE /api/forms/:id` → 200 (Form sil)
- `POST /api/forms/:id/publish` → 200 (Formu yayınla)
- `POST /api/forms/:id/duplicate` → 201 (Formu klonla)

### Fields
- `GET /api/forms/:formId/fields` → 200 (Form alanlarını listele)
- `POST /api/forms/:formId/fields` → 201 (Yeni alan ekle)
- `PATCH /api/fields/:id` → 200 (Alan güncelle)
- `DELETE /api/fields/:id` → 200 (Alan sil)
- `PATCH /api/forms/:formId/fields/reorder` → 200 (Alanları yeniden sırala)

### Responses
- `POST /api/forms/:formId/responses` → 201 (Form yanıtı gönder — public)
- `GET /api/forms/:formId/responses` → 200 (Form yanıtlarını listele)
- `GET /api/responses/:id` → 200 (Yanıt detayı)

### Analytics
- `GET /api/forms/:formId/analytics` → 200 (Form analitiği)
- `GET /api/forms/:formId/analytics/fields` → 200 (Alan bazında analitik)
- `GET /api/forms/:formId/analytics/funnel` → 200 (Dönüşüm hunisi)

### Notifications
- `GET /api/notifications` → 200 (Bildirimleri listele)
- `PATCH /api/notifications/:id/read` → 200 (Bildirimi okundu işaretle)
- `PATCH /api/notifications/read-all` → 200 (Tümünü okundu işaretle)

### Health
- `GET /api/health` → 200 (Sistem sağlık durumu)

## Frontend Sayfa Yapısı

| Route | Sayfa | Açıklama |
|-------|-------|----------|
| `/` | Landing | Tanıtım sayfası |
| `/auth/login` | Giriş | Kullanıcı girişi |
| `/auth/register` | Kayıt | Yeni kullanıcı kaydı |
| `/dashboard` | Kontrol Paneli | Form listesi, hızlı eylemler |
| `/forms/new` | Form Oluşturucu | Yeni form oluşturma |
| `/forms/[id]/edit` | Form Düzenleyici | Form düzenleme |
| `/analytics` | Analitik | Genel analitik dashboard |
| `/settings` | Ayarlar | Profil, abonelik, bildirimler |
| `/share/[id]` | Form Paylaşım | Halka açık form doldurma |

## Tasarım Sistemi

- **Tema:** Arctic Pearl & Vivid Coral (Açık glassmorphism)
- **Arka Plan:** #F8F9FC
- **Yüzey:** #FFFFFF (backdrop-blur glassmorphism)
- **Vurgu:** #FF6B4A (Vivid Coral)
- **İkincil:** #6366F1 (Indigo)
- **Tipografi:** Inter font ailesi
- **Border Radius:** rounded-xl (12px)
- **Padding:** p-6 / p-8 konteyner standardı
