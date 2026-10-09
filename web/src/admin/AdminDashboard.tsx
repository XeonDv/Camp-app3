import { FormEvent, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getStats, listRegistrations } from '../api/admin';
import { clearToken } from '../api/auth';
import { ApiError } from '../api/http';
import { ErrorList } from '../components/ErrorList';
import type { Registration, RegistrationList, RegistrationStats } from '../types';
import { displayValue, studentName } from './display';
import { RegistrationDetail } from './RegistrationDetail';
import { PAYMENT_LABELS, STATUS_LABELS } from './labels';

const PAGE_SIZE = 15;

function money(value: unknown): string {
  const n = Number(value ?? 0);
  return `$${n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} CAD`;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<RegistrationStats | null>(null);
  const [list, setList] = useState<RegistrationList | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [openId, setOpenId] = useState<string | number | null>(null);

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    setLoading(true);
    setErrors([]);
    try {
      const [s, l] = await Promise.all([
        getStats(),
        listRegistrations({ search, status, paymentStatus, page, limit: PAGE_SIZE }),
      ]);
      setStats(s);
      setList(l);
    } catch (error) {
      if (!(error instanceof ApiError && error.status === 401)) {
        setErrors(error instanceof ApiError ? error.messages : ['Error inesperado. / Unexpected error.']);
      }
    } finally {
      setLoading(false);
    }
  }, [search, status, paymentStatus, page]);

  useEffect(() => {
    void load();
  }, [load]);

  const submitSearch = (e: FormEvent) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const totalPages = list?.meta.totalPages ?? 1;

  return (
    <div className="admin">
      <header className="site-header">
        <div className="container header-inner">
          <img src="/ylc-logo.png" alt="Young Leaders Camp" className="logo" />
          <div className="button-row">
            <Link to="/" className="btn btn-ghost">Formulario / Form</Link>
            <button type="button" className="btn btn-ghost" onClick={clearToken}>
              Salir / Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="container main">
        <h1>Inscripciones / Registrations</h1>

        <section className="stat-cards" aria-label="Resumen / Summary">
          <div className="stat"><span>Total</span><strong>{stats?.totalRegistrations ?? '—'}</strong></div>
          <div className="stat"><span>Pendientes / Pending</span><strong>{stats?.pendingRegistrations ?? '—'}</strong></div>
          <div className="stat"><span>Aprobadas / Approved</span><strong>{stats?.approvedRegistrations ?? '—'}</strong></div>
          <div className="stat"><span>Cobrado / Collected</span><strong>{stats ? money(stats.totalRevenue) : '—'}</strong></div>
        </section>

        <form className="card admin-filters" onSubmit={submitSearch}>
          <div className="field">
            <label htmlFor="f-search">Buscar / Search</label>
            <input id="f-search" value={searchInput} placeholder="Nombre, email o referencia / Name, email or reference"
              onChange={(e) => setSearchInput(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="f-status">Estado / Status</label>
            <select id="f-status" value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
              <option value="">Todos / All</option>
              {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-payment">Pago / Payment</label>
            <select id="f-payment" value={paymentStatus} onChange={(e) => { setPage(1); setPaymentStatus(e.target.value); }}>
              <option value="">Todos / All</option>
              {Object.entries(PAYMENT_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Buscar / Search</button>
        </form>

        <ErrorList messages={errors} title="No se pudo cargar la lista. / The list could not be loaded." />

        <div className="card table-card" aria-busy={loading}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Referencia / Ref.</th>
                <th>Estudiante / Student</th>
                <th>Inicio / Start</th>
                <th>Estado / Status</th>
                <th>Pago / Payment</th>
                <th>Recibida / Received</th>
              </tr>
            </thead>
            <tbody>
              {list?.data.map((r: Registration) => (
                <tr key={String(r.id)} onClick={() => setOpenId(r.id)} tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter') setOpenId(r.id); }}>
                  <td>#{String(r.id)}{r.formVersion === '2026' && <span className="tag">2026</span>}</td>
                  <td>{studentName(r)}</td>
                  <td>{displayValue('preferredStartDate', r.preferredStartDate) || '—'}</td>
                  <td><span className={`pill pill-${r.status}`}>{STATUS_LABELS[r.status] ?? r.status}</span></td>
                  <td><span className={`pill pill-${r.paymentStatus}`}>{PAYMENT_LABELS[r.paymentStatus] ?? r.paymentStatus}</span></td>
                  <td>{displayValue('createdAt', r.createdAt) || '—'}</td>
                </tr>
              ))}
              {list && list.data.length === 0 && (
                <tr><td colSpan={6} className="muted">No hay inscripciones. / No registrations found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <nav className="pager" aria-label="Paginación / Pagination">
          <button type="button" className="btn btn-ghost" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>← Anterior</button>
          <span>Página {page} de {totalPages} · {list?.meta.total ?? 0} en total</span>
          <button type="button" className="btn btn-ghost" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Siguiente →</button>
        </nav>
      </main>

      {openId !== null && (
        <RegistrationDetail
          id={openId}
          onClose={() => setOpenId(null)}
          onChanged={() => void load()}
        />
      )}
    </div>
  );
}
