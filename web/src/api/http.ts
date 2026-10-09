// Cliente HTTP mínimo. La API vive en la misma dirección web, bajo /api.

export const API_BASE = '/api';

/** Error de la API con mensajes listos para mostrar al usuario. */
export class ApiError extends Error {
  status: number;
  messages: string[];

  constructor(status: number, messages: string[]) {
    super(messages.join(' · '));
    this.status = status;
    this.messages = messages;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string | null;
}

/** Nest devuelve { statusCode, message: string | string[], error }. */
function extractMessages(data: unknown, fallback: string): string[] {
  if (data && typeof data === 'object' && 'message' in data) {
    const message = (data as { message: unknown }).message;
    if (Array.isArray(message)) return message.map(String);
    if (typeof message === 'string' && message) return [message];
  }
  return [fallback];
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, [
      'No se pudo conectar con el servidor. Revise su conexión e intente de nuevo. / Could not reach the server. Check your connection and try again.',
    ]);
  }

  let data: unknown = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    throw new ApiError(response.status, extractMessages(data, `Error ${response.status}`));
  }
  return data as T;
}
