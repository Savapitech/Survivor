export class ApiError extends Error {
  status: number;
  details: string[];

  constructor(status: number, message: string | string[]) {
    const details = Array.isArray(message) ? message : [message];
    super(details.join(' '));
    this.status = status;
    this.details = details;
  }
}

type QueryValue = string | number | boolean | number[] | string[] | undefined;

const API_URL = import.meta.env.VITE_API_URL;

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  body?: unknown;
  query?: object;
}

function buildQueryString(query?: object): string {
  if (!query) return '';
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(
    query as Record<string, QueryValue>,
  )) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      if (value.length === 0) continue;
      params.set(key, value.join(','));
    } else {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, query } = options;
  const response = await fetch(`${API_URL}${path}${buildQueryString(query)}`, {
    method,
    headers:
      body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const isJson = response.headers
    .get('content-type')
    ?.includes('application/json');
  const payload = isJson ? await response.json() : undefined;

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'message' in payload
        ? (payload as { message: string | string[] }).message
        : `Erreur ${response.status}`;
    throw new ApiError(response.status, message);
  }

  return payload as T;
}
