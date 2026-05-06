/**
 * Production: set VITE_API_BASE on the static host (e.g. Render), e.g.
 *   https://your-backend.onrender.com/api
 * Optional override:
 *   VITE_WS_URL=wss://your-backend.onrender.com/ws/live
 */
const DEFAULT_API_BASE = 'http://127.0.0.1:8000/api';

function isLocalHost() {
  if (typeof window === 'undefined') return true;
  const host = window.location?.hostname || '';
  return host === 'localhost' || host === '127.0.0.1';
}

function getBrowserOriginApiBase() {
  if (typeof window === 'undefined') return null;
  const origin = window.location?.origin;
  return origin ? `${origin.replace(/\/+$/, '')}/api` : null;
}

function getRenderHeuristicApiBase() {
  if (typeof window === 'undefined') return null;
  const host = window.location?.hostname || '';
  const protocol = window.location?.protocol || 'https:';

  if (!host.endsWith('.onrender.com')) return null;

  // Common setup: frontend service named "...-frontend", backend "...-backend".
  const backendHost = host
    .replace('-frontend.onrender.com', '-backend.onrender.com')
    .replace('-ui.onrender.com', '-backend.onrender.com')
    .replace('-client.onrender.com', '-backend.onrender.com');

  if (backendHost === host) return null;
  return `${protocol}//${backendHost}/api`;
}

export function getApiBase() {
  const fromEnv = import.meta.env.VITE_API_BASE;
  if (fromEnv && String(fromEnv).trim()) return String(fromEnv).trim();

  // Local development defaults to local backend.
  if (isLocalHost()) return DEFAULT_API_BASE;

  // Render fallback when frontend/backend are separate services.
  const renderHeuristic = getRenderHeuristicApiBase();
  if (renderHeuristic) return renderHeuristic;

  // Deployed frontend without explicit env: try same-origin backend.
  return getBrowserOriginApiBase() || DEFAULT_API_BASE;
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
