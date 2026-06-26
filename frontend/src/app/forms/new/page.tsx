'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/lib/api';
import Sidebar from '@/components/layout/sidebar';
import { FileText, ArrowRight, Sparkles, Palette } from 'lucide-react';

export default function NewFormPage() {
  const { token, user, loading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [themeColor, setThemeColor] = useState('#FF6B4A');
  const [creating, setCreating] = useState(false);

  const colors = ['#FF6B4A', '#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

  const handleCreate = async () => {
    if (!token || !title.trim()) return;
    setCreating(true);
    try {
      const form = await api.forms.create(token, { title, description, themeColor });
      router.push(`/forms/${form.id}/edit`);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  if (loading) return null;
  if (!user) { router.push('/auth/login'); return null; }

  return (
    <div className="min-h-screen bg-arctic-50">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-arctic-900">Yeni Form Oluştur</h1>
            <p className="text-arctic-500 mt-1">Formunuzun temel bilgilerini girin</p>
          </div>

          <div className="glass-card p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-arctic-700 mb-1.5">Form Başlığı *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Müşteri Memnuniyet Anketi"
                  className="input-field text-lg"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-arctic-700 mb-1.5">Açıklama</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Bu formun amacını kısaca açıklayın..."
                  className="input-field resize-none h-28"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-arctic-700 mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4" /> Tema Rengi
                </label>
                <div className="flex items-center gap-3">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setThemeColor(c)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        themeColor === c ? 'border-arctic-900 scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4">
                <button
                  onClick={handleCreate}
                  disabled={creating || !title.trim()}
                  className="btn-coral flex items-center gap-2 disabled:opacity-50"
                >
                  {creating ? 'Oluşturuluyor...' : 'Form Oluştur'}
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button onClick={() => router.back()} className="btn-outline">
                  İptal
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
