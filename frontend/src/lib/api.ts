// Vercel: no NEXT_PUBLIC_API_URL = same origin. Local: set to http://localhost:4000
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

export function getApiUrl(path: string) {
  const p = path.startsWith('/') ? path : `/${path}`;
  if (API_URL) return `${API_URL}${p}`;
  if (typeof window !== 'undefined') return p;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${p}`;
  return `http://localhost:4000${p}`;
}

export async function api<T>(
  path: string,
  options: RequestInit & { token?: string } = {}
): Promise<T> {
  const { token, ...init } = options;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };
  if (token) (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;

  const res = await fetch(getApiUrl(path), { ...init, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data as T;
}
