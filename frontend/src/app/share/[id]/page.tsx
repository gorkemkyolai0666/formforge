'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import {
  FileText, Star, CheckCircle2, AlertCircle, Send, Loader2,
} from 'lucide-react';

export default function PublicFormPage() {
  const params = useParams();
  const formId = params.id as string;
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [startTime] = useState(new Date().toISOString());

  useEffect(() => {
    api.forms.getPublic(formId)
      .then(setForm)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [formId]);

  const setAnswer = (fieldId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const missingRequired = form.fields
      .filter((f: any) => f.required && !answers[f.id]?.trim())
      .map((f: any) => f.label);

    if (missingRequired.length > 0) {
      alert(`Lütfen zorunlu alanları doldurun:\n${missingRequired.join('\n')}`);
      return;
    }

    setSubmitting(true);
    try {
      await api.responses.submit(formId, {
        startedAt: startTime,
        answers: Object.entries(answers)
          .filter(([_, value]) => value.trim())
          .map(([fieldId, value]) => ({ fieldId, value })),
      });
      setSubmitted(true);
    } catch (err: any) {
      alert(err.message);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F8F9FC' }}>
        <Loader2 className="w-8 h-8 text-coral-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F8F9FC' }}>
        <div className="glass-card p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-arctic-900 mb-2">Form Bulunamadı</h2>
          <p className="text-arctic-500">{error}</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: form.bgColor || '#F8F9FC' }}>
        <div className="glass-card p-12 text-center max-w-md">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
            style={{ backgroundColor: `${form.themeColor}20` }}
          >
            <CheckCircle2 className="w-8 h-8" style={{ color: form.themeColor }} />
          </div>
          <h2 className="text-2xl font-bold text-arctic-900 mb-3">{form.thankYouTitle}</h2>
          <p className="text-arctic-500 leading-relaxed">{form.thankYouMsg}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: form.bgColor || '#F8F9FC' }}>
      <div className="max-w-2xl mx-auto">
        <div className="glass-card p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${form.themeColor}20` }}
            >
              <FileText className="w-5 h-5" style={{ color: form.themeColor }} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-arctic-900">{form.title}</h1>
              {form.description && (
                <p className="text-sm text-arctic-500 mt-0.5">{form.description}</p>
              )}
            </div>
          </div>
          <div className="h-1 rounded-full" style={{ backgroundColor: `${form.themeColor}30` }}>
            <div
              className="h-1 rounded-full transition-all duration-500"
              style={{
                backgroundColor: form.themeColor,
                width: `${(Object.keys(answers).length / Math.max(form.fields.length, 1)) * 100}%`,
              }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {form.fields.map((field: any, index: number) => (
              <div key={field.id} className="glass-card p-6">
                <label className="block text-sm font-medium text-arctic-900 mb-1">
                  {field.label}
                  {field.required && <span className="text-coral-500 ml-1">*</span>}
                </label>
                {field.description && (
                  <p className="text-xs text-arctic-400 mb-3">{field.description}</p>
                )}
                <FormField
                  field={field}
                  value={answers[field.id] || ''}
                  onChange={(val: string) => setAnswer(field.id, val)}
                  themeColor={form.themeColor}
                />
              </div>
            ))}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-50"
              style={{ backgroundColor: form.themeColor }}
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Send className="w-4 h-4" /> Yanıtı Gönder
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-center mt-6 text-xs text-arctic-400">
          FormForge ile oluşturuldu
        </p>
      </div>
    </div>
  );
}

function FormField({ field, value, onChange, themeColor }: any) {
  switch (field.type) {
    case 'SHORT_TEXT':
    case 'EMAIL':
    case 'PHONE':
      return (
        <input
          type={field.type === 'EMAIL' ? 'email' : field.type === 'PHONE' ? 'tel' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || ''}
          className="input-field"
        />
      );
    case 'LONG_TEXT':
      return (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || ''}
          className="input-field resize-none h-28"
        />
      );
    case 'NUMBER':
      return (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder || ''}
          className="input-field"
        />
      );
    case 'DATE':
      return (
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field"
        />
      );
    case 'SINGLE_CHOICE':
      return (
        <div className="space-y-2">
          {(Array.isArray(field.options) ? field.options : []).map((opt: string, i: number) => (
            <label key={i} className="flex items-center gap-3 p-3 rounded-xl border border-arctic-200 hover:border-coral-200 cursor-pointer transition-all">
              <input
                type="radio"
                name={field.id}
                value={opt}
                checked={value === opt}
                onChange={() => onChange(opt)}
                className="w-4 h-4"
                style={{ accentColor: themeColor }}
              />
              <span className="text-sm text-arctic-700">{opt}</span>
            </label>
          ))}
        </div>
      );
    case 'MULTIPLE_CHOICE':
      const selected = value ? value.split(',') : [];
      return (
        <div className="space-y-2">
          {(Array.isArray(field.options) ? field.options : []).map((opt: string, i: number) => (
            <label key={i} className="flex items-center gap-3 p-3 rounded-xl border border-arctic-200 hover:border-coral-200 cursor-pointer transition-all">
              <input
                type="checkbox"
                checked={selected.includes(opt)}
                onChange={() => {
                  const next = selected.includes(opt)
                    ? selected.filter((s: string) => s !== opt)
                    : [...selected, opt];
                  onChange(next.join(','));
                }}
                className="w-4 h-4 rounded"
                style={{ accentColor: themeColor }}
              />
              <span className="text-sm text-arctic-700">{opt}</span>
            </label>
          ))}
        </div>
      );
    case 'DROPDOWN':
      return (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field"
        >
          <option value="">Seçiniz...</option>
          {(Array.isArray(field.options) ? field.options : []).map((opt: string, i: number) => (
            <option key={i} value={opt}>{opt}</option>
          ))}
        </select>
      );
    case 'RATING':
      return (
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange(String(n))}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`w-8 h-8 ${
                  n <= parseInt(value || '0')
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-arctic-300'
                }`}
              />
            </button>
          ))}
        </div>
      );
    case 'NPS':
      return (
        <div className="flex items-center gap-1.5 flex-wrap">
          {Array.from({ length: 11 }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onChange(String(i))}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                value === String(i)
                  ? 'text-white shadow-md'
                  : 'bg-arctic-100 text-arctic-600 hover:bg-arctic-200'
              }`}
              style={value === String(i) ? { backgroundColor: themeColor } : {}}
            >
              {i}
            </button>
          ))}
        </div>
      );
    case 'LIKERT':
      return (
        <div className="space-y-2">
          {(Array.isArray(field.options) ? field.options : ['Kesinlikle Katılıyorum', 'Katılıyorum', 'Kararsızım', 'Katılmıyorum', 'Kesinlikle Katılmıyorum']).map(
            (opt: string, i: number) => (
              <label key={i} className="flex items-center gap-3 p-3 rounded-xl border border-arctic-200 hover:border-coral-200 cursor-pointer transition-all">
                <input
                  type="radio"
                  name={field.id}
                  value={opt}
                  checked={value === opt}
                  onChange={() => onChange(opt)}
                  className="w-4 h-4"
                  style={{ accentColor: themeColor }}
                />
                <span className="text-sm text-arctic-700">{opt}</span>
              </label>
            ),
          )}
        </div>
      );
    default:
      return (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field"
        />
      );
  }
}
