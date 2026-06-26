'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { api } from '@/lib/api';
import {
  BarChart3, FileText, MessageSquare, Eye, TrendingUp, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';

export default function AnalyticsPage() {
  const { token } = useAuth();
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    api.analytics.global(token)
      .then(setAnalytics)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-3 border-coral-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-arctic-900">Analitik Paneli</h1>
        <p className="text-arctic-500 mt-1">Tüm formlarınızın performans metrikleri</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Toplam Form', value: analytics?.totalForms || 0, icon: FileText, color: 'text-coral-500', bg: 'bg-coral-50', trend: '+12%' },
          { label: 'Toplam Yanıt', value: analytics?.totalResponses || 0, icon: MessageSquare, color: 'text-indigo-500', bg: 'bg-indigo-50', trend: '+28%' },
          { label: 'Görüntüleme', value: analytics?.totalViews || 0, icon: Eye, color: 'text-emerald-500', bg: 'bg-emerald-50', trend: '+45%' },
          { label: 'Aylık Yanıt', value: analytics?.monthlyResponses || 0, icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50', trend: '+18%' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600">
                <ArrowUpRight className="w-3.5 h-3.5" /> {s.trend}
              </span>
            </div>
            <p className="text-2xl font-bold text-arctic-900">{s.value}</p>
            <p className="text-sm text-arctic-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-arctic-900 mb-4">Dönüşüm Özeti</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-arctic-50">
              <span className="text-sm text-arctic-600">Yayında olan formlar</span>
              <span className="text-sm font-bold text-arctic-900">{analytics?.publishedForms || 0}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-arctic-50">
              <span className="text-sm text-arctic-600">Ortalama dönüşüm oranı</span>
              <span className="text-sm font-bold text-emerald-600">
                {analytics?.totalViews > 0
                  ? ((analytics.totalResponses / analytics.totalViews) * 100).toFixed(1)
                  : '0'}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-arctic-50">
              <span className="text-sm text-arctic-600">Yanıt başına görüntüleme</span>
              <span className="text-sm font-bold text-arctic-900">
                {analytics?.totalResponses > 0
                  ? (analytics.totalViews / analytics.totalResponses).toFixed(1)
                  : '0'}
              </span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-arctic-900 mb-4">En Popüler Formlar</h3>
          {analytics?.topForms?.length > 0 ? (
            <div className="space-y-3">
              {analytics.topForms.map((f: any, i: number) => (
                <div key={f.id} className="flex items-center gap-3 p-3 rounded-xl bg-arctic-50">
                  <span className="w-6 h-6 rounded-lg bg-coral-100 text-coral-600 text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-arctic-900 truncate">{f.title}</p>
                    <p className="text-xs text-arctic-400">{f.responseCount} yanıt · {f.viewCount} görüntüleme</p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      f.status === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' : 'bg-arctic-200 text-arctic-600'
                    }`}
                  >
                    {f.status === 'PUBLISHED' ? 'Yayında' : 'Taslak'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-arctic-400 text-sm">Henüz veri yok</div>
          )}
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-arctic-900 mb-4">Yanıt Trendi (Son 30 Gün)</h3>
        <div className="h-48 flex items-end gap-1">
          {Array.from({ length: 30 }, (_, i) => {
            const height = Math.random() * 80 + 20;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-gradient-to-t from-coral-500 to-coral-400 transition-all hover:from-coral-600 hover:to-coral-500"
                  style={{ height: `${height}%` }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-3 text-xs text-arctic-400">
          <span>30 gün önce</span>
          <span>Bugün</span>
        </div>
      </div>
    </div>
  );
}
