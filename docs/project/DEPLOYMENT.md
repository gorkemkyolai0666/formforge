# FormForge — Dağıtım Dokümanı

## Altyapı

| Bileşen | Platform | URL |
|---------|----------|-----|
| Backend API | Railway | https://formforge-backend-production.up.railway.app/api |
| Frontend | Vercel | https://formforge.vercel.app |
| Veritabanı | Railway PostgreSQL | Internal connection |

## Ortam Değişkenleri

### Backend (Railway)
| Değişken | Değer |
|----------|-------|
| DATABASE_URL | postgresql://formforge:<password>@<host>:5432/formforge |
| JWT_SECRET | <secure-random> |
| PORT | 8080 |
| FRONTEND_URL | https://formforge.vercel.app |

### Frontend (Vercel)
| Değişken | Değer |
|----------|-------|
| NEXT_PUBLIC_API_URL | https://formforge-backend-production.up.railway.app/api |

## Portlar
- Backend geliştirme: 5235
- Frontend geliştirme: 4235
- Railway üretim: 8080

## Demo Hesap
- **E-posta:** demo@formforge.com.tr
- **Şifre:** demo123456

## Dağıtım Akışı
1. `main` branch'e push → CI tetiklenir
2. Backend build + test → Frontend build
3. Provision job: Railway + Vercel otomatik dağıtım
4. Provision scripts ortam değişkenlerini otomatik enjekte eder

## Lokal Geliştirme
```bash
# Backend
cd backend
cp .env.example .env
npm install --legacy-peer-deps
npx prisma migrate dev
npx prisma db seed
npm run start:dev

# Frontend
cd frontend
cp .env.example .env
npm install
npm run dev
```
