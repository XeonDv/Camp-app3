import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ErrorList } from '../components/ErrorList';
import { useCheckout } from '../api/useCheckout';
import { savedRegistration } from '../form/formState';

export function PaymentCancelledPage() {
  const [params] = useSearchParams();
  const [id] = useState(() => params.get('id') ?? savedRegistration.get());
  const checkout = useCheckout();

  return (
    <div className="card status-card">
      <h1>Pago no completado / Payment not completed</h1>
      <p>
        El pago no se completó, pero su registro está guardado. Puede intentar pagar de nuevo cuando quiera.
      </p>
      <p>The payment was not completed, but your registration is saved. You can try to pay again at any time.</p>
      {id && (
        <p className="reference">
          Número de referencia / Reference number: <strong>#{id}</strong>
        </p>
      )}
      <ErrorList messages={checkout.errors} title="No pudimos iniciar el pago. / We could not start the payment." />
      <div className="button-row">
        {id ? (
          <button
            type="button"
            className="btn btn-primary"
            disabled={checkout.loading}
            onClick={() => void checkout.start(id)}
          >
            {checkout.loading ? 'Redirigiendo… / Redirecting…' : 'Intentar pagar de nuevo / Try payment again'}
          </button>
        ) : (
          <Link to="/" className="btn btn-primary">
            Ir al formulario / Go to the form
          </Link>
        )}
      </div>
    </div>
  );
}
