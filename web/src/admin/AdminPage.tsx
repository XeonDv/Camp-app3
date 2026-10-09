import { useAdminToken } from '../api/auth';
import { AdminDashboard } from './AdminDashboard';
import { AdminLogin } from './AdminLogin';

/** /admin: muestra el inicio de sesión o el panel, según haya o no sesión iniciada. */
export function AdminPage() {
  const token = useAdminToken();
  return token ? <AdminDashboard /> : <AdminLogin />;
}
