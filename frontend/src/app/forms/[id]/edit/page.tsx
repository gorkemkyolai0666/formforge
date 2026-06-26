'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/lib/api';
import Sidebar from '@/components/layout/sidebar';
import {
  ArrowLeft, Plus, Trash2, GripVertical, Send, Eye, Copy, Link2,
  Type, Mail, Hash, Calendar, List, Star, BarChart3, FileText,
  CheckSquare, AlignLeft, Phone, ChevronDown, Save,
} from 'lucide-react';

const fieldTypes = [
  { value: 'SHORT_TEXT', label: 'Kısa Metin', icon: Type },
  { value: 'LONG_TEXT', label: 'Uzun Metin', icon: AlignLeft },
  { value: 'EMAIL', label: 'E-posta', icon: Mail },
  { value: 'NUMBER', label: 'Sayı', icon: Hash },
  { value: 'PHONE', label: 'Telefon', icon: Phone },
  { value: 'DATE', label: 'Tarih', icon: Calendar },
  { value: 'SINGLE_CHOICE', label: 'Tek Seçim', icon: List },
  { value: 'MULTIPLE_CHOICE', label: 'Çoklu Seçim', icon: CheckSquare },
  { value: 'DROPDOWN', label: 'Açılır Liste', icon: ChevronDown },
  { value: 'RATING', label: 'Değerlendirme', icon: Star },
  { value: 'NPS', label: 'NPS Puanı', icon: BarChart3 },
  { value: 'LIKERT', label: 'Likert Ölçeği', icon: List },
];

export default function FormEditPage() {
  const params = useParams();
  const router = useRouter();
  const { token, user, loading: authLoading } = useAuth();
  const [form, setForm] = useState<any>(null);
  const [fields, setFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddField, setShowAddField] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showResponses, setShowResponses] = useState(false);
  const [responses, setResponses] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  const formId = params.id as string;

  useEffect(() => {
    if (!token || !formId) return;
    Promise.all([
      api.forms.get(formId, token),
      api.fields.list(formId, token),
    ])
      .then(([f, flds]) => {
        setForm(f);
        setFields(flds);
      })
      .catch(() => router.push('/dashboard'))
      .finally(() => setLoading(false));
  }, [token, formId, router]);

  const addField = async (type: string) => {
    if (!token) return;
    try {
      const field = await api.fields.create(formId, token, {
        type,
        label: `Yeni ${fieldTypes.find((t) => t.value === type)?.label || 'Alan'}`,
        required: false,
      });
      setFields([...fields, field]);
      setShowAddField(false);
      setEditingField(field.id);
    } catch {}
  };

  const updateField = async (id: string, data: any) => {
    if (!token) return;
    try {
      const updated = await api.fields.update(id, token, data);
      setFields(fields.map((f) => (f.id === id ? updated : f)));
      setEditingField(null);
    } catch {}
  };

  const deleteField = async (id: string) => {
    if (!token || !confirm('Bu alanı silmek istediğinize emin misiniz?')) return;
    try {
      await api.fields.delete(id, token);
      setFields(fields.filter((f) => f.id !== id));
    } catch {}
  };

  const publishForm = async () => {
    if (!token) return;
    try {
      const updated = await api.forms.publish(formId, token);
      setForm({ ...form, status: updated.status });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const loadResponses = async () => {
    if (!token) return;
    try {
      const data = await api.responses.list(formId, token);
      setResponses(data);
      setShowResponses(true);
    } catch {}
  };

  const copyShareLink = () => {
    const url = `${window.location.origin}/share/${formId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-arctic-50">
        <Sidebar />
        <main className="ml-64 p-8 flex items-center justify-center h-64">
          <div className="w-8 h-8 border-3 border-coral-500 border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  if (!user) { router.push('/auth/login'); return null; }

  return (
    <div className="min-h-screen bg-arctic-50">
      <Sidebar />
      <main className="ml-64 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push('/dashboard')} className="p-2 rounded-lg hover:bg-arctic-100 text-arctic-500">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-arctic-900">{form?.title}</h1>
              <p className="text-sm text-arctic-500">
                {form?.status === 'PUBLISHED' ? 'Yayında' : 'Taslak'} · {fields.length} alan · {form?.responseCount || 0} yanıt
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={copyShareLink} className="btn-outline text-sm flex items-center gap-2">
              <Link2 className="w-4 h-4" />
              {copied ? 'Kopyalandı!' : 'Paylaş'}
            </button>
            <button onClick={loadResponses} className="btn-outline text-sm flex items-center gap-2">
              <Eye className="w-4 h-4" /> Yanıtlar ({form?.responseCount || 0})
            </button>
            {form?.status === 'DRAFT' && (
              <button onClick={publishForm} className="btn-coral text-sm flex items-center gap-2">
                <Send className="w-4 h-4" /> Yayınla
              </button>
            )}
          </div>
        </div>

        <div className="max-w-3xl">
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="glass-card p-5 group">
                <div className="flex items-start gap-3">
                  <div className="mt-1 cursor-grab text-arctic-300 hover:text-arctic-500">
                    <GripVertical className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    {editingField === field.id ? (
                      <FieldEditor
                        field={field}
                        onSave={(data: any) => updateField(field.id, data)}
                        onCancel={() => setEditingField(null)}
                      />
                    ) : (
                      <div onClick={() => setEditingField(field.id)} className="cursor-pointer">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-arctic-400 bg-arctic-50 px-2 py-0.5 rounded">
                            {fieldTypes.find((t) => t.value === field.type)?.label || field.type}
                          </span>
                          {field.required && (
                            <span className="text-xs text-coral-500 font-medium">Zorunlu</span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-arctic-900">{field.label}</p>
                        {field.description && (
                          <p className="text-xs text-arctic-400 mt-0.5">{field.description}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => deleteField(field.id)}
                    className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 text-arctic-400 hover:text-red-500 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            {showAddField ? (
              <div className="glass-card p-6">
                <h3 className="text-sm font-semibold text-arctic-900 mb-4">Alan Tipi Seçin</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {fieldTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => addField(type.value)}
                      className="flex items-center gap-2.5 p-3 rounded-xl text-sm text-arctic-700 hover:bg-coral-50 hover:text-coral-600 border border-arctic-200 hover:border-coral-200 transition-all"
                    >
                      <type.icon className="w-4 h-4" />
                      {type.label}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowAddField(false)}
                  className="mt-4 text-sm text-arctic-500 hover:text-arctic-700"
                >
                  İptal
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAddField(true)}
                className="w-full py-4 rounded-xl border-2 border-dashed border-arctic-200 hover:border-coral-300 text-arctic-400 hover:text-coral-500 flex items-center justify-center gap-2 transition-all"
              >
                <Plus className="w-5 h-5" /> Alan Ekle
              </button>
            )}
          </div>
        </div>

        {showResponses && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-arctic-200 flex items-center justify-between">
                <h2 className="text-lg font-bold text-arctic-900">
                  Yanıtlar ({responses.length})
                </h2>
                <button onClick={() => setShowResponses(false)} className="btn-outline text-sm">
                  Kapat
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
                {responses.length === 0 ? (
                  <div className="text-center py-12 text-arctic-400">
                    Henüz yanıt yok
                  </div>
                ) : (
                  <div className="space-y-4">
                    {responses.map((resp) => (
                      <div key={resp.id} className="p-4 rounded-xl bg-arctic-50 border border-arctic-200">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-arctic-800">
                            {resp.respondentName || resp.respondentEmail || 'Anonim'}
                          </span>
                          <span className="text-xs text-arctic-400">
                            {resp.completedAt ? new Date(resp.completedAt).toLocaleDateString('tr-TR') : ''}
                            {resp.duration && ` · ${resp.duration}sn`}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {resp.answers?.map((ans: any) => (
                            <div key={ans.id} className="flex gap-2 text-sm">
                              <span className="font-medium text-arctic-600 min-w-0">
                                {ans.field?.label}:
                              </span>
                              <span className="text-arctic-800">{ans.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function FieldEditor({ field, onSave, onCancel }: { field: any; onSave: (data: any) => void; onCancel: () => void }) {
  const [label, setLabel] = useState(field.label);
  const [description, setDescription] = useState(field.description || '');
  const [placeholder, setPlaceholder] = useState(field.placeholder || '');
  const [required, setRequired] = useState(field.required);
  const [options, setOptions] = useState<string[]>(
    Array.isArray(field.options) ? field.options : []
  );

  const hasOptions = ['SINGLE_CHOICE', 'MULTIPLE_CHOICE', 'DROPDOWN', 'LIKERT', 'RANKING'].includes(field.type);

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="input-field font-medium"
        placeholder="Alan başlığı"
        autoFocus
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="input-field text-sm"
        placeholder="Açıklama (opsiyonel)"
      />
      <input
        type="text"
        value={placeholder}
        onChange={(e) => setPlaceholder(e.target.value)}
        className="input-field text-sm"
        placeholder="Placeholder metin"
      />
      {hasOptions && (
        <div>
          <label className="block text-xs font-medium text-arctic-600 mb-1">Seçenekler</label>
          {options.map((opt, i) => (
            <div key={i} className="flex items-center gap-2 mb-1">
              <input
                type="text"
                value={opt}
                onChange={(e) => {
                  const next = [...options];
                  next[i] = e.target.value;
                  setOptions(next);
                }}
                className="input-field text-sm"
              />
              <button
                onClick={() => setOptions(options.filter((_, j) => j !== i))}
                className="text-arctic-400 hover:text-red-500"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          <button
            onClick={() => setOptions([...options, `Seçenek ${options.length + 1}`])}
            className="text-xs text-coral-500 hover:text-coral-600 font-medium mt-1"
          >
            + Seçenek Ekle
          </button>
        </div>
      )}
      <label className="flex items-center gap-2 text-sm text-arctic-700">
        <input
          type="checkbox"
          checked={required}
          onChange={(e) => setRequired(e.target.checked)}
          className="w-4 h-4 rounded border-arctic-300 text-coral-500 focus:ring-coral-500"
        />
        Zorunlu alan
      </label>
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={() => onSave({ label, description, placeholder, required, options: hasOptions ? options : undefined })}
          className="btn-coral text-xs px-3 py-1.5 flex items-center gap-1"
        >
          <Save className="w-3.5 h-3.5" /> Kaydet
        </button>
        <button onClick={onCancel} className="text-xs text-arctic-500 hover:text-arctic-700">
          İptal
        </button>
      </div>
    </div>
  );
}
