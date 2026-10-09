import { useEffect, useState } from 'react';
import { deleteRegistration, getRegistration, updatePayment, updateStatus } from '../api/admin';
import { ApiError } from '../api/http';
import { ErrorList } from '../components/ErrorList';
import type { PaymentStatus, Registration, RegistrationStatus } from '../types';
import { DETAIL_SECTIONS, displayValue, labelFor, legacyKeys, studentName } from './display';
import { PAYMENT_LABELS, STATUS_LABELS } from './labels';

interface Props {
  id: string | number;
  onClose: () => void;
  onChanged: () => void;
}

export function RegistrationDetail({ id, onClose, onChanged }: Props) {
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getRegistration(id)
      .then((r) => !cancelled && setRegistration(r))
      .catch((e) => !cancelled && setErrors(e instanceof ApiError ? e.messages : ['Error inesperado. / Unexpected error.']));
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Escape cierra la ventana.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const run = async (action: () => Promise<unknown>, okMessage: string) => {
    setBusy(true);
    setErrors([]);
    setMessage('');
    try {
      await action();
      setRegistration(await getRegistration(id));
      setMessage(okMessage);
      onChanged();
    } catch (e) {
      setErrors(e instanceof ApiError ? e.messages : ['Error inesperado. / Unexpected error.']);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm('¿Eliminar esta inscripción para siempre? / Delete this registration permanently?')) return;
    setBusy(true);
    try {
      await deleteRegistration(id);
      onChanged();
      onClose();
    } catch (e) {
      setErrors(e instanceof ApiError ? e.messages : ['Error inesperado. / Unexpected error.']);
      setBusy(false);
    }
  };

  const legacy = registration ? legacyKeys(registration) : [];
  const paidAt = registration ? displayValue('paidAt', registration.paidAt) : '';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal card" role="dialog" aria-modal="true" aria-label={`Inscripción ${id}`}
        onClick={(e) => e.stopPropagation()}>
        <div className="modal-head no-print">
          <h2>#{String(id)} {registration && `— ${studentName(registration)}`}</h2>
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cerrar / Close</button>
        </div>

        <ErrorList messages={errors} />
        {message && <p className="alert alert-ok no-print" role="status">{message}</p>}
        {!registration && errors.length === 0 && <p className="muted">Cargando… / Loading…</p>}

        {registration && (
          <>
            <div className="admin-controls no-print">
              <div className="field">
                <label htmlFor="d-status">Estado / Status</label>
                <select id="d-status" value={registration.status} disabled={busy}
                  onChange={(e) => void run(() => updateStatus(id, e.target.value as RegistrationStatus), 'Estado actualizado. / Status updated.')}>
                  {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div className="field">
                <label htmlFor="d-payment">Pago / Payment</label>
                <select id="d-payment" value={registration.paymentStatus} disabled={busy}
                  onChange={(e) => void run(() => updatePayment(id, e.target.value as PaymentStatus), 'Pago actualizado. / Payment updated.')}>
                  {Object.entries(PAYMENT_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
              <div className="field">
                <span className="label-text">Monto cobrado / Amount paid</span>
                <p>{registration.paymentAmount ? `$${Number(registration.paymentAmount).toFixed(2)} CAD` : '—'}{paidAt && ` · ${paidAt}`}</p>
              </div>
            </div>

            {DETAIL_SECTIONS.map((section) => {
              const rows = section.keys
                .map((key) => [key, displayValue(key, registration[key])] as const)
                .filter(([, text]) => text !== '');
              if (rows.length === 0) return null;
              return (
                <section key={section.title} className="detail-section">
                  <h3 className="section-bar">{section.title}</h3>
                  <dl className="detail-grid">
                    {rows.map(([key, text]) => (
                      <div key={key}><dt>{labelFor(key)}</dt><dd>{text}</dd></div>
                    ))}
                  </dl>
                </section>
              );
            })}

            {legacy.length > 0 && (
              <section className="detail-section">
                <h3 className="section-bar">Datos del formulario anterior / Previous form data</h3>
                <dl className="detail-grid">
                  {legacy.map((key) => (
                    <div key={key}><dt>{labelFor(key)}</dt><dd>{displayValue(key, registration[key])}</dd></div>
                  ))}
                </dl>
              </section>
            )}

            <div className="button-row no-print">
              <button type="button" className="btn btn-primary" onClick={() => window.print()}>
                Imprimir / Guardar PDF — Print / Save as PDF
              </button>
              <button type="button" className="btn btn-danger" onClick={() => void remove()} disabled={busy}>
                Eliminar / Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
