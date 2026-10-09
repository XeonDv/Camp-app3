import { useSyncExternalStore } from 'react';

const TOKEN_KEY = 'ylc_admin_token';
const listeners = new Set<() => void>();

export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

// Si localStorage no está disponible, guardamos el token en memoria.
let memoryToken: string | null = null;

export function setToken(token: string): void {
  memoryToken = token;
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* ignorar */
  }
  listeners.forEach((l) => l());
}

export function clearToken(): void {
  memoryToken = null;
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignorar */
  }
  listeners.forEach((l) => l());
}

function readToken(): string | null {
  return getToken() ?? memoryToken;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Hook: devuelve el token actual y se actualiza al iniciar/cerrar sesión. */
export function useAdminToken(): string | null {
  return useSyncExternalStore(subscribe, readToken);
}

export { readToken as currentToken };
