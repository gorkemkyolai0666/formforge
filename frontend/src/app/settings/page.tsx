'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/lib/api';
import {
  User, Mail, Lock, CreditCard, Zap, Shield, Bell, Key, Save, CheckCircle2,
} from 'lucide-react';

export default function SettingsPage() {
  const { user, token, refreshProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const data: any = {};
      if (name.trim()) data.name = name;
      if (password.trim()) data.password = password;
      await api.users.update(token, data);
      await refreshProfile();
      setSaved(true);
      setPassword('');
      setTimeout(() => setSaved(false), 3000);
    } catch {}
    setSaving(false);
  };

  const planConfig: Record<string, any> = {
    FREE: { label: 'Ücretsiz', color: 'bg-arctic-100 text-arctic-700', forms: 3, responses: '100/ay', ai: 5 },
    PRO: { label: 'Pro', color: 'bg-coral-100 text-coral-700', forms: '∞', responses: '10.000/ay', ai: 50 },
    BUSINESS: { label: 'Business', color: 'bg-indigo-100 text-indigo-700', forms: '∞', responses: '∞', ai: '∞' },
  };

  const currentPlan = planConfig[user?.plan || 'FREE'];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-arctic-900">Ayarlar</h1>
        <p className="text-arctic-500 mt-1">Hesap ve abonelik ayarlarınızı yönetin</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-arctic-900 mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-coral-500" /> Profil Bilgileri
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-arctic-700 mb-1.5">Ad Soyad</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-arctic-700 mb-1.5">E-posta</label>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="input-field bg-arctic-50 text-arctic-400"
                  />
                  <Mail className="w-4 h-4 text-arctic-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-arctic-700 mb-1.5">Yeni Şifre</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Değiştirmek istemiyorsanız boş bırakın"
                  className="input-field"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-coral flex items-center gap-2 disabled:opacity-50"
                >
                  <Save className="w-4 h-4" /> {saving ? 'Kaydediliyor...' : 'Kaydet'}
                </button>
                {saved && (
                  <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" /> Kaydedildi
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-arctic-900 mb-6 flex items-center gap-2">
              <Key className="w-5 h-5 text-coral-500" /> API Erişimi
            </h2>
            <div className="p-4 rounded-xl bg-arctic-50 border border-arctic-200">
              <p className="text-sm text-arctic-600 mb-3">API anahtarınız ile formlarınıza programatik erişim sağlayabilirsiniz.</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 rounded-lg bg-white border border-arctic-200 text-sm text-arctic-700 font-mono">
                  ff_live_•••••••••••••••••••••
                </code>
                <button className="btn-outline text-xs px-3 py-2">Kopyala</button>
              </div>
              <p className="text-xs text-arctic-400 mt-2">Bu özellik Business planında kullanılabilir.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-arctic-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-coral-500" /> Abonelik
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-arctic-600">Plan</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${currentPlan.color}`}>
                  {currentPlan.label}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-arctic-600">Form Limiti</span>
                <span className="text-sm font-medium text-arctic-900">{currentPlan.forms}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-arctic-600">Yanıt Limiti</span>
                <span className="text-sm font-medium text-arctic-900">{currentPlan.responses}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-arctic-600">AI Kredisi</span>
                <span className="text-sm font-medium text-arctic-900">{currentPlan.ai}</span>
              </div>
            </div>
            {user?.plan === 'FREE' && (
              <button className="btn-coral w-full mt-4 text-sm">Pro&apos;ya Yükselt</button>
            )}
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-arctic-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-coral-500" /> AI Kredileri
            </h2>
            <div className="text-center py-4">
              <p className="text-3xl font-bold text-coral-500">{user?.aiCredits || 0}</p>
              <p className="text-sm text-arctic-500 mt-1">Kalan AI Kredisi</p>
            </div>
            <div className="w-full bg-arctic-100 rounded-full h-2 mt-2">
              <div
                className="bg-gradient-to-r from-coral-400 to-coral-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(((user?.aiCredits || 0) / 50) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold text-arctic-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-coral-500" /> Güvenlik
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-arctic-50">
                <span className="text-sm text-arctic-600">İki faktörlü doğrulama</span>
                <span className="text-xs font-medium text-arctic-400">Yakında</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-arctic-50">
                <span className="text-sm text-arctic-600">KVKK uyumluluk</span>
                <span className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
