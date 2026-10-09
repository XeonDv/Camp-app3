import type { CreatedRegistration } from '../types';
import { request } from './http';

export function createRegistration(payload: Record<string, unknown>) {
  return request<CreatedRegistration>('/registrations', { method: 'POST', body: payload });
}

/** Pide a la API una sesión de pago de Stripe. Devuelve la dirección a la que redirigir. */
export function createCheckout(registrationId: string | number) {
  return request<{ url: string }>('/payments/checkout', {
    method: 'POST',
    body: { registrationId },
  });
}

export function getPaymentStatus(registrationId: string | number) {
  return request<{ paymentStatus: string }>(
    `/payments/status/${encodeURIComponent(String(registrationId))}`,
  );
}
