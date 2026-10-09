import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <div className="card status-card">
      <h1>Página no encontrada / Page not found</h1>
      <p>La dirección que busca no existe. / The address you are looking for does not exist.</p>
      <Link to="/" className="btn btn-primary">
        Ir al inicio / Go home
      </Link>
    </div>
  );
}
