import type {
  PaymentStatus,
  Registration,
  RegistrationList,
  RegistrationStats,
  RegistrationStatus,
} from '../types';
import { clearToken, currentToken } from './auth';
import { ApiError, request } from './http';

/** Llamada con token. Si el servidor responde 401, cerramos la sesión (vuelve el login). */
async function adminRequest<T>(path: string, options: Parameters<typeof request>[1] = {}): Promise<T> {
  try {
    return await request<T>(path, { ...options, token: currentToken() });
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) clearToken();
    throw error;
  }
}

export function login(email: string, password: string) {
  return request<{ access_token: string; user: { id: string | number; email: string; role: string } }>(
    '/auth/login',
    { method: 'POST', body: { email, password } },
  );
}

export interface ListParams {
  search: string;
  status: string;
  paymentStatus: string;
  page: number;
  limit: number;
}

export function listRegistrations(params: ListParams) {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.status) query.set('status', params.status);
  if (params.paymentStatus) query.set('paymentStatus', params.paymentStatus);
  query.set('page', String(params.page));
  query.set('limit', String(params.limit));
  return adminRequest<RegistrationList>(`/registrations?${query.toString()}`);
}

export const getRegistration = (id: string | number) =>
  adminRequest<Registration>(`/registrations/${encodeURIComponent(String(id))}`);

export const updateStatus = (id: string | number, status: RegistrationStatus) =>
  adminRequest<unknown>(`/registrations/${encodeURIComponent(String(id))}/status`, {
    method: 'PATCH',
    body: { status },
  });

export const updatePayment = (id: string | number, paymentStatus: PaymentStatus, paymentAmount?: number) =>
  adminRequest<unknown>(`/registrations/${encodeURIComponent(String(id))}/payment`, {
    method: 'PATCH',
    body: paymentAmount === undefined ? { paymentStatus } : { paymentStatus, paymentAmount },
  });

export const deleteRegistration = (id: string | number) =>
  adminRequest<unknown>(`/registrations/${encodeURIComponent(String(id))}`, { method: 'DELETE' });

export const getStats = () => adminRequest<RegistrationStats>('/stats/registrations');
