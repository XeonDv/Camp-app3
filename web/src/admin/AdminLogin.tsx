import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from '../api/admin';
import { setToken } from '../api/auth';
import { ApiError } from '../api/http';
import { ErrorList } from '../components/ErrorList';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErrors([]);
    try {
      const { access_token } = await login(email.trim(), password);
      setToken(access_token);
    } catch (error) {
      setErrors(
        error instanceof ApiError && error.status === 401
          ? ['Correo o contraseña incorrectos. / Wrong email or password.']
          : error instanceof ApiError
            ? error.messages
            : ['Error inesperado. / Unexpected error.'],
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="app-shell">
      <main className="container main">
        <form className="card status-card admin-login" onSubmit={submit}>
          <img src="/ylc-logo.png" alt="Young Leaders Camp" className="logo" />
          <h1>Admin Login</h1>
          <div className="field">
            <label htmlFor="admin-email">Email</label>
            <input id="admin-email" type="email" autoComplete="username" required value={email}
              onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="admin-password">Contraseña / Password</label>
            <input id="admin-password" type="password" autoComplete="current-password" required value={password}
              onChange={(e) => setPassword(e.target.value)} />
          </div>
          <ErrorList messages={errors} />
          <div className="button-row">
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy ? 'Entrando… / Signing in…' : 'Entrar / Sign in'}
            </button>
            <Link to="/" className="btn btn-ghost">← Formulario / Form</Link>
          </div>
        </form>
      </main>
    </div>
  );
}
