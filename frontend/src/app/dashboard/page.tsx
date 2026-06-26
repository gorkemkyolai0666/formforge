'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/lib/api';
import {
  FileText, Plus, BarChart3, Eye, MessageSquare, Trash2, Copy, Send,
  MoreVertical, TrendingUp, Clock, Zap,
} from 'lucide-react';

interface Form {
  id: string;
  title: string;
  description: string;
  status: string;
  responseCount: number;
  viewCount: number;
  themeColor: string;
  createdAt: string;
  updatedAt: string;
  fields: { id: string }[];
  _count: { responses: number };
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [forms, setForms] = useState<Form[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newFormTitle, setNewFormTitle] = useState('');
  const [newFormDesc, setNewFormDesc] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      api.forms.list(token),
      api.users.dashboardStats(token),
    ])
      .then(([f, s]) => {
        setForms(f);
        setStats(s);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const handleCreateForm = async () => {
    if (!token || !newFormTitle.trim()) return;
    setCreating(true);
    try {
      const form = await api.forms.create(token, { title: newFormTitle, description: newFormDesc });
      setForms([form, ...forms]);
      setShowNewForm(false);
      setNewFormTitle('');
      setNewFormDesc('');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Bu formu silmek istediğinize emin misiniz?')) return;
    try {
      await api.forms.delete(id, token);
      setForms(forms.filter((f) => f.id !== id));
    } catch {}
  };

  const handleDuplicate = async (id: string) => {
    if (!token) return;
    try {
      const copy = await api.forms.duplicate(id, token);
      setForms([copy, ...forms]);
    } catch {}
  };

  const handlePublish = async (id: string) => {
    if (!token) return;
    try {
      const updated = await api.forms.publish(id, token);
      setForms(forms.map((f) => (f.id === id ? { ...f, status: updated.status } : f)));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-coral-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-arctic-900">Kontrol Paneli</h1>
          <p className="text-arctic-500 mt-1">Formlarınızı yönetin ve analitik verilerinizi takip edin</p>
        </div>
        <button onClick={() => setShowNewForm(true)} className="btn-coral flex items-center gap-2">
          <Plus className="w-4 h-4" /> Yeni Form
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Toplam Form', value: stats?.formCount || 0, icon: FileText, color: 'text-coral-500', bg: 'bg-coral-50' },
          { label: 'Toplam Yanıt', value: stats?.totalResponses || 0, icon: MessageSquare, color: 'text-indigo-500', bg: 'bg-indigo-50' },
          { label: 'Yayında', value: stats?.publishedForms || 0, icon: Send, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Bu Hafta', value: stats?.recentResponses || 0, icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-arctic-900">{s.value}</p>
            <p className="text-sm text-arctic-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {showNewForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
            <h2 className="text-xl font-bold text-arctic-900 mb-6">Yeni Form Oluştur</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-arctic-700 mb-1.5">Form Başlığı</label>
                <input
                  type="text"
                  value={newFormTitle}
                  onChange={(e) => setNewFormTitle(e.target.value)}
                  placeholder="Müşteri Memnuniyet Anketi"
                  className="input-field"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-arctic-700 mb-1.5">Açıklama (Opsiyonel)</label>
                <textarea
                  value={newFormDesc}
                  onChange={(e) => setNewFormDesc(e.target.value)}
                  placeholder="Formun amacını kısaca açıklayın..."
                  className="input-field resize-none h-24"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => setShowNewForm(false)} className="btn-outline">
                İptal
              </button>
              <button onClick={handleCreateForm} disabled={creating || !newFormTitle.trim()} className="btn-coral disabled:opacity-50">
                {creating ? 'Oluşturuluyor...' : 'Oluştur'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-arctic-900">Formlarınız</h2>
        {forms.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <FileText className="w-12 h-12 text-arctic-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-arctic-700 mb-2">Henüz formunuz yok</h3>
            <p className="text-arctic-500 mb-6">İlk formunuzu oluşturarak başlayın</p>
            <button onClick={() => setShowNewForm(true)} className="btn-coral inline-flex items-center gap-2">
              <Plus className="w-4 h-4" /> İlk Formunuzu Oluşturun
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forms.map((form) => (
              <div key={form.id} className="glass-card-hover p-5 group">
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: form.themeColor }}
                  />
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      form.status === 'PUBLISHED'
                        ? 'bg-emerald-50 text-emerald-700'
                        : form.status === 'CLOSED'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-arctic-100 text-arctic-600'
                    }`}
                  >
                    {form.status === 'PUBLISHED' ? 'Yayında' : form.status === 'CLOSED' ? 'Kapalı' : 'Taslak'}
                  </span>
                </div>
                <Link href={`/forms/${form.id}/edit`}>
                  <h3 className="text-base font-semibold text-arctic-900 hover:text-coral-500 transition-colors mb-1 line-clamp-1">
                    {form.title}
                  </h3>
                </Link>
                {form.description && (
                  <p className="text-sm text-arctic-500 line-clamp-2 mb-4">{form.description}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-arctic-400 mb-4">
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {form.responseCount} yanıt
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {form.viewCount} görüntüleme
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    {form.fields?.length || 0} alan
                  </span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/forms/${form.id}/edit`}
                    className="flex-1 text-center py-1.5 rounded-lg text-xs font-medium bg-arctic-50 text-arctic-700 hover:bg-arctic-100 transition-colors"
                  >
                    Düzenle
                  </Link>
                  {form.status === 'DRAFT' && (
                    <button
                      onClick={() => handlePublish(form.id)}
                      className="flex-1 text-center py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                    >
                      Yayınla
                    </button>
                  )}
                  <button
                    onClick={() => handleDuplicate(form.id)}
                    className="p-1.5 rounded-lg hover:bg-arctic-100 text-arctic-400"
                    title="Kopyala"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(form.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-arctic-400 hover:text-red-500"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
