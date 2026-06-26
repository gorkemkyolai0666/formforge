# FormForge — Ürün Gereksinimleri Dokümanı

**Versiyon:** 1.0  
**Tarih:** 2026-06-26  
**Durum:** Geliştirme Aşamasında  

## Özet

FormForge, Typeform'un evrimsel varyantı olarak tasarlanmış, AI destekli akıllı form oluşturucu ve anket zekâsı platformudur. Doğal dil tabanlı form üretimi, gerçek zamanlı yanıt analitiği ve görsel koşullu mantık akış oluşturucu ile Typeform'un temel kusurlarını çözer.

## Hedef Kullanıcı Profili

- **Küçük-Orta İşletmeler**: Müşteri memnuniyeti, pazar araştırması, geri bildirim formları
- **Pazarlama Ekipleri**: Lead generation, kampanya anketleri, A/B form testi
- **İnsan Kaynakları**: İşe alım formları, çalışan memnuniyet anketleri
- **Eğitim Kurumları**: Sınav oluşturma, öğrenci geri bildirimi
- **SaaS Şirketleri**: Onboarding anketleri, churn analizi, NPS ölçümü

## Temel Özellikler

### 1. AI Form Intelligence Engine
- Doğal dil tanımından tam form üretimi
- Akıllı alan tipi algılama (e-posta, telefon, tarih, NPS, Likert)
- Otomatik koşullu mantık önerileri
- Türkçe ve İngilizce çok dilli destek

### 2. Form Oluşturucu
- Sürükle-bırak alan ekleme
- 15+ alan tipi (kısa metin, uzun metin, e-posta, sayı, tarih, çoktan seçmeli, tek seçim, dosya yükleme, değerlendirme, NPS, Likert ölçeği, matris, sıralama, resim seçimi, imza)
- Alan doğrulama kuralları (zorunlu, regex, min/max)
- Form temaları ve markalaştırma

### 3. Gerçek Zamanlı Yanıt Analitiği
- Canlı yanıt sayacı ve tamamlanma oranı
- Alan bazında terk analizi
- Yanıt süresi dağılımı
- Duygu analizi (açık uçlu yanıtlar)
- Dönüşüm hunisi görselleştirmesi

### 4. Görsel Koşullu Mantık Oluşturucu
- Flowchart tabanlı mantık düzenleyici
- Çoklu dallanma kuralları
- Yanıt tabanlı yönlendirme
- Gerçek zamanlı mantık önizlemesi

### 5. Paylaşım ve Dağıtım
- Benzersiz form bağlantıları
- Gömülebilir iframe widget'ları
- QR kod paylaşımı
- Özelleştirilebilir teşekkür sayfaları

### 6. Kullanıcı Yönetimi
- JWT tabanlı kimlik doğrulama
- Profil ve hesap ayarları
- Abonelik yönetimi
- Bildirim sistemi

## Teknik Yığın

| Katman | Teknoloji |
|--------|-----------|
| Backend | NestJS, Prisma ORM, PostgreSQL |
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Kimlik Doğrulama | JWT (access + refresh token) |
| AI Motor | OpenAI GPT-4 API (opsiyonel) |
| Dağıtım | Railway (Backend), Vercel (Frontend) |

## Portlar

- **Backend:** 5235
- **Frontend:** 4235

## Tasarım Teması

**"Arctic Pearl & Vivid Coral"** — Açık glassmorphism teması
- Ana Arka Plan: `#F8F9FC` (Arctic Pearl)
- Yüzey/Kart: `#FFFFFF` cam efektleri ile
- Marka Vurgu: `#FF6B4A` (Vivid Coral)
- İkincil Vurgu: `#6366F1` (Indigo Accent)
- Başarı: `#10B981`
- Uyarı: `#F59E0B`
- Hata: `#EF4444`

## Demo Hesap

- **E-posta:** demo@formforge.com.tr
- **Şifre:** demo123456
