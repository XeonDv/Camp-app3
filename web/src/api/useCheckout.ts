import { useCallback, useState } from 'react';
import { ApiError } from './http';
import { createCheckout } from './public';

/**
 * Inicia el pago en Stripe para un registro ya creado y redirige al usuario.
 * Nunca vuelve a crear el registro: solo pide una nueva sesión de pago.
 */
export function useCheckout() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const start = useCallback(async (registrationId: string | number) => {
    setLoading(true);
    setErrors([]);
    try {
      const { url } = await createCheckout(registrationId);
      if (!url) throw new ApiError(0, ['El servidor no devolvió la página de pago. / The server did not return a payment page.']);
      window.location.assign(url);
      // Dejamos loading=true: el navegador está saliendo hacia Stripe.
    } catch (error) {
      setErrors(error instanceof ApiError ? error.messages : ['Error inesperado. / Unexpected error.']);
      setLoading(false);
    }
  }, []);

  return { start, loading, errors };
}
