const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

export interface AuthUser {
  id: string;
  email: string;
  role: 'OWNER_ADMIN' | 'EMPLOYEE' | 'CUSTOMER';
  status: 'ACTIVE' | 'DISABLED' | 'SUSPENDED';
  firstName: string;
  lastName: string;
  phone?: string;
  employeeProfile?: {
    id: string;
    staffCode: string;
    displayName: string;
    jobTitle: string;
  } | null;
  customerProfile?: {
    id: string;
  } | null;
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('beyond_auth_token');
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('beyond_session_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAuthSession(token: string, user: AuthUser) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('beyond_auth_token', token);
  localStorage.setItem('beyond_session_user', JSON.stringify(user));
  // Also set cookie for client/server alignment
  document.cookie = `token=${token}; path=/; max-age=604800; SameSite=Lax`;
}

export function clearAuthSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('beyond_auth_token');
  localStorage.removeItem('beyond_session_user');
  document.cookie = 'token=; path=/; max-age=0';
}

export async function apiRequest<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; error?: string; message?: string }> {
  const token = getAuthToken();
  const url = path.startsWith('http') ? path : `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: 'omit', // JWT bearer header used for cross-origin reliability
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      const errorMsg = body?.error || body?.message || `Request failed with status ${res.status}`;
      return { success: false, error: errorMsg };
    }

    return body || { success: true };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error: could not connect to salon backend.',
    };
  }
}

