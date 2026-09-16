import { API_BASE_URL } from '../config/api';

// In-Memory Token Holder
let inMemoryAccessToken: string | null = null;
let onTokenExpiredCallback: (() => void) | null = null;
let isRefreshing = false;
let refreshSubscribers: ((token: string | null) => void)[] = [];

export const getAccessToken = (): string | null => inMemoryAccessToken;

export const setAccessToken = (token: string | null): void => {
  inMemoryAccessToken = token;
};

export const setOnTokenExpired = (cb: () => void): void => {
  onTokenExpiredCallback = cb;
};

const subscribeTokenRefresh = (cb: (token: string | null) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string | null) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

export const refreshSession = async (): Promise<{ token: string; user: any } | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    if (!res.ok) {
      setAccessToken(null);
      return null;
    }

    const data = await res.json();
    if (data.token) {
      setAccessToken(data.token);
      return data;
    }
    return null;
  } catch (err) {
    setAccessToken(null);
    return null;
  }
};

export const fetchWithAuth = async (
  input: string | RequestInfo,
  init?: RequestInit
): Promise<Response> => {
  const url = typeof input === 'string' && input.startsWith('/')
    ? `${API_BASE_URL}${input}`
    : input;

  const headers = new Headers(init?.headers || {});
  if (inMemoryAccessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${inMemoryAccessToken}`);
  }

  const config: RequestInit = {
    ...init,
    headers,
    credentials: 'include', // Ensure HttpOnly cookies are always attached
  };

  let response = await fetch(url, config);

  // If 401 Unauthorized and not already calling /auth/refresh or /auth/login
  const urlString = typeof input === 'string' ? input : input.url;
  const isAuthEndpoint = urlString.includes('/auth/refresh') || urlString.includes('/auth/login') || urlString.includes('/auth/register');

  if (response.status === 401 && !isAuthEndpoint) {
    if (!isRefreshing) {
      isRefreshing = true;
      const refreshResult = await refreshSession();
      isRefreshing = false;

      if (refreshResult && refreshResult.token) {
        onRefreshed(refreshResult.token);
      } else {
        onRefreshed(null);
        if (onTokenExpiredCallback) {
          onTokenExpiredCallback();
        }
        return response;
      }
    }

    // Wait for the in-flight refresh to complete
    const retryPromise = new Promise<Response>((resolve) => {
      subscribeTokenRefresh(async (newToken) => {
        if (newToken) {
          const retryHeaders = new Headers(init?.headers || {});
          retryHeaders.set('Authorization', `Bearer ${newToken}`);
          resolve(
            fetch(url, {
              ...init,
              headers: retryHeaders,
              credentials: 'include',
            })
          );
        } else {
          resolve(response);
        }
      });
    });

    return retryPromise;
  }

  return response;
};

export const apiClient = {
  get: (url: string, init?: RequestInit) => fetchWithAuth(url, { ...init, method: 'GET' }),
  post: (url: string, body?: any, init?: RequestInit) =>
    fetchWithAuth(url, {
      ...init,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  put: (url: string, body?: any, init?: RequestInit) =>
    fetchWithAuth(url, {
      ...init,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  delete: (url: string, init?: RequestInit) => fetchWithAuth(url, { ...init, method: 'DELETE' }),
};
