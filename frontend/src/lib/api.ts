const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5235/api';

interface FetchOptions extends RequestInit {
  token?: string;
}

async function fetchApi(endpoint: string, options: FetchOptions = {}) {
  const { token, ...fetchOptions } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Bir hata oluştu' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  auth: {
    login: (email: string, password: string) =>
      fetchApi('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
    register: (email: string, password: string, name?: string) =>
      fetchApi('/auth/register', { method: 'POST', body: JSON.stringify({ email, password, name }) }),
    profile: (token: string) =>
      fetchApi('/auth/profile', { token }),
  },
  users: {
    dashboardStats: (token: string) =>
      fetchApi('/users/dashboard-stats', { token }),
    update: (token: string, data: any) =>
      fetchApi('/users/me', { method: 'PATCH', token, body: JSON.stringify(data) }),
  },
  forms: {
    list: (token: string) =>
      fetchApi('/forms', { token }),
    get: (id: string, token: string) =>
      fetchApi(`/forms/${id}`, { token }),
    getPublic: (id: string) =>
      fetchApi(`/forms/${id}/public`),
    create: (token: string, data: any) =>
      fetchApi('/forms', { method: 'POST', token, body: JSON.stringify(data) }),
    update: (id: string, token: string, data: any) =>
      fetchApi(`/forms/${id}`, { method: 'PATCH', token, body: JSON.stringify(data) }),
    delete: (id: string, token: string) =>
      fetchApi(`/forms/${id}`, { method: 'DELETE', token }),
    publish: (id: string, token: string) =>
      fetchApi(`/forms/${id}/publish`, { method: 'POST', token }),
    duplicate: (id: string, token: string) =>
      fetchApi(`/forms/${id}/duplicate`, { method: 'POST', token }),
  },
  fields: {
    list: (formId: string, token: string) =>
      fetchApi(`/forms/${formId}/fields`, { token }),
    create: (formId: string, token: string, data: any) =>
      fetchApi(`/forms/${formId}/fields`, { method: 'POST', token, body: JSON.stringify(data) }),
    update: (id: string, token: string, data: any) =>
      fetchApi(`/fields/${id}`, { method: 'PATCH', token, body: JSON.stringify(data) }),
    delete: (id: string, token: string) =>
      fetchApi(`/fields/${id}`, { method: 'DELETE', token }),
    reorder: (formId: string, token: string, fieldOrders: any[]) =>
      fetchApi(`/forms/${formId}/fields/reorder`, { method: 'PATCH', token, body: JSON.stringify({ fieldOrders }) }),
  },
  responses: {
    submit: (formId: string, data: any) =>
      fetchApi(`/forms/${formId}/responses`, { method: 'POST', body: JSON.stringify(data) }),
    list: (formId: string, token: string) =>
      fetchApi(`/forms/${formId}/responses`, { token }),
    get: (id: string, token: string) =>
      fetchApi(`/responses/${id}`, { token }),
  },
  analytics: {
    global: (token: string) =>
      fetchApi('/analytics/global', { token }),
    form: (formId: string, token: string) =>
      fetchApi(`/forms/${formId}/analytics`, { token }),
    fields: (formId: string, token: string) =>
      fetchApi(`/forms/${formId}/analytics/fields`, { token }),
    funnel: (formId: string, token: string) =>
      fetchApi(`/forms/${formId}/analytics/funnel`, { token }),
  },
  notifications: {
    list: (token: string) =>
      fetchApi('/notifications', { token }),
    unreadCount: (token: string) =>
      fetchApi('/notifications/unread-count', { token }),
    markRead: (id: string, token: string) =>
      fetchApi(`/notifications/${id}/read`, { method: 'PATCH', token }),
    markAllRead: (token: string) =>
      fetchApi('/notifications/read-all', { method: 'PATCH', token }),
  },
  health: () => fetchApi('/health'),
};
