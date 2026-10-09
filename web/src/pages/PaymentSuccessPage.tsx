import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getPaymentStatus } from '../api/public';
import { clearDraft, savedRegistration } from '../form/formState';

const POLL_EVERY_MS = 2000;
const POLL_MAX_MS = 20000;

type State = 'checking' | 'paid' | 'unconfirmed';

export function PaymentSuccessPage() {
  const [params] = useSearchParams();
  const [id] = useState(() => params.get('id') ?? savedRegistration.get());
  const [state, setState] = useState<State>('checking');

  // El pago ya se hizo: limpiamos lo guardado en este navegador.
  useEffect(() => {
    clearDraft();
    savedRegistration.clear();
  }, []);

  // Preguntamos al servidor cada 2 s (máx. ~20 s) hasta que el pago figure como recibido.
  useEffect(() => {
    if (!id) {
      setState('unconfirmed');
      return;
    }
    let cancelled = false;
    const startedAt = Date.now();

    const check = async () => {
      try {
        const { paymentStatus } = await getPaymentStatus(id);
        if (cancelled) return;
        if (paymentStatus === 'paid') {
          setState('paid');
          return;
        }
      } catch {
        /* seguimos intentando hasta agotar el tiempo */
      }
      if (cancelled) return;
      if (Date.now() - startedAt >= POLL_MAX_MS) setState('unconfirmed');
      else timer = setTimeout(check, POLL_EVERY_MS);
    };

    let timer = setTimeout(check, 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [id]);

  return (
    <div className="card status-card" aria-live="polite">
      {state === 'checking' && (
        <>
          <h1>Confirmando su pago… / Confirming your payment…</h1>
          <p className="muted">Esto toma unos segundos. / This takes a few seconds.</p>
          <div className="spinner" aria-hidden="true" />
        </>
      )}
      {state === 'paid' && (
        <>
          <div className="status-icon ok" aria-hidden="true">✓</div>
          <h1>Pago recibido / Payment received</h1>
          <p>Gracias por registrarse en Young Leaders Camp 2027. / Thank you for registering for Young Leaders Camp 2027.</p>
        </>
      )}
      {state === 'unconfirmed' && (
        <>
          <h1>Gracias / Thank you</h1>
          <p>
            Estamos confirmando su pago; recibirá la confirmación pronto. / We are confirming your payment; you
            will receive confirmation soon.
          </p>
        </>
      )}

      {id && (
        <p className="reference">
          Número de referencia / Reference number: <strong>#{id}</strong>
        </p>
      )}
      <p className="notice-inline">
        Recuerde enviar el pasaporte del estudiante a info.mexico@ylcamp.com. / Remember to email the student's
        passport to info.mexico@ylcamp.com.
      </p>
      <Link to="/" className="btn btn-ghost">
        Volver al inicio / Back to start
      </Link>
    </div>
  );
}
