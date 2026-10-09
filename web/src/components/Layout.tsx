import { Link, Outlet } from 'react-router-dom';

/** Marco de las páginas públicas: cabecera con logo y pie de página. */
export function PublicLayout() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="logo-link" aria-label="Young Leaders Camp">
            <img src="/ylc-logo.png" alt="Young Leaders Camp" className="logo" />
          </Link>
          <Link to="/admin" className="admin-link">
            Admin
          </Link>
        </div>
      </header>
      <main className="container main">
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="container">
          <strong>Young Leaders Camp / YLCamp</strong> · 421 Eglinton Ave W, Suite #8 · Toronto, ON M5N 1A4,
          Canada
        </div>
      </footer>
    </div>
  );
}
