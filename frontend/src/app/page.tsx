'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import {
  FileText, Zap, BarChart3, GitBranch, ArrowRight, CheckCircle2, Star, Shield, Globe,
} from 'lucide-react';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-arctic-50">
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-arctic-200/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-coral-500 to-coral-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-arctic-900">
              Form<span className="text-coral-500">Forge</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-arctic-600 hover:text-coral-500 transition-colors">
              Özellikler
            </a>
            <a href="#pricing" className="text-sm font-medium text-arctic-600 hover:text-coral-500 transition-colors">
              Fiyatlandırma
            </a>
            <a href="#testimonials" className="text-sm font-medium text-arctic-600 hover:text-coral-500 transition-colors">
              Kullanıcılar
            </a>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Link href="/dashboard" className="btn-coral text-sm flex items-center gap-2">
                Kontrol Paneli <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="btn-outline text-sm">Giriş Yap</Link>
                <Link href="/auth/register" className="btn-coral text-sm">Ücretsiz Başla</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-coral-50 border border-coral-200 mb-8">
            <Zap className="w-4 h-4 text-coral-500" />
            <span className="text-sm font-medium text-coral-700">AI destekli form oluşturucu</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-arctic-900 leading-tight mb-6 tracking-tight">
            Formlarınızı<br />
            <span className="bg-gradient-to-r from-coral-500 to-coral-600 bg-clip-text text-transparent">
              Saniyeler İçinde
            </span>{' '}
            Oluşturun
          </h1>
          <p className="text-lg md:text-xl text-arctic-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Doğal dil ile akıllı formlar oluşturun, gerçek zamanlı analitik ile yanıtları takip edin.
            Typeform&apos;dan daha akıllı, daha hızlı, daha uygun fiyatlı.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/register" className="btn-coral text-base px-8 py-3.5 flex items-center gap-2">
              Ücretsiz Hesap Oluştur <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#features" className="btn-outline text-base px-8 py-3.5">
              Özellikleri Keşfet
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6 mt-8 text-sm text-arctic-400">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Kredi kartı gerekmez</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 3 form ücretsiz</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> AI form üretimi dahil</span>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-6 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-arctic-900 mb-4">Neden FormForge?</h2>
            <p className="text-lg text-arctic-500 max-w-2xl mx-auto">
              Typeform&apos;un eksik bıraktığı her şeyi tamamlayan üç devrimci özellik
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: 'AI Form Zekâsı',
                desc: 'Doğal dille form oluşturun. "Müşteri anketi yap" deyin, AI tüm alanları, mantığı ve akışı otomatik oluştursun.',
                color: 'from-coral-500 to-coral-600',
              },
              {
                icon: BarChart3,
                title: 'Gerçek Zamanlı Analitik',
                desc: 'Canlı tamamlanma oranları, terk noktası analizi ve duygu skorlama. Typeform\'da ek ücretli, bizde dahil.',
                color: 'from-indigo-500 to-indigo-600',
              },
              {
                icon: GitBranch,
                title: 'Görsel Mantık Akışı',
                desc: 'Sürükle-bırak flowchart ile koşullu dallanma. Gizli mantık paneli yerine tam görsel kontrol.',
                color: 'from-emerald-500 to-emerald-600',
              },
            ].map((feature, i) => (
              <div key={i} className="glass-card-hover p-8">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-arctic-900 mb-3">{feature.title}</h3>
                <p className="text-arctic-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-arctic-900 mb-4">Basit ve Şeffaf Fiyatlandırma</h2>
            <p className="text-lg text-arctic-500">İhtiyacınıza uygun planı seçin. Gizli ücret yok.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Ücretsiz',
                price: '₺0',
                period: '/ay',
                features: ['3 form', '100 yanıt/ay', '5 AI kredisi/ay', 'Temel analitik', 'E-posta desteği'],
                cta: 'Ücretsiz Başla',
                popular: false,
              },
              {
                name: 'Pro',
                price: '₺149',
                period: '/ay',
                features: ['Sınırsız form', '10.000 yanıt/ay', '50 AI kredisi/ay', 'Gelişmiş analitik', 'Dönüşüm hunisi', 'Öncelikli destek'],
                cta: 'Pro\'ya Yükselt',
                popular: true,
              },
              {
                name: 'Business',
                price: '₺449',
                period: '/ay',
                features: ['Sınırsız her şey', 'Sınırsız AI kredisi', 'API erişimi', 'Beyaz etiket', 'Takım yönetimi', 'SLA garantisi'],
                cta: 'İletişime Geçin',
                popular: false,
              },
            ].map((plan, i) => (
              <div
                key={i}
                className={`rounded-2xl p-8 ${
                  plan.popular
                    ? 'bg-gradient-to-b from-coral-500 to-coral-600 text-white shadow-xl shadow-coral-500/25 scale-105'
                    : 'glass-card'
                }`}
              >
                {plan.popular && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-sm font-medium mb-4">
                    <Star className="w-3.5 h-3.5" /> En Popüler
                  </div>
                )}
                <h3 className={`text-xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-arctic-900'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className={`text-4xl font-extrabold ${plan.popular ? 'text-white' : 'text-arctic-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.popular ? 'text-white/70' : 'text-arctic-400'}`}>
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${plan.popular ? 'text-white' : 'text-emerald-500'}`} />
                      <span className={plan.popular ? 'text-white/90' : 'text-arctic-600'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/register"
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    plan.popular
                      ? 'bg-white text-coral-600 hover:bg-white/90'
                      : 'bg-arctic-900 text-white hover:bg-arctic-800'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 px-6 bg-white/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-arctic-900 mb-4">Kullanıcılarımız Ne Diyor?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: 'AI ile form oluşturmak inanılmaz hızlı. 5 dakikada profesyonel bir anket hazırladım.',
                name: 'Zeynep Kaya',
                role: 'Pazarlama Müdürü',
              },
              {
                quote: 'Gerçek zamanlı analitik sayesinde terk noktalarını hemen tespit ettik ve dönüşüm oranımızı %40 artırdık.',
                name: 'Ahmet Demir',
                role: 'Ürün Yöneticisi',
              },
              {
                quote: 'Görsel mantık akışı harika. Typeform\'daki karmaşık ayarlarla uğraşmak yerine sürükle-bırak ile mantık kuruyoruz.',
                name: 'Selin Öztürk',
                role: 'UX Araştırmacısı',
              },
            ].map((t, i) => (
              <div key={i} className="glass-card p-6">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-arctic-600 mb-6 leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
                <div>
                  <p className="font-semibold text-arctic-900">{t.name}</p>
                  <p className="text-sm text-arctic-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-arctic-900 mb-4">
            Hemen Başlayın
          </h2>
          <p className="text-lg text-arctic-500 mb-8">
            Ücretsiz hesap oluşturun ve ilk formunuzu 60 saniyede hazırlayın.
          </p>
          <Link href="/auth/register" className="btn-coral text-lg px-10 py-4 inline-flex items-center gap-2">
            Ücretsiz Hesap Oluştur <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-arctic-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-coral-500 to-coral-600 flex items-center justify-center">
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-arctic-900">FormForge</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-arctic-400">
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> KVKK Uyumlu</span>
            <span className="flex items-center gap-1.5"><Globe className="w-4 h-4" /> Türkçe &amp; İngilizce</span>
          </div>
          <p className="text-sm text-arctic-400">&copy; 2026 FormForge. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
