/**
 * Production: set VITE_API_BASE on the static host (e.g. Render), e.g.
 *   https://your-backend.onrender.com/api
 * Optional override:
 *   VITE_WS_URL=wss://your-backend.onrender.com/ws/live
 */
const DEFAULT_API_BASE = 'http://127.0.0.1:8000/api';

export function getApiBase() {
  const fromEnv = import.meta.env.VITE_API_BASE;
  return (fromEnv && String(fromEnv).trim()) || DEFAULT_API_BASE;
}

export function getWsLiveUrl() {
  const explicit = import.meta.env.VITE_WS_URL;
  if (explicit && String(explicit).trim()) return String(explicit).trim();

  let base = getApiBase().replace(/\/+$/, '');
  if (base.endsWith('/api')) base = base.slice(0, -4);

  const isHttpsPage = typeof window !== 'undefined' && window.location?.protocol === 'https:';
  const wsProtocol = isHttpsPage ? 'wss:' : 'ws:';

  try {
    const u = new URL(base);
    u.protocol = wsProtocol;
    u.pathname = '/ws/live';
    u.search = '';
    u.hash = '';
    return u.toString();
  } catch {
    return `${wsProtocol}//${base.replace(/^https?:\/\//, '')}/ws/live`;
  }
}
