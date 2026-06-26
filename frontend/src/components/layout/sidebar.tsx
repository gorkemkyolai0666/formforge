'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import {
  FileText, LayoutDashboard, BarChart3, Settings, LogOut, Plus, Bell, ChevronDown,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

const navItems = [
  { href: '/dashboard', label: 'Kontrol Paneli', icon: LayoutDashboard },
  { href: '/analytics', label: 'Analitik', icon: BarChart3 },
  { href: '/settings', label: 'Ayarlar', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, token, logout } = useAuth();
  const [notifCount, setNotifCount] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;
    api.notifications.unreadCount(token).then((d) => setNotifCount(d.count)).catch(() => {});
  }, [token]);

  const handleBellClick = async () => {
    setShowNotifs(!showNotifs);
    if (!showNotifs && token) {
      try {
        const data = await api.notifications.list(token);
        setNotifications(data);
      } catch {}
    }
  };

  const handleMarkAllRead = async () => {
    if (!token) return;
    try {
      await api.notifications.markAllRead(token);
      setNotifCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-arctic-200/60 flex flex-col z-40">
      <div className="p-6 border-b border-arctic-200/60">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-coral-500 to-coral-600 flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-arctic-900">
            Form<span className="text-coral-500">Forge</span>
          </span>
        </Link>
      </div>

      <div className="p-4">
        <Link
          href="/forms/new"
          className="btn-coral w-full py-2.5 flex items-center justify-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> Yeni Form
        </Link>
      </div>

      <nav className="flex-1 px-3 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition-all ${
                isActive
                  ? 'bg-coral-50 text-coral-600 border border-coral-200/60'
                  : 'text-arctic-600 hover:bg-arctic-50 hover:text-arctic-900'
              }`}
            >
              <item.icon className="w-4.5 h-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-arctic-200/60">
        <div className="relative mb-2">
          <button
            onClick={handleBellClick}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm text-arctic-600 hover:bg-arctic-50 transition-all"
          >
            <span className="flex items-center gap-3">
              <Bell className="w-4 h-4" />
              Bildirimler
            </span>
            {notifCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-coral-500 text-white text-[10px] font-bold flex items-center justify-center">
                {notifCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-xl shadow-xl border border-arctic-200 max-h-80 overflow-y-auto z-50">
              <div className="p-3 border-b border-arctic-100 flex items-center justify-between">
                <span className="text-sm font-semibold text-arctic-900">Bildirimler</span>
                {notifCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-coral-500 hover:text-coral-600 font-medium"
                  >
                    Tümünü okundu işaretle
                  </button>
                )}
              </div>
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-arctic-400">Bildirim yok</div>
              ) : (
                notifications.slice(0, 10).map((n) => (
                  <div
                    key={n.id}
                    className={`p-3 border-b border-arctic-50 last:border-0 ${!n.isRead ? 'bg-coral-50/30' : ''}`}
                  >
                    <p className="text-sm font-medium text-arctic-800">{n.title}</p>
                    <p className="text-xs text-arctic-500 mt-0.5">{n.body}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 px-3 py-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-coral-400 to-coral-500 flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-arctic-900 truncate">{user?.name || 'Kullanıcı'}</p>
            <p className="text-xs text-arctic-400 truncate">{user?.plan || 'FREE'}</p>
          </div>
          <button onClick={logout} className="p-1.5 rounded-lg hover:bg-arctic-100 text-arctic-400 hover:text-arctic-600 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
