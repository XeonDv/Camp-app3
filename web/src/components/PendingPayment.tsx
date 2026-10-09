import { ErrorList } from './ErrorList';

interface Props {
  registrationId: string | number;
  loading: boolean;
  errors: string[];
  onRetry: () => void;
  onNewRegistration: () => void;
}

/**
 * Se muestra cuando el registro ya está guardado pero el pago no se completó
 * (falló la creación del pago o se recargó la página). Solo reintenta el pago.
 */
export function PendingPayment({ registrationId, loading, errors, onRetry, onNewRegistration }: Props) {
  return (
    <div className="card status-card">
      <h1>Registro guardado / Registration saved</h1>
      <p>
        Su registro (referencia <strong>#{registrationId}</strong>) está guardado. Falta completar el pago de la
        cuota de registro de $350 CAD.
      </p>
      <p>
        Your registration (reference <strong>#{registrationId}</strong>) is saved. The $350 CAD registration fee
        still needs to be paid.
      </p>
      {loading && <p className="muted">Redirigiendo al pago seguro… / Redirecting to secure payment…</p>}
      <ErrorList
        messages={errors}
        title="No pudimos iniciar el pago. Su registro NO se duplicará al reintentar. / We could not start the payment. Retrying will NOT duplicate your registration."
      />
      <div className="button-row">
        <button type="button" className="btn btn-primary" onClick={onRetry} disabled={loading}>
          Reintentar pago / Retry payment
        </button>
        <button type="button" className="btn btn-ghost" onClick={onNewRegistration} disabled={loading}>
          Nuevo registro / Start a new registration
        </button>
      </div>
    </div>
  );
}
